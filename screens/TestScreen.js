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
  AsyncStorage
} from 'react-native';
import Modal from 'react-native-modalbox';

import * as A from '../assets/questions/a/index';
import * as B from '../assets/questions/b/index';
import * as D from '../assets/questions/d/index';
import * as E1 from '../assets/questions/e1/index';
import * as E2 from '../assets/questions/e2/index';
import * as F from '../assets/questions/f/index';
import Icon from 'react-native-vector-icons/Ionicons';

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
    this.state.answers = new Array(this.getCategoryTickets(this.currentCategory).default[this.state.ticketNumber].length)
      .fill(null)
      .map((item, index) => ({ rightAnswer: (this.getQuestionItem(this.state.ticketNumber, index).rightAnswer - 1), userAnswer: null }));
  }

  refreshState() {
    AsyncStorage.getItem('settings').then(data => {
      if (data) this.setState({ ...this.state, settings: JSON.parse(data) })
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.backHandler.remove()
  }

  handleBackPress = () => {
    if (!this.state.settings.requestExamExit) return this.props.navigation.navigate('Home');
    Alert.alert(
      '',
      'Выйти из экзамена',
      [
        {
          text: 'Отмена',
          onPress: () => true,
          style: 'cancel',
        },
        { text: 'Выйти', onPress: () => this.props.navigation.navigate('Home') },
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
      if (this.state.questionNumber < 9) {
        this.setState({ questionNumber: this.state.answers.findIndex((item, index) => item.userAnswer == null && index > this.state.questionNumber) });
      } else {
        this.setState({ questionNumber: this.state.answers.findIndex(item => item.userAnswer == null) });
      }
    } else {
      this.state.answers[this.state.questionNumber].userAnswer = number;
      this.state.examStatus = this.getExamStatus();
      if (this.state.examStatus != 'inProgress') {
        clearInterval(this.timer);
        this.refs.modal3.open();
      }
      this.setState({ answers: this.state.answers });
    }
  }

  getExamStatus() {
    if (this.state.answers.every(item => item.userAnswer != null)) {
      if (this.state.answers.reduce((acc, item) => (item.userAnswer != item.rightAnswer ? acc += 1 : acc), 0) > 1) return 'failed'; else return 'passed';
    }
    return 'inProgress';
  }

  getQuestionStatusColor(number) {
    if (number == this.state.questionNumber) return '#618cc1';
    if (this.state.answers[number].userAnswer == null) return 'gray';
    if (this.state.answers[number].rightAnswer == this.state.answers[number].userAnswer) return '#6bc161';
    return '#c16161';
  }

  getAnswerStatusColor(number) {
    const rightAnswer = this.getQuestionItem().rightAnswer - 1;
    const userAnswer = this.state.answers[this.state.questionNumber].userAnswer;
    if (userAnswer == null) return 'white';
    if (number == userAnswer && userAnswer == rightAnswer) return '#6bc161';
    if (number != userAnswer && number == rightAnswer) return '#6bc161';
    if (number == userAnswer && number != rightAnswer) return '#c16161';
    return 'white';
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
        self.refs.modal3.open();
      }
    }, 1000, this);
  }

  render() {
    return (
      <View style={styles.container}>
        
        
        <Modal style={styles.modal} backButtonClose={true} position={"center"} ref={"modal3"}>
        {this.state.examStatus == 'passed' ? <Icon style={{ fontSize: 80, color: 'green' }} name='md-checkmark-circle-outline' /> : <Icon style={{ fontSize: 80, color: 'red' }} name='md-close-circle-outline' />}
          <Text style={{ fontSize: 30, color: this.state.examStatus == 'passed' ? 'green' : 'red' }}>
            {this.state.examStatus == 'passed' ? 'Экзамен сдан' : 'Экзамен не сдан'}
          </Text>
          <Text style={{ marginTop: 15, textAlign: 'center' }}>
            {this.state.examStatus == 'failed'
              ? 'Допущено больше одного неправильного ответа'
              : this.state.examStatus == 'timeout'
                ? 'Вышло время сдачи экзамена'
                : ''}
          </Text>
        </Modal>

        <Text style={styles.title}>Категория {this.currentCategory.substr(0, 1)}. Билет №{this.state.ticketNumber + 1} - {this.state.timer}</Text>

        <View style={styles.examProcess}>
          {Array(10).fill(null).map((item, index) => (
            <TouchableOpacity key={index} onPress={() => this.setQuestion(index)}>
              <View style={{ width: 30, height: 25, backgroundColor: this.getQuestionStatusColor(index) }}>
                <Text style={styles.questionNumberStatus}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          ))}

        </View>

        <Text style={{ fontSize: 18, paddingHorizontal: 20, paddingVertical: 10, fontStyle: 'italic', fontWeight: 'bold' }}>Вопрос:</Text>

        <View style={styles.questionArea}>
          <Text style={{ flex: 1, flexWrap: 'nowrap', fontSize: 18, textAlign: 'justify' }}>{this.getQuestionItem().questionText}</Text>
        </View>

        <ScrollView style={{ height: '50%' }}>
          {this.getQuestionItem().questionImage
            ? <Image resizeMode='contain' style={{ height: 150, marginVertical: 5 }} source={{ uri: this.getQuestionItem().questionImage }}></Image>
            : null
          }
          <Text style={{ fontSize: 18, paddingHorizontal: 20, paddingVertical: 10, fontStyle: 'italic', fontWeight: 'bold' }}>Варианты ответов:</Text>
          {
            this.getQuestionItem().answers.map((answer, index) => (
              <TouchableOpacity key={index} disabled={this.state.examStatus != 'inProgress'} onPress={() => this.setAnswer(index)}>
                <View style={{ backgroundColor: this.getAnswerStatusColor(index), paddingVertical: 8, marginVertical: 5, paddingHorizontal: 20 }}>
                  <Text style={{ fontSize: 18 }}>{index + 1}. {answer}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View >
    )
  };
}

TestScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8e8e8',
    height: '100%'
  },
  title: {
    fontSize: 18,
    textAlign: 'center'
  },
  examProcess: {
    height: 25,
    flexDirection: 'row',
    backgroundColor: 'gray',
    justifyContent: 'center'
  },
  questionNumberStatus: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18
  },
  timer: {
    marginLeft: 7,
    textAlign: "right",
    fontSize: 18
  },
  questionArea: {
    flexDirection: 'row',
    marginHorizontal: 20
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 300,
    width: 300
  }
});
