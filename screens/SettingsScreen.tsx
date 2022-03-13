import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, BackHandler, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import GlobalStyles from '../styles/global';
import Global from '../global.variables';

import BackSvg from '../assets/svg/back.svg';
import SettingsItem from '../components/SettingsItem';
import { useTheme } from '@react-navigation/native';

export default function (props: any) {
  const { colors } = useTheme();
  return <SettingsScreen {...props} colors={colors}></SettingsScreen>;
}

class SettingsScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = Global.appSettings;
    this.colors = this.props.colors;
    this.styles = this.getStyles();
  }

  componentDidMount() {
    this.setState(Global.appSettings);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount = () => this.backHandler.remove();

  componentDidUpdate = () => {
    AsyncStorage.setItem('settings', JSON.stringify(this.state));
    Global.appSettings = this.state;
  };

  handleBackPress = () => {
    this.props.navigation.navigate('HomeNew');
    return true;
  };

  shouldComponentUpdate() {
    this.colors = this.props.colors;
    this.styles = this.getStyles();
    return true;
  }

  render() {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.header}>
          <TouchableOpacity onPress={() => this.handleBackPress()}>
            <BackSvg
              width={Global.smallScreen ? 20 : 24}
              height={Global.smallScreen ? 20 : 24}
              style={{ marginRight: 10 }}
              fill={this.colors.text}
            />
          </TouchableOpacity>
          <Text style={this.styles.headerTitle}>Настройки</Text>
        </View>

        <ScrollView>
          <View style={this.styles.settingsGroup}>
            <Text style={this.styles.settingsGroupTitle}>Экзамены</Text>

            <SettingsItem
              title={'Выбор номера билета'}
              value={this.state.requestTicketNumber}
              onPress={() =>
                this.setState((prevState) => ({
                  requestTicketNumber: !prevState.requestTicketNumber,
                }))
              }
            />

            <SettingsItem
              title={'Запрашивать подтверждение \nпри выходе из экзамена'}
              value={this.state.requestExamExit}
              onPress={() =>
                this.setState((prevState) => ({
                  requestExamExit: !prevState.requestExamExit,
                }))
              }
            />
          </View>

          <View style={this.styles.settingsGroup}>
            <Text style={this.styles.settingsGroupTitle}>Прочее</Text>

            <SettingsItem
              title={'Запрашивать подтверждение \nпри выходе из приложения'}
              value={this.state.requestAppExit}
              onPress={() =>
                this.setState((prevState) => ({
                  requestAppExit: !prevState.requestAppExit,
                }))
              }
            />

            <TouchableOpacity
              onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.rdm.tracktortest')}
            >
              <Text style={this.styles.settingLabel}>Оставить отзыв</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:rodewitsch@inbox.ru')}>
              <Text style={this.styles.settingLabel}>Обратная связь</Text>
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
                color: this.colors.text,
                fontSize: Global.smallScreen ? 13 : 15,
              }}
            >
              Версия приложения
            </Text>
            <Text
              style={{
                color: this.colors.text,
                fontSize: Global.smallScreen ? 13 : 15,
              }}
            >
              2.0.3
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  getStyles = () =>
    StyleSheet.create({
      container: {
        backgroundColor: this.colors.background,
        height: '100%',
      },
      header: {
        backgroundColor: this.colors.middleground,
        ...GlobalStyles.flexRow,
        alignItems: 'center',
        padding: 20,
      },
      headerTitle: {
        color: this.colors.text,
        fontSize: Global.smallScreen ? 15 : 18,
      },
      settingsGroup: {
        backgroundColor: this.colors.middleground,
        padding: 20,
        marginTop: 15,
      },
      settingsGroupTitle: {
        color: '#BD0008',
        fontSize: Global.smallScreen ? 13 : 15,
        fontWeight: 'bold',
      },
      settingLabel: {
        color: this.colors.text,
        fontSize: Global.smallScreen ? 13 : 15,
        marginTop: 15,
      },
    });
}
