import React from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const ALARMS = {
  'Circuit Integrity Failed': {
    status: 'Circuit Integrity Passing',
    icon: (status: boolean) => (
      <Octicons
        size={50}
        name="circuit-board"
        color={status ? 'red' : 'green'}
      />
    ),
  },
  'Battery in Use': {
    status: 'Battery Disconnected',
    icon: (status: boolean) => (
      <Entypo size={50} name="battery" color={status ? 'red' : 'green'} />
    ),
  },
  'Patient Vent Circuit Disconnected': {
    status: 'Patient Vent Circuit Connected',
    icon: (status: boolean) => (
      <MaterialCommunityIcons
        size={50}
        name="heart-pulse"
        color={status ? 'red' : 'green'}
      />
    ),
  },
  'Flow Sensor Disconnected': {
    status: 'Flow Sensor Connected',
    icon: (status: boolean) => (
      <MaterialCommunityIcons
        size={50}
        name="gauge"
        color={status ? 'red' : 'green'}
      />
    ),
  },
  'Pressure Sensor Disconnected': {
    status: 'Pressure Sensor Connected',
    icon: (status: boolean) => (
      <AntDesign size={50} name="upcircleo" color={status ? 'red' : 'green'} />
    ),
  },
  'Oxygen Sensor Disconnected': {
    status: 'Oxygen Sensor Connected',
    icon: (status: boolean) => (
      <MaterialCommunityIcons
        size={50}
        name="gas-cylinder"
        color={status ? 'red' : 'green'}
      />
    ),
  },
};
