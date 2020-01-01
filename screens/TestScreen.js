import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';

import * as questions from '../assets/questions/a/index';

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {};
    this.state.examStatus = 'inProgress';
    this.state.ticketNumber = this.randomInteger(0, questions.default.length - 1);
    this.state.questionNumber = 0;
    this.state.timer = '10:00';
    this.state.answers = new Array(questions.default[this.state.ticketNumber].length)
      .fill(null)
      .map((item, index) => ({ rightAnswer: (this.getQuestionItem(this.state.ticketNumber, index).rightAnswer - 1), userAnswer: null }));
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

  componentDidMount() {
    this.startTimer(600);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getQuestionItem(ticketNumber = this.state.ticketNumber, questionNumber = this.state.questionNumber) {
    return questions.default[ticketNumber][questionNumber];
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
      if (this.state.answers.reduce((acc, item) => item.userAnswer != item.rightAnswer ? acc++ : acc, 0) > 1) return 'passed'; else return 'failed';
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

        <Modal style={styles.modal} position={"center"} ref={"modal3"}>
          <Text style={{ fontSize: 30, color: this.state.examStatus == 'success' ? 'green' : 'red' }}>
            {this.state.examStatus == 'success' ? 'Экзамен сдан' : 'Экзамен не сдан'}
          </Text>
          <Text style={{ marginTop: 15, textAlign: 'center' }}>
            {this.state.examStatus == 'failed'
              ? 'Допущено больше одного неправильного ответа'
              : this.state.examStatus == 'timeout'
                ? 'Вышло время сдачи экзамена'
                : ''}
          </Text>
        </Modal>

        <Text style={styles.title}>Категория A. Билет №{this.state.ticketNumber + 1}</Text>

        <View style={styles.examProcess}>
          {Array(10).fill(null).map((item, index) => (
            <TouchableOpacity onPress={() => this.setQuestion(index)}>
              <View style={{ width: 30, backgroundColor: this.getQuestionStatusColor(index) }}>
                <Text style={styles.questionNumberStatus}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.timer}>{this.state.timer}</Text>
        </View>

        <View style={styles.questionArea}>

          <TouchableOpacity style={styles.arrow} onPress={() => this.setQuestion(this.state.questionNumber - 1)}>
            <Icon onPress={() => this.setQuestion(this.state.questionNumber - 1)} style={{ fontSize: 25 }} name='md-arrow-round-back' />
          </TouchableOpacity>

          <View style={{ width: '90%' }}>
            <Text style={{ fontSize: 18, textAlign: 'justify', flexWrap: 'wrap' }}>{this.getQuestionItem().questionText}</Text>
            {this.getQuestionItem().questionImage
              ? <Image resizeMode='contain' style={{ height: 150, marginVertical: 5 }} source={{ uri: this.getQuestionItem().questionImage }}></Image>
              : null
            }
          </View>

          <TouchableOpacity style={styles.arrow} onPress={() => this.setQuestion(this.state.questionNumber + 1)}>
            <Icon style={{ fontSize: 25 }} name='md-arrow-round-forward' />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ height: '50%' }}>
          <View>
            <Text style={{ fontSize: 18, paddingHorizontal: 20 }}>Варианты ответов:</Text>
          </View>
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
    backgroundColor: 'gray'
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
    height: '35%',
    flexDirection: 'row'
  },
  arrow: {
    height: '100%',
    width: '5%',
    paddingVertical: '30%'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 300,
    width: 300
  }
});
