import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DetailedAlarmMetricDisplay from '../components/DetailedAlarmMetricDisplay';
import { convertArrayToMatrix } from '../utils/helpers';
import { Row } from '../components/Globals/Row';
import initalVentilatorConfiguration from '../constants/InitialVentilatorConfiguration';
import SetParameter from '../interfaces/SetParameter';
import { useReading } from '../logic/useReading';
import { ConnectionsHeader } from '../components/ConnectionsHeader';
import Colors from "../constants/Colors";
export default function AlarmsScreen() {
  const reading = useReading();
  const readingValues = reading.values;
  const [metrics, setMetrics] = useState<SetParameter[][] | null>(null);

  useEffect(() => {
    var parameterAlarmComponentsToShow: SetParameter[] = [
      readingValues.tidalVolume,
      readingValues.plateauPressure,
      readingValues.pip,
      readingValues.peep,
      readingValues.fiO2,
      readingValues.respiratoryRate,
      readingValues.minuteVentilation,
    ];

    setMetrics(() => {
      return convertArrayToMatrix<SetParameter>(
        parameterAlarmComponentsToShow,
        4,
      );
    });
  }, [readingValues]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.generalBackGround
      }}>
      <ConnectionsHeader />
      <View style={styles.gaugeContainer}>
        {/* <ScrollView> */}
        {metrics &&
          metrics?.map((row, index) => {
            return (
              <Row key={row[index]?.name || ''}>
                {row.map((metricToDisplay) => {
                  console.log(metricToDisplay);
                  // check if type is SetParameter
                  if (metricToDisplay.name) {
                    return (
                      <DetailedAlarmMetricDisplay
                        key={metricToDisplay.name}
                        metric={metricToDisplay}
                      />
                    );
                  }
                  return null;
                })}
              </Row>
            );
          })}
        {/* </ScrollView> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gaugeContainer: {
    marginBottom: 15,
    marginTop: 15,
    flex: 9,
    width: '100%',
  },
});