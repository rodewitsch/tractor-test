import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  Dimensions
} from 'react-native';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const screenHeight = screen.height;
const smallScreen = screenWidth <= 320;

import CloseSvg from '../../assets/svg/close.svg';
import SuccessSvg from '../../assets/svg/success.svg';
import UnsuccessSvg from '../../assets/svg/unsuccess.svg';

export default class ResultScreen extends React.Component {

  constructor(props) {
    super(props);
    this.examStatus = this.props.navigation.state.params.examStatus;
    this.answers = this.props.navigation.state.params.answers;
    this.ticketNumber = this.props.navigation.state.params.ticketNumber;
    this.category = this.props.navigation.state.params.category;
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => this.props.navigation.navigate('HomeNew');

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  resultAction() {
    if (this.examStatus == 'passed') return this.props.navigation.navigate('TestNew', { category: this.category, ticket: this.ticketNumber + 1, retry: true })
    return this.props.navigation.navigate('TestNew', { category: this.category, ticket: this.ticketNumber, retry: true })
  }

  getExamResultLabel() {
    const WRONG_ANSWERS = this.answers.reduce((acc, item) => (item.userAnswer != item.rightAnswer ? acc += 1 : acc), 0);
    switch (this.examStatus) {
      case 'passed': {
        if (WRONG_ANSWERS) return 'Допущено 1 ошибка';
        return 'Ни одной ошибки';
      }
      case 'failed': {
        if (WRONG_ANSWERS > 5) return `Допущено ${WRONG_ANSWERS} ошибок`;
        return `Допущено ${WRONG_ANSWERS} ошибки`;
      }
      case 'timeout': return 'Время вышло'
    }
  }

  goBack() {
    return this.props.navigation.navigate('HomeNew');
  }

  render() {
    return (<View style={{ backgroundColor: 'black', height: '100%' }}>
      <View style={{ zIndex: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 15 }}>
        <TouchableOpacity onPress={() => this.goBack()} >
          <CloseSvg width={smallScreen ? 18 : 20} height={smallScreen ? 18 : 20} style={{ marginHorizontal: 20 }}></CloseSvg>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: smallScreen ? 18 : 22 }}>Результат</Text>
      </View>
      <View style={{ zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginTop: -45 }}>
          {this.examStatus == 'passed' ? <SuccessSvg width={screenWidth} height={screenWidth}></SuccessSvg> : <UnsuccessSvg width={screenWidth} height={screenWidth + 80}></UnsuccessSvg>}
        </View>
        <View style={{ marginTop: smallScreen ? -50 : 5 }}>
          <Text style={{ color: 'white', fontSize: smallScreen ? 35 : 45, textAlign: 'center' }}>{this.examStatus == 'passed' ? 'Поздравляем!' : 'Экзамен не сдан'}</Text>
          <Text style={{ marginTop: 5, color: this.examStatus == 'passed' ? '#007234' : '#BD0008', fontSize: smallScreen ? 18 : 22, textAlign: 'center' }}>{this.getExamResultLabel()}</Text>
        </View>
        <TouchableOpacity onPress={() => this.resultAction()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#343434', width: '90%', marginTop: 20, borderRadius: 10, height: smallScreen ? 40 : 50 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: smallScreen ? 16 : 18 }}>{this.examStatus == 'passed' ? 'Следующий билет' : 'Пройти еще раз'}</Text>
        </TouchableOpacity>
      </View>
    </View>)
  };
}

ResultScreen.navigationOptions = { header: null };

const styles = StyleSheet.create({
});
