import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  AsyncStorage,
  Dimensions
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

import COLORS from '../../constants/Colors';

import * as A from '../../assets/questions/a/index';
import * as B from '../../assets/questions/b/index';
import * as D from '../../assets/questions/d/index';
import * as E1 from '../../assets/questions/e1/index';
import * as E2 from '../../assets/questions/e2/index';
import * as F from '../../assets/questions/f/index';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const smallScreen = screenWidth <= 320;

import BackSvg from '../../assets/svg/back.svg';
import TimerSvg from '../../assets/svg/timer.svg';

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.currentCategory = props.navigation.state.params.category;
    this.selectedTicket = props.navigation.state.params.ticket;
    this.timer = null;
    this.state = {};
    this.state.examStatus = 'inProgress';
    this.state.ticketNumber = this.selectedTicket != undefined ? this.selectedTicket : this.randomInteger(0, this.getCategoryTickets(this.currentCategory).default.length - 1);
    this.state.questionNumber = 0;
    this.state.timer = '10:00';
    this.deactivateBackPressHandler = false;
    this.state.answers = new Array(this.getCategoryTickets(this.currentCategory).default[this.state.ticketNumber].length)
      .fill(null)
      .map((item, index) => ({ rightAnswer: (this.getQuestionItem(this.state.ticketNumber, index).rightAnswer - 1), userAnswer: null }));
  }

  refreshState() {
    AsyncStorage.getItem('settings').then(data => {
      if (data) this.setState({ ...this.state, settings: JSON.parse(data) })
    })
  }

  componentDidUpdate() {
    if (this.props.navigation.state.params.retry) {
      this.setState({
        examStatus: 'inProgress',
        ticketNumber: this.props.navigation.state.params.ticket,
        questionNumber: 0,
        timer: '10:00',
        answers: new Array(this.getCategoryTickets(this.props.navigation.state.params.category).default[this.props.navigation.state.params.ticket].length)
          .fill(null)
          .map((item, index) => ({ rightAnswer: (this.getQuestionItem(this.props.navigation.state.params.ticket, index).rightAnswer - 1), userAnswer: null }))
      })
    }
    this.props.navigation.state.params.retry = false;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.backHandler.remove()
  }

  handleBackPress = () => {
    if (this.deactivateBackPressHandler) return false;
    if (!this.state.settings.requestExamExit) return this.props.navigation.navigate('HomeNew');
    Alert.alert(
      '',
      'Выйти из экзамена',
      [
        {
          text: 'Отмена',
          onPress: () => true,
          style: 'cancel',
        },
        { text: 'Выйти', onPress: () => this.props.navigation.navigate('HomeNew') },
      ],
      { cancelable: false }
    );
    return true;
  }

  componentDidMount() {
    this.refreshState();
    this.startTimer(600);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  getCategoryTickets(category) {
    switch (category) {
      case 'A': return A;
      case 'B': return B;
      case 'D': return D;
      case 'E1': return E1;
      case 'E2': return E2;
      case 'F': return F;
    }
  }

  setQuestion(number) {
    if (number > 9 || number < 0) return;
    this.setState({ questionNumber: number });
  }

  randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  getQuestionItem(ticketNumber = this.state.ticketNumber, questionNumber = this.state.questionNumber) {
    return this.getCategoryTickets(this.currentCategory).default[ticketNumber][questionNumber];
  }

  setAnswer(number) {
    if (this.state.examStatus != 'inProgress') return;
    if (this.state.answers[this.state.questionNumber].userAnswer != null) {
      const EMPTY_ANSWER = this.state.answers.findIndex((item, index) => item.userAnswer == null && index > this.state.questionNumber);
      if (this.state.questionNumber < 9 && EMPTY_ANSWER != -1) {
        this.setState({ questionNumber: EMPTY_ANSWER });
      } else {
        this.setState({ questionNumber: this.state.answers.findIndex(item => item.userAnswer == null) });
      }
    } else {
      this.state.answers[this.state.questionNumber].userAnswer = number;
      this.state.examStatus = this.getExamStatus();
      if (this.state.examStatus != 'inProgress') {
        clearInterval(this.timer);
        this.deactivateBackPressHandler = true;
        return this.props.navigation.navigate('Result', { examStatus: this.state.examStatus, ticketNumber: this.state.ticketNumber, answers: this.state.answers, category: this.currentCategory });
      }
      this.setState({ answers: this.state.answers });
    }
  }

  goBack() {
    return this.props.navigation.navigate('HomeNew');
  }

  getExamStatus() {
    if (this.state.answers.every(item => item.userAnswer != null)) {
      if (this.state.answers.reduce((acc, item) => (item.userAnswer != item.rightAnswer ? acc += 1 : acc), 0) > 1) return 'failed'; else return 'passed';
    }
    return 'inProgress';
  }

  getQuestionStatusColor(number) {
    if (number == this.state.questionNumber) return 'white';
    if (this.state.answers[number].userAnswer == null) return COLORS.questionStatusDefaultBackground
    if (this.state.answers[number].rightAnswer == this.state.answers[number].userAnswer) return COLORS.questionStatusSuccessBackground;
    return COLORS.questionStatusWrongBackground;
  }

  getAnswerStatusColor(number) {
    const rightAnswer = this.getQuestionItem().rightAnswer - 1;
    const userAnswer = this.state.answers[this.state.questionNumber].userAnswer;
    if (userAnswer == null) return '#1F1F1F';
    if (number == userAnswer && userAnswer == rightAnswer) return COLORS.questionStatusSuccessBackground;
    if (number != userAnswer && number == rightAnswer) return COLORS.questionStatusSuccessBackground;
    if (number == userAnswer && number != rightAnswer) return COLORS.questionStatusWrongBackground;
    return '#1F1F1F';
  }

  startTimer(duration) {
    let timer = duration, minutes, seconds;
    this.timer = setInterval(function (self) {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      self.setState({ timer: minutes + ":" + seconds });

      if (--timer < 0) {
        self.setState({ examStatus: 'timeout' });
        clearInterval(self.timer);
        return self.props.navigation.navigate('Result', { examStatus: self.state.examStatus, ticketNumber: self.state.ticketNumber, answers: self.state.answers, category: self.currentCategory });
      }
    }, 1000, this);
  }

  onSwipe(gestureName, gestureState) {
    if (gestureName == null) {
      const { dx } = gestureState;
      if (dx > 0) {
        this.setQuestion(this.state.questionNumber - 1)
      }
      else if (dx < 0) {
        this.setQuestion(this.state.questionNumber + 1)
      }
    } else {
      switch (gestureName) {
        case "SWIPE_RIGHT":
          this.setQuestion(this.state.questionNumber - 1)
          break;
        case "SWIPE_LEFT":
          this.setQuestion(this.state.questionNumber + 1)
          break;
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: '#1F1F1F', paddingBottom: 15 }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            <TouchableOpacity onPress={() => this.goBack()}>
              <BackSvg width={smallScreen ? 24 : 24} height={smallScreen ? 24 : 24} style={{ marginRight: 10 }}></BackSvg>
            </TouchableOpacity>
            <View style={{ width: '63%', marginLeft: 3 }}>
              <Text style={{ color: 'white', fontSize: smallScreen ? 16 : 18, fontWeight: 'bold' }}>Билет {this.state.ticketNumber + 1}</Text>
              <Text style={{ color: '#5a5a5a', fontSize: smallScreen ? 12 : 14, fontWeight: 'bold' }}>Категория {this.currentCategory.substr(0, 1)}</Text>
            </View>
            <View style={{ display: 'flex', position: 'absolute', left: screenWidth - 90, flexDirection: 'row', alignItems: 'center', width: '37%' }}>
              <TimerSvg width={smallScreen ? 20 : 24} height={smallScreen ? 20 : 24}></TimerSvg>
              <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold', fontSize: smallScreen ? 16 : 18 }}>{this.state.timer}</Text>
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
            {Array(10).fill(null).map((item, index) => (
              <TouchableOpacity key={index} onPress={() => this.setQuestion(index)}>
                <View style={{ width: screenWidth / 13, height: screenWidth / 13, borderRadius: 10, borderWidth: 1, borderStyle: 'solid', borderColor: this.getQuestionStatusColor(index), backgroundColor: '#343434', display: 'flex', marginRight: 5, justifyContent: 'center' }}>
                  <Text style={{ ...styles.questionNumberStatus, color: 'white' }}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.questionArea}>
          <Text style={{ flex: 1, flexWrap: 'nowrap', fontSize: smallScreen ? 16 : 18, color: 'white' }}>{this.getQuestionItem().questionText}</Text>
        </View>

        <ScrollView style={{ height: '50%', marginTop: 20 }}>
          {this.getQuestionItem().questionImage
            ? <Image resizeMode='contain' style={{ height: 150, marginVertical: 5 }} source={{ uri: this.getQuestionItem().questionImage }}></Image>
            : null
          }
          {
            this.getQuestionItem().answers.map((answer, index) => (
              <TouchableOpacity key={index} disabled={this.state.examStatus != 'inProgress'} onPress={() => this.setAnswer(index)}>
                <View style={{ borderStyle: 'solid', borderWidth: 1, backgroundColor: '#1F1F1F', borderColor: this.getAnswerStatusColor(index), paddingVertical: 8, marginVertical: 5, paddingHorizontal: 20, marginHorizontal: 20, borderRadius: 10 }}>
                  <Text style={{ fontSize: smallScreen ? 14 : 16, color: 'white' }}>{index + 1}. {answer}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    )
  };
}

TestScreen.navigationOptions = { header: null };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101010',
    height: '100%'
  },
  examProcess: {
    height: 25,
    flexDirection: 'row',
    backgroundColor: 'gray',
    justifyContent: 'center'
  },
  questionNumberStatus: {
    textAlign: 'center',
    color: COLORS.whiteText,
    fontSize: smallScreen ? 16 : 18
  },
  timer: {
    marginLeft: 7,
    textAlign: "right",
    fontSize: smallScreen ? 16 : 18
  },
  questionArea: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 300,
    width: 300
  }
});
