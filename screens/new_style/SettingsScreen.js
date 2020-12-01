import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  Switch,
  Dimensions
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
    this.state = {
      test1: false,
      test2: false,
      test3: true,
      test4: true,
      test5: false,
      test6: false
    }
  }

  goBack() {
    return this.props.navigation.navigate('HomeNew');
  }

  render() {
    return (<View style={{ backgroundColor: 'black', height: '100%' }}>
      <View style={{ backgroundColor: '#1F1F1F' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}>
          <TouchableOpacity onPress={() => this.goBack()}>
            <BackSvg width={smallScreen ? 24 : 24} height={smallScreen ? 24 : 24} style={{ marginRight: 10 }}></BackSvg>
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: smallScreen ? 18 : 22 }}>Настройки</Text>
        </View>
      </View>

      <ScrollView>
        <View style={{ backgroundColor: '#1F1F1F', padding: 20, marginTop: 15 }}>
          <Text style={{ color: '#BD0008', fontSize: 20, fontWeight: 'bold' }}>Экзамены</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Выбор номера билета'}</Text>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.test1 ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ test1: !this.state.test1 })}
              value={this.state.test1}
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Дополнительно подтверждать \nвыбранный ответ'}</Text>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.test2 ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ test2: !this.state.test2 })}
              value={this.state.test2}
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Запрашивать подтверждение \nпри выходе из экзамена'}</Text>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.test3 ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ test3: !this.state.test3 })}
              value={this.state.test3}
            />
          </View>
        </View>

        <View style={{ backgroundColor: '#1F1F1F', padding: 20, marginTop: 15 }}>
          <Text style={{ color: '#BD0008', fontSize: 20, fontWeight: 'bold' }}>Прочее</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Запрашивать подтверждение \nпри выходе из приложения'}</Text>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.test4 ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ test4: !this.state.test4 })}
              value={this.state.test4}
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Старый дизайн'}</Text>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.test5 ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ test5: !this.state.test5 })}
              value={this.state.test5}
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Темная тема'}</Text>
            <Switch
              style={styles.checkbox}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={this.state.test6 ? "#579DD0" : "#f4f3f4"}
              onValueChange={() => this.setState({ test6: !this.state.test6 })}
              value={this.state.test6}
            />
          </View>
          <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Оставить отзыв'}</Text>
          <Text style={{ color: 'white', fontSize: 18, marginTop: 15 }}>{'Обратная связь'}</Text>
        </View>

        <View style={{ padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 20 }}>{'Версия приложения'}</Text>
          <Text style={{ color: 'white', fontSize: 20 }}>{'1.3.2'}</Text>
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
