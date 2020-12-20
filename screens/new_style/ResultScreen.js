import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler
} from 'react-native';

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
    this.colors = ThemeColors(global.appSettings.darkTheme);
    this.styles = this.getStyles();
  }

  componentWillUnmount = () => this.backHandler.remove();

  handleBackPress = () => this.props.navigation.navigate('TestNew');

  componentDidMount = () => this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

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

  goBack = () => this.props.navigation.navigate('TestNew');

  render() {
    return (<View style={this.styles.container}>
      <View style={this.styles.header}>
        <TouchableOpacity onPress={() => this.goBack()} >
          <CloseSvg width={global.smallScreen ? 16 : 18} height={global.smallScreen ? 16 : 18} style={{ marginHorizontal: 20, marginTop: 3 }} fill={this.colors.text} />
        </TouchableOpacity>
        <Text style={this.styles.headerTitle}>Результат</Text>
      </View>
      <View style={this.styles.body}>
        <View style={{ marginTop: -40 }}>
          {this.examStatus == 'passed'
            ? global.appSettings.darkTheme
              ? <SuccessDarkSvg width={global.screenWidth} height={global.screenWidth + 80} />
              : <SuccessLightSvg width={global.screenWidth} height={global.screenWidth + 80} />
            : global.appSettings.darkTheme
              ? <UnsuccessDarkSvg width={global.screenWidth} height={global.screenWidth + 80} />
              : <UnsuccessLightSvg width={global.screenWidth} height={global.screenWidth + 80} />
          }
        </View>
        <View style={{ marginTop: global.smallScreen ? -50 : 5 }}>
          <Text style={this.styles.resultLabel}>{this.examStatus == 'passed' ? 'Поздравляем!' : 'Экзамен не сдан'}</Text>
          <Text style={this.styles.examResultLabel}>{this.getExamResultLabel()}</Text>
        </View>
        <TouchableOpacity onPress={() => this.resultAction()} style={this.styles.button}>
          <Text style={{ color: this.colors.text, textAlign: 'center', fontSize: global.smallScreen ? 16 : 18 }}>{this.examStatus == 'passed' ? 'Следующий билет' : 'Пройти еще раз'}</Text>
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
      paddingTop: 25,
      marginBottom: -15
    },
    headerTitle: {
      color: this.colors.text,
      fontSize: global.smallScreen ? 15 : 18
    },
    body: {
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    resultLabel: {
      color: this.colors.text,
      fontSize: global.smallScreen ? 30 : 40,
      textAlign: 'center'
    },
    examResultLabel: {
      marginTop: 5,
      color: this.examStatus == 'passed' ? '#007234' : '#BD0008',
      fontSize: global.smallScreen ? 16 : 20,
      textAlign: 'center'
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: this.colors.middleground,
      width: '90%',
      marginTop: 20,
      borderRadius: 10,
      height: global.smallScreen ? 40 : 50
    }
  })
}

ResultScreen.navigationOptions = { header: null };

