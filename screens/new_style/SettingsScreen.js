import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  Linking,
  Dimensions,
  AsyncStorage
} from 'react-native';

import ThemeColors from '../../constants/ThemeColors';
import gs from '../../styles/global';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const screenHeight = screen.height;
const smallScreen = screenWidth <= 320;

import BackSvg from '../../assets/svg/back.svg';
import { ScrollView } from 'react-native-gesture-handler';

import SettingsItem from '../../components/new/SettingsItem';

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = props.navigation.state.params.settings;
    this.colors = ThemeColors(global.darkTheme);
    this.styles = this.getStyles();
  }

  componentDidMount() {
    AsyncStorage.getItem('settings').then(data => this.setState(JSON.parse(data)));
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount = () => this.backHandler.remove();

  componentDidUpdate = () => AsyncStorage.setItem('settings', JSON.stringify(this.state));

  handleBackPress = () => this.props.navigation.navigate('HomeNew');

  shouldComponentUpdate() {
    this.colors = ThemeColors(global.darkTheme);
    this.styles = this.getStyles();
    return true;
  }

  render() {
    return (<View style={this.styles.container}>

      <View style={this.styles.header}>
        <TouchableOpacity onPress={() => this.handleBackPress()}>
          <BackSvg width={smallScreen ? 20 : 24} height={smallScreen ? 20 : 24} style={{ marginRight: 10 }} fill={this.colors.text}></BackSvg>
        </TouchableOpacity>
        <Text style={this.styles.headerTitle}>Настройки</Text>
      </View>

      <ScrollView>

        <View style={this.styles.settingsGroup}>
          <Text style={this.styles.settingsGroupTitle}>Экзамены</Text>

          <SettingsItem
            title={'Выбор номера билета'}
            value={this.state.requestTicketNumber}
            onPress={() => this.setState({ requestTicketNumber: !this.state.requestTicketNumber })} />

          {/* <SettingsItem
            title={'Дополнительно подтверждать \nвыбранный ответ'}
            value={this.state.confirmAnswer}
            onPress={() => this.setState({ confirmAnswer: !this.state.confirmAnswer })} /> */}

          <SettingsItem
            title={'Запрашивать подтверждение \nпри выходе из экзамена'}
            value={this.state.requestExamExit}
            onPress={() => this.setState({ requestExamExit: !this.state.requestExamExit })} />

        </View>

        <View style={this.styles.settingsGroup}>
          <Text style={this.styles.settingsGroupTitle}>Прочее</Text>

          <SettingsItem
            title={'Запрашивать подтверждение \nпри выходе из приложения'}
            value={this.state.requestAppExit}
            onPress={() => this.setState({ requestAppExit: !this.state.requestAppExit })} />

          <SettingsItem
            title={'Темная тема'}
            value={this.state.darkTheme}
            onPress={() => {
              global.darkTheme = !this.state.darkTheme;
              this.setState({ darkTheme: !this.state.darkTheme })
            }} />

          <TouchableOpacity onPress={() => {
            this.setState({ oldStyle: !this.state.oldStyle });
            if (!this.state.oldStyle) this.setState({ darkTheme: false });
            this.props.navigation.navigate('Home');
          }}>
            <Text style={this.styles.settingLabel}>Старый дизайн</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.rdm.tracktortest')}>
            <Text style={this.styles.settingLabel}>Оставить отзыв</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:rodewitsch@inbox.ru')}>
            <Text style={this.styles.settingLabel}>Обратная связь</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20, ...gs.flexRow, justifyContent: 'space-between' }}>
          <Text style={{ color: this.colors.text, fontSize: smallScreen ? 13 : 15 }}>{'Версия приложения'}</Text>
          <Text style={{ color: this.colors.text, fontSize: smallScreen ? 13 : 15 }}>{'1.3.2'}</Text>
        </View>
      </ScrollView>
    </View>)
  };

  getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: this.colors.background,
      height: '100%'
    },
    header: {
      backgroundColor: this.colors.middleground,
      ...gs.flexRow,
      alignItems: 'center',
      padding: 20
    },
    headerTitle: {
      color: this.colors.text,
      fontSize: smallScreen ? 15 : 18
    },
    settingsGroup: {
      backgroundColor: this.colors.middleground,
      padding: 20,
      marginTop: 15
    },
    settingsGroupTitle: {
      color: '#BD0008',
      fontSize: smallScreen ? 13 : 15,
      fontWeight: 'bold'
    },
    settingLabel: {
      color: this.colors.text,
      fontSize: smallScreen ? 13 : 15,
      marginTop: 15
    }
  })
}

SettingsScreen.navigationOptions = { header: null };
