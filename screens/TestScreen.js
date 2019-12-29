import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity
} from 'react-native';

import * as questions from '../assets/questions/a/index';

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.ticketNumber = this.randomInteger(0, questions.default.length);
    this.state.questionNumber = 0;
    this.state.answers = new Array(questions.default[this.state.ticketNumber].length)
      .fill(null)
      .map((item, index) => ({ rightAnswer: (this.getQuestionItem(this.state.ticketNumber, index).rightAnswer - 1), userAnswer: null }));
  }

  setQuestion(number) { this.setState({ questionNumber: number }); }

  randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  getQuestionItem(ticketNumber = this.state.ticketNumber, questionNumber = this.state.questionNumber) {
    return questions.default[ticketNumber][questionNumber];
  }

  setAnswer(number) {
    this.state.answers[this.state.questionNumber].userAnswer = number;
    const examStatus = this.getExamStatus();
    if (examStatus != 'inProgress') alert(examStatus);
    this.setState({ answers: this.state.answers });
    if (this.state.questionNumber < 9) {
      this.setState({ questionNumber: this.state.questionNumber + 1 });
    } else {
      this.setState({ questionNumber: 0 });
    }
  }

  getExamStatus() {
    if (this.state.answers.every(item => item.userAnswer != null)) {
      if (this.state.answers.every(item => item.userAnswer == item.rightAnswer)) return 'passed'; else return 'failed';
    }
    return 'inProgress';
  }

  getQuestionStatusColor(number) {
    if (this.state.answers[number].userAnswer == null) return 'black';
    if (this.state.answers[number].rightAnswer == this.state.answers[number].userAnswer) return 'green';
    return 'red';
  }

  render() {
    return (
      <View style={styles.container}>

        <View>
          <Text style={{ fontSize: 20 }}>Категория A. Билет №{this.state.ticketNumber + 1}</Text>
        </View>

        <View style={{ height: "6%", paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'gray' }}>
          {Array(10).fill(null).map((item, index) => (
            <TouchableOpacity onPress={() => this.setQuestion(index)}>
              <Text style={{ margin: 10, color: this.getQuestionStatusColor(index), fontWeight: (index == this.state.questionNumber ? '800' : 'normal') }}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <Text style={{ fontSize: 20 }}>Вопрос:</Text>
        </View>

        <View style={{ height: '40%' }}>
          <View style={{ height: '50%', padding: 20 }}>
            <Text style={{ fontSize: 20, textAlign: 'justify' }}>{this.getQuestionItem().questionText}</Text>
          </View>
          <View style={{ height: '50%' }}>
            {this.getQuestionItem().questionImage ? <Image resizeMode='contain' style={{ height: 150 }} source={{ uri: this.getQuestionItem().questionImage }}></Image> : null}
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 20 }}>Варианты ответов:</Text>
        </View>
        <View style={{ height: '50%' }}>
          {
            this.getQuestionItem().answers.map((answer, index) => (
              <TouchableOpacity onPress={() => this.setAnswer(index)}>
                <View style={{ backgroundColor: 'gray', paddingVertical: 10, marginVertical: 5, paddingLeft: 15 }}>
                  <Text style={{ fontSize: 18 }}>{index + 1}. {answer}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View >
    )
  };
}

TestScreen.navigationOptions = {
  title: 'Test',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8e8e8',
    height: '100%'
  },
});
