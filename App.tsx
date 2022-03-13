import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

import Global from './global.variables';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const screen = Dimensions.get('screen');
  Global.screenWidth = screen.width;
  Global.screenHeight = screen.height;
  Global.smallScreen = Global.screenWidth <= 320;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
