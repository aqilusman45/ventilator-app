import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DetailedAlarmMetricDisplay from '../components/DetailedAlarmMetricDisplay';
import { convertArrayToMatrix } from '../utils/helpers';
import { alarmsMetrics } from '../../sample-data/data';
import { Parameter } from '../Interfaces/Parameter';
import { Row } from '../components/Globals/Row';
export default function AlarmsScreen() {
  const metrics = convertArrayToMatrix<Parameter>(alarmsMetrics, 4);

  return (
    <View style={styles.gaugeContainer}>
      <ScrollView>
        {metrics.map((row) => {
          return (
            <Row>
              {row.map((metricToDisplay) => {
                return (
                  <DetailedAlarmMetricDisplay
                    title={metricToDisplay.title}
                    value={metricToDisplay.value}
                    unit={metricToDisplay.unit}
                    lowerLimit={metricToDisplay.lowerLimit}
                    upperLimit={metricToDisplay.upperLimit}
                  />
                );
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
    width: '100%',
  },
});
