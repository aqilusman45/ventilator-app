import React from 'react';
import { Header, ConnectionContainer, ConnectionLabel } from './styled';
import { useReading } from '../../logic/useReading';
import { ALARMS } from './icons';
import FontSize from '../../constants/FontSize';

function updateAlarmsUI(alarms: string[]) {
  return Object.keys(ALARMS).map((warning) => {
    let connectionStatus = alarms.includes(warning);

    return (
      <ConnectionContainer key={warning}>
        {ALARMS[warning].icon(connectionStatus)}
        <ConnectionLabel
          fontSize={
            warning.length > 20 && ALARMS[warning].status.length > 20
              ? FontSize.connectionLabelLongText
              : FontSize.connectionLabelShortText
          }>
          {connectionStatus ? warning : ALARMS[warning].status}
        </ConnectionLabel>
      </ConnectionContainer>
    );
  });
}

export const ConnectionsHeader = () => {
  const alarms = useReading().values.alarms;
  return <Header>{updateAlarmsUI(alarms)}</Header>;
};
