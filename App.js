import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { AsyncStorage } from 'react-native';

import AppNavigator from './navigation/AppNavigator';

let NavigatorComponent;

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return <NavigatorComponent />
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/icon.png')
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font
    }),
    new Promise((resolve) => {
      AsyncStorage.getItem('settings').then(data => {
        if (data) {
          const PARAMS = JSON.parse(data);
          global.darkTheme = PARAMS.darkTheme;
          if (PARAMS.oldStyle) NavigatorComponent = AppNavigator('Home'); else NavigatorComponent = AppNavigator('HomeNew');
        } else {
          NavigatorComponent = AppNavigator('HomeNew');
        }
        return resolve();
      })
    })

  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
};
