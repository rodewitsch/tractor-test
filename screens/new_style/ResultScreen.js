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
import SuccessDarkSvg from '../../assets/svg/success_dark.svg';
import SuccessLightSvg from '../../assets/svg/success_light.svg';
import UnsuccessDarkSvg from '../../assets/svg/unsuccess_dark.svg';
import UnsuccessLightSvg from '../../assets/svg/unsuccess_light.svg';
import ThemeColors from '../../constants/ThemeColors';

export default class ResultScreen extends React.Component {

  constructor(props) {
    super(props);
    this.examStatus = this.props.navigation.state.params.examStatus;
    this.answers = this.props.navigation.state.params.answers;
    this.ticketNumber = this.props.navigation.state.params.ticketNumber;
    this.category = this.props.navigation.state.params.category;
    this.colors = ThemeColors(global.darkTheme);
    this.styles = this.getStyles();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => this.props.navigation.navigate('TestNew');

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  getTicketsCount = (category) => {
    switch (category) {
      case 'A':
      case 'B':
      case 'D': return 40;
      case 'E1': return 20;
      case 'E2':
      case 'F': return 30;
    }
  }

  resultAction() {
    if (this.examStatus == 'passed') {
      this.ticketNumber = this.ticketNumber + 1;
      if (this.ticketNumber >= this.getTicketsCount(this.category)) this.ticketNumber = 0;
      return this.props.navigation.navigate('TestNew', { category: this.category, ticket: this.ticketNumber, retry: true })
    }
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
    return this.props.navigation.navigate('TestNew');
  }

  render() {
    return (<View style={this.styles.container}>
      <View style={this.styles.header}>
        <TouchableOpacity onPress={() => this.goBack()} >
          <CloseSvg width={smallScreen ? 16 : 18} height={smallScreen ? 16 : 18} style={{ marginHorizontal: 20, marginTop: 3 }} fill={this.colors.text}></CloseSvg>
        </TouchableOpacity>
        <Text style={this.styles.headerTitle}>Результат</Text>
      </View>
      <View style={this.styles.body}>
        <View style={{ marginTop: -40 }}>
          {this.examStatus == 'passed'
            ? global.darkTheme
              ? <SuccessDarkSvg width={screenWidth} height={screenWidth + 80}></SuccessDarkSvg>
              : <SuccessLightSvg width={screenWidth} height={screenWidth + 80}></SuccessLightSvg>
            : global.darkTheme
              ? <UnsuccessDarkSvg width={screenWidth} height={screenWidth + 80}></UnsuccessDarkSvg>
              : <UnsuccessLightSvg width={screenWidth} height={screenWidth + 80}></UnsuccessLightSvg>
          }
        </View>
        <View style={{ marginTop: smallScreen ? -50 : 5 }}>
          <Text style={this.styles.resultLabel}>{this.examStatus == 'passed' ? 'Поздравляем!' : 'Экзамен не сдан'}</Text>
          <Text style={this.styles.examResultLabel}>{this.getExamResultLabel()}</Text>
        </View>
        <TouchableOpacity onPress={() => this.resultAction()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: this.colors.middleground, width: '90%', marginTop: 20, borderRadius: 10, height: smallScreen ? 40 : 50 }}>
          <Text style={{ color: this.colors.text, textAlign: 'center', fontSize: smallScreen ? 16 : 18 }}>{this.examStatus == 'passed' ? 'Следующий билет' : 'Пройти еще раз'}</Text>
        </TouchableOpacity>
      </View>
    </View>)
  };

  getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: this.colors.background,
      height: '100%'
    },
    header: {
      zIndex: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 15
    },
    headerTitle: {
      color: this.colors.text,
      fontSize: smallScreen ? 15 : 18
    },
    body: {
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    resultLabel: {
      color: this.colors.text,
      fontSize: smallScreen ? 30 : 40,
      textAlign: 'center'
    },
    examResultLabel: {
      marginTop: 5,
      color: this.examStatus == 'passed' ? '#007234' : '#BD0008',
      fontSize: smallScreen ? 16 : 20,
      textAlign: 'center'
    }
  })
}

ResultScreen.navigationOptions = { header: null };

