import DataConfig from '../constants/DataConfig';
import Alarms from '../constants/Alarms';
import VentilationModes from '../constants/VentilationModes';
import SetParameter from '../interfaces/SetParameter';
import { BreathingPhase } from '../enums/BreathingPhase';
import DataLogger from './DataLogger';

let pressureGraph = new Array(DataConfig.graphLength).fill(null);
let volumeGraph = new Array(DataConfig.graphLength).fill(null);
let flowRateGraph = new Array(DataConfig.graphLength).fill(null);
let totalPackets = 0;
let failedPackets = 0;
let interval = 0;
let counterForGraphs = 0;
let breathMarkers: number[] = [];
let previousBreath: BreathingPhase = BreathingPhase.Wait;
const dataLogger = DataLogger();

export const processSerialData = (
  packet: any,
  updateReadingStateFunction: (value: any) => void,
) => {
  totalPackets++;
  if (processIntegrityCheck(packet)) {
    interval++;

    const setTidalVolume = getWordFloat(packet[20], packet[21], 1, 0);
    const measuredTidalVolume = getWordFloat(
      packet[8],
      packet[9],
      4000 / 65535,
      -2000,
    );
    addValueToGraph(measuredTidalVolume, volumeGraph, counterForGraphs);
    const tidalVolumeParameter: SetParameter = {
      name: 'Tidal Volume',
      unit: 'ml',
      setValue: setTidalVolume,
      value: measuredTidalVolume,
      lowerLimit: Math.floor(setTidalVolume - 0.15 * setTidalVolume),
      upperLimit: Math.ceil(setTidalVolume + 0.15 * setTidalVolume),
    };

    const measuredFlowRate = getWordFloat(
      packet[12],
      packet[13],
      400 / 65535,
      -200,
    );
    addValueToGraph(measuredFlowRate, flowRateGraph, counterForGraphs);

    const measuredPressure = getWordFloat(
      packet[10],
      packet[11],
      90 / 65535,
      -30,
    );
    addValueToGraph(measuredPressure, pressureGraph, counterForGraphs);

    const breathingPhase = getBreathingPhase(packet[29]);
    if (
      breathingPhase === BreathingPhase.Inspiratory &&
      previousBreath !== BreathingPhase.Inspiratory
    ) {
      breathMarkers.push(counterForGraphs);
    } else {
      breathMarkers = breathMarkers.filter(
        (value) => value !== counterForGraphs,
      );
    }
    previousBreath = breathingPhase;

    counterForGraphs++;
    if (counterForGraphs >= DataConfig.graphLength) {
      counterForGraphs = 0;
    }

    const setPeep = packet[26] - 30;
    const measuredPeep = getWordFloat(packet[14], packet[15], 40 / 65535, -10);
    const peepParameter: SetParameter = {
      name: 'PEEP',
      unit: 'cmH2O',
      setValue: setPeep,
      value: measuredPeep,
      lowerLimit: 4,
      upperLimit: 21,
    };

    const setInspiratoryPressure = packet[22] - 30;

    const measuredPip = packet[40] - 30;
    const pipParameter: SetParameter = {
      name: 'PIP',
      unit: 'cmH2O',
      setValue: setInspiratoryPressure,
      value: measuredPip,
      lowerLimit: setInspiratoryPressure - 5,
      upperLimit: setInspiratoryPressure + 5,
    };

    const measuredPlateauPressure = getWordFloat(
      packet[16],
      packet[17],
      90 / 65535,
      -30,
    );

    const plateauPressureParameter: SetParameter = {
      name: 'Plateau Pressure',
      unit: 'cmH2O',
      setValue: setInspiratoryPressure,
      value: measuredPlateauPressure,
      lowerLimit: setInspiratoryPressure - 2,
      upperLimit: setInspiratoryPressure + 2,
    };

    const ventilationMode = getVentilationMode(packet[29]);

    let currentAlarms = getAlarmValues(packet);

    const setFiO2lowerBound = packet[25];
    const setFiO2upperBound = packet[44];
    const measuredFiO2 = getWordFloat(packet[18], packet[19], 100 / 65535, 0);
    const fiO2Parameter: SetParameter = {
      name: 'FiO2',
      unit: '%',
      setValue: setFiO2lowerBound,
      setValueText: `${setFiO2lowerBound}-${setFiO2upperBound}`,
      value: measuredFiO2,
      lowerLimit: setFiO2lowerBound - 2,
      upperLimit: setFiO2upperBound + 2,
    };

    const setRespiratoryRate = packet[23];
    const measuredRespiratoryRate = packet[39];
    const respiratoryRateParameter: SetParameter = {
      name: 'Patient Rate',
      unit: 'BPM',
      setValue: setRespiratoryRate,
      value: measuredRespiratoryRate,
      lowerLimit: setRespiratoryRate - 1,
      upperLimit: setRespiratoryRate + 1,
    };

    const setMinuteVentilation = (setTidalVolume / 1000) * setRespiratoryRate;
    const measuredMinuteVentilation = getWordFloat(
      packet[34],
      packet[35],
      40 / 65535,
      0,
    );
    const minuteVentilationParameter: SetParameter = {
      name: 'Minute Vent.',
      unit: 'lpm',
      setValue: setMinuteVentilation,
      value: measuredMinuteVentilation,
      lowerLimit: Math.floor(setMinuteVentilation - 0.1 * setMinuteVentilation),
      upperLimit: Math.ceil(setMinuteVentilation + 0.1 * setMinuteVentilation),
    };
    const reading: any = {
      measuredPressure: measuredPressure,
      peep: peepParameter,
      pip: pipParameter,
      plateauPressure: plateauPressureParameter,
      respiratoryRate: respiratoryRateParameter,
      tidalVolume: tidalVolumeParameter,
      ieRatio: (packet[24] & 0x0f) + ':' + (packet[24] & 0xf0) / 16,
      vti: getWordFloat(packet[30], packet[31], 4000 / 65535, -2000),
      vte: getWordFloat(packet[32], packet[33], 4000 / 65535, -2000),
      minuteVentilation: minuteVentilationParameter,
      fiO2: fiO2Parameter,
      flowRate: measuredFlowRate,
      mode: ventilationMode,
      graphPressure: pressureGraph,
      graphVolume: volumeGraph,
      graphFlow: flowRateGraph,
      packetIntegrityRatio: `${failedPackets} / ${totalPackets}`,
      alarms: currentAlarms,
      breathingPhase: breathingPhase,
      breathMarkers: breathMarkers,
    };
    dataLogger.onDataReading(reading);

    totalPackets++;
    if (interval > DataConfig.screenUpdateInterval) {
      interval = 0;
      updateReadingStateFunction(reading);
    }
  } else {
    failedPackets++;
  }
};

function processIntegrityCheck(packet: any): boolean {
  if (packet.length > DataConfig.totalPacketLength) {
    return false;
  }
  let crc = 0;
  for (let i = 0; i < packet.length - 2; i++) {
    crc = (crc ^ packet[i]) & 0xff;
  }
  if (crc == packet[packet.length - 2]) return true;
  else {
    var data = '';
    for (let i = 0; i < packet.length; i++) {
      data = data + ' ' + parseInt(packet[i]);
    }
    console.log('crc failed ' + data);
  }
  return false;
}

function getWordFloat(
  ByteL: number,
  ByteH: number,
  multiplier: number,
  offset: number,
): number {
  return (ByteL + ByteH * 256) * multiplier + offset;
}

function addValueToGraph(
  value: number,
  graph: number[],
  counter: number,
): void {
  graph[counter++ % DataConfig.graphLength] = value;
  if (counter >= DataConfig.graphLength) {
    counter = 0;
  }

  addGapToGraph(graph, counter);
}

function addGapToGraph(graph: number[], currentValueIndex: number): void {
  const numberOfNullValues = Math.floor(DataConfig.graphLength * 0.02); // 2 % of values should be null
  for (
    let i = currentValueIndex;
    i < currentValueIndex + numberOfNullValues;
    i++
  ) {
    graph[i % DataConfig.graphLength] = null;
  }
}

function getAlarmValues(serialData: Array<number>): Array<string> {
  let alarms: Array<string> = [];
  var bits = 8;
  var alarmIndices = [27, 41, 42];
  for (
    let alarmIndex = 0;
    alarmIndex < bits * alarmIndices.length;
    alarmIndex++
  ) {
    let alarmIndexToCheck = Math.floor(alarmIndex / bits);
    let valueByteToCheckIndex = alarmIndices[alarmIndexToCheck];
    let valueToCheck = serialData[valueByteToCheckIndex];
    let bitIndexToCheck = alarmIndex % bits;
    let isAlarmActive = getValueOfBit(valueToCheck, bitIndexToCheck);
    if (isAlarmActive) {
      alarms.push(Alarms[alarmIndex]);
    }
  }
  return alarms;
}

function getValueOfBit(valueToParse: number, bitIndex: number) {
  const bitIndexNumberForFindingValue = [1, 2, 4, 8, 16, 32, 64, 128];
  return valueToParse & bitIndexNumberForFindingValue[bitIndex];
}

function getVentilationMode(valueToParse: number): string {
  // 0x1C is 00011100 so we find the values contain in bits 2-4
  // we also want the index to retrieve the correct mode from our array
  // so we shift the bits to the end to get the actual value
  const ventilationModeIndex = (valueToParse & 0x1c) >> 2;
  return VentilationModes[ventilationModeIndex];
}

function getBreathingPhase(valueToParse: number): BreathingPhase {
  return valueToParse & 3;
}
