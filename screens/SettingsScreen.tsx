import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, BackHandler, ScrollView, Linking } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import GlobalStyles from '../styles/global';
import Global from '../global.variables';

import BackSvg from '../assets/svg/back.svg';
import SettingsItem from '../components/SettingsItem';
import { NavigationProp, ParamListBase, Theme, useTheme } from '@react-navigation/native';
import { ThemeColorType } from '../constants/Colors';

interface ComponentProps {
  navigation: NavigationProp<ParamListBase>;
}

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: '100%',
    },
    header: {
      backgroundColor: colors.middleground,
      ...GlobalStyles.flexRow,
      alignItems: 'center',
      padding: 20,
    },
    headerTitle: {
      color: colors.text,
      fontSize: Global.smallScreen ? 15 : 18,
    },
    settingsGroup: {
      backgroundColor: colors.middleground,
      padding: 20,
      marginTop: 15,
    },
    settingsGroupTitle: {
      color: '#BD0008',
      fontSize: Global.smallScreen ? 13 : 15,
      fontWeight: 'bold',
    },
    settingLabel: {
      color: colors.text,
      fontSize: Global.smallScreen ? 13 : 15,
      marginTop: 15,
    },
  });

export default function (props: ComponentProps) {
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const [state, setState] = useState(Global.appSettings);
  const styles = getStyles(colors);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      props.navigation.navigate('HomeNew');
      return true;
    });
    AsyncStorage.setItem('settings', JSON.stringify(state));
    Global.appSettings = state;
    return () => {
      backHandler.remove();
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.navigate('HomeNew')}>
          <BackSvg
            width={Global.smallScreen ? 20 : 24}
            height={Global.smallScreen ? 20 : 24}
            style={{ marginRight: 10 }}
            fill={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
      </View>

      <ScrollView>
        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Экзамены</Text>

          <SettingsItem
            title={'Выбор номера билета'}
            value={state.requestTicketNumber}
            onPress={() =>
              setState({
                ...state,
                requestTicketNumber: !state.requestTicketNumber,
              })
            }
          />

          <SettingsItem
            title={'Запрашивать подтверждение \nпри выходе из экзамена'}
            value={state.requestExamExit}
            onPress={() =>
              setState({
                ...state,
                requestExamExit: !state.requestExamExit,
              })
            }
          />
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Прочее</Text>

          <SettingsItem
            title={'Запрашивать подтверждение \nпри выходе из приложения'}
            value={state.requestAppExit}
            onPress={() =>
              setState({
                ...state,
                requestAppExit: !state.requestAppExit,
              })
            }
          />

          <TouchableOpacity
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.rdm.tracktortest')}
          >
            <Text style={styles.settingLabel}>Оставить отзыв</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:rodewitsch@inbox.ru')}>
            <Text style={styles.settingLabel}>Обратная связь</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            padding: 20,
            ...GlobalStyles.flexRow,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: Global.smallScreen ? 13 : 15,
            }}
          >
            Версия приложения
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: Global.smallScreen ? 13 : 15,
            }}
          >
            3.0.21
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
