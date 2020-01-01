import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';
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

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Test: TestScreen
  },
  config
);

HomeStack.path = '';


const MainStack = createStackNavigator(
  {
    HomeStack: HomeStack
  },
  config
);

const switchNavigator = createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainStack,
});
switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
