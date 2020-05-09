import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DetailedAlarmMetricDisplay from '../components/DetailedAlarmMetricDisplay';
import { convertArrayToMatrix } from '../utils/helpers';
// import { alarmsMetrics } from '../../sample-data/data';
import { Row } from '../components/Globals/Row';
import initalVentilatorConfiguration from '../constants/InitialVentilatorConfiguration';
import VentilatorConfiguration from 'src/interfaces/VentilatorConfiguration';

export default function AlarmsScreen() {
  const metrics = convertArrayToMatrix<VentilatorConfiguration>(
    Object.values(initalVentilatorConfiguration).filter(
      (item) => item.name !== undefined,
    ),
    4,
  );

  return (
    <View style={styles.gaugeContainer}>
      <ScrollView
        style={{
          flexGrow: 1,
        }}>
        {metrics.map((row) => {
          return (
            <Row>
              {row.map((metricToDisplay) => {
                console.log(metricToDisplay);
                // check if type is SetParameter
                if (metricToDisplay.name) {
                  return (
                    <DetailedAlarmMetricDisplay
                      title={metricToDisplay.name}
                      value={metricToDisplay.value}
                      unit={metricToDisplay.unit}
                      setValue={metricToDisplay.setValue}
                      lowerLimit={metricToDisplay.lowerLimit}
                      upperLimit={metricToDisplay.upperLimit}
                    />
                  );
                }

                return null;
              })}
            </Row>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gaugeContainer: {
    marginBottom: 15,
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
});
