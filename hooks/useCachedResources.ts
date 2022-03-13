import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Global from '../global.variables';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });

        const settings = await AsyncStorage.getItem('settings');

        if (settings) {
          const params = JSON.parse(settings);
          Global.appSettings = {
            darkTheme: false,
            requestAppExit: true,
            requestExamExit: true,
            requestTicketNumber: false,
            oldStyle: false,
            ...params,
          };
        } else {
          Global.appSettings = {
            darkTheme: false,
            requestAppExit: true,
            requestExamExit: true,
            requestTicketNumber: false,
            oldStyle: false,
          };
          AsyncStorage.setItem('settings', JSON.stringify(Global.appSettings));
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
