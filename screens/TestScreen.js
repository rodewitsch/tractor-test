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

  state = {
    ticketNumber: this.randomInteger(0, questions.default.length),
    questionNumber: 0
  }

  constructor(props) { super(props); }

  randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  componentDidMount() {
    console.log('ticketNumber', this.state.ticketNumber);
  }

  componentDidUpdate() {
    console.log('question', this.state.questionNumber);
    console.log(questions.default[this.state.ticketNumber][this.state.questionNumber]);
  }

  getQuestionItem() {
    return questions.default[this.state.ticketNumber][this.state.questionNumber];
  }

  setAnswer(number) {
    console.log(this.state.questionNumber);
    if (this.state.questionNumber < 9) {
      this.setState({ questionNumber: ++this.state.questionNumber });
    } else {
      console.log();
      this.setState({ questionNumber: 0 });
    }
  }

  render() {
    return (
      <View style={{ height: '100%' }}>

        <View style={{ height: "5%", flexDirection: 'row', justifyContent: 'space-between' }}>
          {Array(10).fill(null).map((item, index) => (
            <Text style={{ margin: 10, fontWeight: (index == this.state.questionNumber ? 800 : 'normal') }}>{++index}</Text>
          ))}
        </View>

        <View style={{ height: '40%' }}>
          <View style={{ height: '50%', padding: 20 }}>
            <Text style={{ fontSize: 20, textAlign: 'justify' }}>{this.getQuestionItem().questionText}</Text>
          </View>
          <View style={{ height: '50%' }}>
            {this.getQuestionItem().questionImage ? <Image resizeMode='contain' style={{ height: 150 }} source={{ uri: this.getQuestionItem().questionImage }}></Image> : null}
          </View>
        </View>

        <View style={{ height: '50%' }}>
          {
            this.getQuestionItem().answers.map((answer, index) => (
              <TouchableOpacity onPress={() => this.setAnswer(1)}>
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
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
