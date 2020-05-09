import * as React from 'react';
import MetricCard from '../MetricCard';
import Colors from '../../constants/Colors';
import {
  ParameterCard,
  ParameterHeader,
  ParameterHeaderText,
  MetricView,
} from './styles';
import { Parameter } from 'src/interfaces/Parameter';
import SetParameter from 'src/interfaces/SetParameter';
import { VentilationMode } from 'src/models/VentilationMode';

export default function DetailedAlarmMetricDisplay({
  lowerLimit,
  title,
  unit,
  upperLimit,
  value,
  setValue,
}: Parameter) {
  const colour = getColourFromValue(value);
  const state = getStateFromValue(value);

  function getColourFromValue(value: number) {
    if (value < lowerLimit || value > upperLimit) {
      return Colors.errorText;
    }
    return Colors.graphcolor;
  }

  function getStateFromValue(value: any) {
    if (value < lowerLimit || value > upperLimit) {
      return 'alarm';
    }
    return 'normal';
  }

  return (
    <ParameterCard>
      <ParameterHeader>
        <ParameterHeaderText>{title}</ParameterHeaderText>
      </ParameterHeader>
      <MetricView>
        <MetricCard
          upperLimit={upperLimit}
          lowerLimit={lowerLimit}
          flex={2}
          setValue={setValue}
          value={value}
          unit={unit}
          state={state}
        />
      </MetricView>
    </ParameterCard>
  );
}

// export default function VentilationModeMetric({
//   breathingType,
//   controlMode,
// }: VentilationMode) {
//   const colour = getColourFromValue(value);
//   const state = getStateFromValue(value);

//   function getColourFromValue(value: number) {
//     if (value < lowerLimit || value > upperLimit) {
//       return Colors.errorText;
//     }
//     return Colors.graphcolor;
//   }

//   function getStateFromValue(value: any) {
//     if (value < lowerLimit || value > upperLimit) {
//       return 'alarm';
//     }
//     return 'normal';
//   }

//   return (
//     <ParameterCard>
//       <ParameterHeader>
//         <ParameterHeaderText>{title}</ParameterHeaderText>
//       </ParameterHeader>
//       <MetricView>
//         <MetricCard
//           upperLimit={upperLimit}
//           lowerLimit={lowerLimit}
//           flex={2}
//           setValue={setValue}
//           value={value}
//           unit={unit}
//           state={state}
//         />
//       </MetricView>
//     </ParameterCard>
//   );
// }
