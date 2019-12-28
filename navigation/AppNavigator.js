import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TestScreen from '../screens/TestScreen';

const config = Platform.select({
  web: { headerMode: 'none' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Test: TestScreen
  },
  config
);

HomeStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

const MainStack = createStackNavigator(
  {
    HomeStack: HomeStack,
    SettingsStack: SettingsStack,
  },
  config
);

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainStack,
  })
);
