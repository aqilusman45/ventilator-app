import * as React from 'react';
import { View } from 'react-native';
import Colors from '../../constants/Colors';

import {
  MetricContainer,
  Value,
  Unit,
  CurrentValueContainer,
  LimitsContainer,
  LimitWrapper,
  LimitValue,
  PresetValue,
  ValueWrapper,
} from './styles';

export default function MetricCard(props: any) {
  const colour = getStateColour(props.state);

  function getStateColour(state: string) {
    switch (state) {
      case 'warning':
        return Colors.warningText;
      case 'alarm':
        return Colors.errorText;
      default:
        return 'grey';
    }
  }

  return (
    <MetricContainer>
      <LimitsContainer>
        <LimitWrapper>
          <LimitValue>{parseFloat(props.upperLimit).toFixed(1)}</LimitValue>
        </LimitWrapper>
        <LimitWrapper>
          <LimitValue>{props.lowerLimit}</LimitValue>
        </LimitWrapper>
      </LimitsContainer>
      <CurrentValueContainer>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <PresetValue>{props.setValue}</PresetValue>
        </View>
        <ValueWrapper>
          <Value color={colour}>{parseFloat(props.value).toFixed(0)}</Value>
          <Unit>{props.unit}</Unit>
        </ValueWrapper>
      </CurrentValueContainer>
    </MetricContainer>
  );
}
