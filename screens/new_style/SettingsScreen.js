import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  Switch,
  Dimensions,
  AsyncStorage
} from 'react-native';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const screenHeight = screen.height;
const smallScreen = screenWidth <= 320;

import CloseSvg from '../../assets/svg/close.svg';
import SuccessSvg from '../../assets/svg/success.svg';
import UnsuccessSvg from '../../assets/svg/unsuccess.svg';
import BackSvg from '../../assets/svg/back.svg';
import { ScrollView } from 'react-native-gesture-handler';

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = props.navigation.state.params.settings;
  }

  componentDidMount() {
    AsyncStorage.getItem('settings').then(data => this.setState(JSON.parse(data)));
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidUpdate() {
    AsyncStorage.setItem('settings', JSON.stringify(this.state));
  }

  handleBackPress = () => {
    if (this.state.oldStyle) return this.props.navigation.navigate('Home');
    return this.props.navigation.navigate('HomeNew');
  }

  goBack() {
    if (this.state.oldStyle) return this.props.navigation.navigate('Home');
    return this.props.navigation.navigate('HomeNew');
  }

  render() {
    return (<View style={{ backgroundColor: 'black', height: '100%' }}>
      <View style={{ backgroundColor: '#1F1F1F' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}>
          <TouchableOpacity onPress={() => this.goBack()}>
            <BackSvg width={smallScreen ? 24 : 24} height={smallScreen ? 24 : 24} style={{ marginRight: 10 }}></BackSvg>
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18 }}>Настройки</Text>
        </View>
      </View>

      <ScrollView>
        <View style={{ backgroundColor: '#1F1F1F', padding: 20, marginTop: 15 }}>
          <Text style={{ color: '#BD0008', fontSize: smallScreen ? 15 : 18, fontWeight: 'bold' }}>Экзамены</Text>
          <TouchableOpacity onPress={() => this.setState({ requestTicketNumber: !this.state.requestTicketNumber })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Выбор номера билета'}</Text>
            </View>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.requestTicketNumber ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ requestTicketNumber: !this.state.requestTicketNumber })}
              value={this.state.requestTicketNumber}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ confirmAnswer: !this.state.confirmAnswer })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Дополнительно подтверждать \nвыбранный ответ'}</Text>
            </View>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.confirmAnswer ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ confirmAnswer: !this.state.confirmAnswer })}
              value={this.state.confirmAnswer}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ requestExamExit: !this.state.requestExamExit })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Запрашивать подтверждение \nпри выходе из экзамена'}</Text>
            </View>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.requestExamExit ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ requestExamExit: !this.state.requestExamExit })}
              value={this.state.requestExamExit}
            />
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#1F1F1F', padding: 20, marginTop: 15 }}>
          <Text style={{ color: '#BD0008', fontSize: smallScreen ? 18 : 20, fontWeight: 'bold' }}>Прочее</Text>
          <TouchableOpacity onPress={() => this.setState({ requestAppExit: !this.state.requestAppExit })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Запрашивать подтверждение \nпри выходе из приложения'}</Text>
            </View>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.requestAppExit ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ requestAppExit: !this.state.requestAppExit })}
              value={this.state.requestAppExit}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({ oldStyle: !this.state.oldStyle });
            if (!this.state.oldStyle) this.setState({ darkTheme: false })
          }} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Старый дизайн'}</Text>
            </View>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.oldStyle ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ oldStyle: !this.state.oldStyle })}
              value={this.state.oldStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity disabled={this.state.oldStyle} onPress={() => this.setState({ darkTheme: !this.state.darkTheme })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '85%' }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Темная тема'}</Text>
            </View>
            <Switch
              style={styles.checkbox}
              disabled={this.state.oldStyle}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.darkTheme ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ darkTheme: !this.state.darkTheme })}
              value={this.state.darkTheme}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Оставить отзыв'}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18, marginTop: 15 }}>{'Обратная связь'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18 }}>{'Версия приложения'}</Text>
          <Text style={{ color: 'white', fontSize: smallScreen ? 15 : 18 }}>{'1.3.2'}</Text>
        </View>
      </ScrollView>
    </View>)
  };
}

SettingsScreen.navigationOptions = { header: null };

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 15,
    marginRight: 5
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 15,
    width: 240,
    marginLeft: -40,
    height: 40
  }
});
