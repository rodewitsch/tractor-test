import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import TestScreen from '../screens/TestScreen';

const config = Platform.select({
  web: {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  },
  default: {},
});


export default createAppContainer(
  createStackNavigator(
    {
      Home: HomeScreen,
      Test: TestScreen
    },
    config
  )
);
