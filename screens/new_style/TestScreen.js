import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Modal from "react-native-modalbox";
import ThemeColors from "../../constants/ThemeColors";

import COLORS from "../../constants/Colors";

import * as A from "../../assets/questions/a/index";
import * as B from "../../assets/questions/b/index";
import * as D from "../../assets/questions/d/index";
import * as E1 from "../../assets/questions/e1/index";
import * as E2 from "../../assets/questions/e2/index";
import * as F from "../../assets/questions/f/index";

import gs from "../../styles/global";
import BackSvg from "../../assets/svg/back.svg";
import TimerSvg from "../../assets/svg/timer.svg";
import PromptModal from "../../components/new/PromptModal";

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.currentCategory = props.navigation.state.params.category;
    this.selectedTicket = props.navigation.state.params.ticket;
    this.timer = null;
    this.state = {
      examStatus: "inProgress",
      ticketNumber:
        this.selectedTicket != undefined
          ? this.selectedTicket
          : this.randomInteger(
              0,
              this.getCategoryTickets(this.currentCategory).default.length - 1
            ),
      questionNumber: 0,
      timer: "10:00",
    };
    this.state.answers = new Array(
      this.getCategoryTickets(this.currentCategory).default[
        this.state.ticketNumber
      ].length
    )
      .fill(null)
      .map((item, index) => ({
        rightAnswer:
          this.getQuestionItem(this.state.ticketNumber, index).rightAnswer - 1,
        userAnswer: null,
      }));
    this.colors = ThemeColors(global.appSettings.darkTheme);
    this.styles = this.getStyles();
  }

  refreshState = () =>
    this.setState((prevState) => ({
      ...prevState,
      settings: global.appSettings,
    }));

  componentDidUpdate() {
    if (this.props.navigation.state.params.retry) {
      this.setState({
        examStatus: "inProgress",
        ticketNumber: this.props.navigation.state.params.ticket,
        questionNumber: 0,
        timer: "10:00",
        answers: new Array(
          this.getCategoryTickets(
            this.props.navigation.state.params.category
          ).default[this.props.navigation.state.params.ticket].length
        )
          .fill(null)
          .map((item, index) => ({
            rightAnswer:
              this.getQuestionItem(
                this.props.navigation.state.params.ticket,
                index
              ).rightAnswer - 1,
            userAnswer: null,
          })),
      });
      this.startTimer(600);
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackPress
      );
    }
    this.props.navigation.state.params.retry = false;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.backHandler.remove();
  }

  handleBackPress = () => {
    if (!this.state.settings.requestExamExit)
      return this.props.navigation.navigate("HomeNew");
    this.refs.exitModal.open();
    return true;
  };

  componentDidMount() {
    this.refreshState();
    this.startTimer(600);
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
  }

  getCategoryTickets(category) {
    switch (category) {
      case "A":
        return A;
      case "B":
        return B;
      case "D":
        return D;
      case "E1":
        return E1;
      case "E2":
        return E2;
      case "F":
        return F;
    }
  }

  setQuestion(number) {
    if (number > 9 || number < 0) return;
    this.setState({ questionNumber: number });
  }

  randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  getQuestionItem(
    ticketNumber = this.state.ticketNumber,
    questionNumber = this.state.questionNumber
  ) {
    return this.getCategoryTickets(this.currentCategory).default[ticketNumber][
      questionNumber
    ];
  }

  setAnswer(number) {
    if (this.state.examStatus != "inProgress") return;
    if (this.state.answers[this.state.questionNumber].userAnswer != null) {
      const EMPTY_ANSWER = this.state.answers.findIndex(
        (item, index) =>
          item.userAnswer == null && index > this.state.questionNumber
      );
      if (this.state.questionNumber < 9 && EMPTY_ANSWER != -1) {
        this.setState({ questionNumber: EMPTY_ANSWER });
      } else {
        this.setState({
          questionNumber: this.state.answers.findIndex(
            (item) => item.userAnswer == null
          ),
        });
      }
    } else {
      this.state.answers[this.state.questionNumber].userAnswer = number;
      this.state.examStatus = this.getExamStatus();
      if (this.state.examStatus != "inProgress") {
        clearInterval(this.timer);
        return this.props.navigation.navigate("Result", {
          examStatus: this.state.examStatus,
          ticketNumber: this.state.ticketNumber,
          answers: this.state.answers,
          category: this.currentCategory,
        });
      }
      this.setState((prevState) => ({ answers: prevState.answers }));
    }
  }

  getExamStatus() {
    if (this.state.answers.every((item) => item.userAnswer != null)) {
      if (
        this.state.answers.reduce(
          (acc, item) =>
            item.userAnswer != item.rightAnswer ? (acc += 1) : acc,
          0
        ) > 1
      )
        return "failed";
      else return "passed";
    }
    return "inProgress";
  }

  getQuestionStatusColor(number) {
    if (number == this.state.questionNumber) return "white";
    if (this.state.answers[number].userAnswer == null)
      return this.colors.questionNumber;
    if (
      this.state.answers[number].rightAnswer ==
      this.state.answers[number].userAnswer
    )
      return COLORS.questionStatusSuccessBackground;
    return COLORS.questionStatusWrongBackground;
  }

  getAnswerStatusColor(number) {
    const rightAnswer = this.getQuestionItem().rightAnswer - 1;
    const userAnswer = this.state.answers[this.state.questionNumber].userAnswer;
    if (userAnswer == null) return this.colors.defaultAnswerColor;
    if (number == userAnswer && userAnswer == rightAnswer)
      return COLORS.questionStatusSuccessBackground;
    if (number != userAnswer && number == rightAnswer)
      return COLORS.questionStatusSuccessBackground;
    if (number == userAnswer && number != rightAnswer)
      return COLORS.questionStatusWrongBackground;
    return this.colors.defaultAnswerColor;
  }

  startTimer(duration) {
    let timer = duration,
      minutes,
      seconds;
    this.timer = setInterval(
      function (self) {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        self.setState({ timer: minutes + ":" + seconds });

        if (--timer < 0) {
          self.setState({ examStatus: "timeout" });
          clearInterval(self.timer);
          return self.props.navigation.navigate("Result", {
            examStatus: self.state.examStatus,
            ticketNumber: self.state.ticketNumber,
            answers: self.state.answers,
            category: self.currentCategory,
          });
        }
      },
      1000,
      this
    );
  }

  onSwipe(gestureName, gestureState) {
    if (gestureName == null) {
      const { dx } = gestureState;
      if (dx > 0) {
        this.setQuestion(this.state.questionNumber - 1);
      } else if (dx < 0) {
        this.setQuestion(this.state.questionNumber + 1);
      }
    } else {
      switch (gestureName) {
        case "SWIPE_RIGHT":
          this.setQuestion(this.state.questionNumber - 1);
          break;
        case "SWIPE_LEFT":
          this.setQuestion(this.state.questionNumber + 1);
          break;
      }
    }
  }

  render() {
    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        style={this.styles.container}
      >
        <Modal
          useNativeDriver={true}
          style={gs.modal}
          backButtonClose={true}
          position={"center"}
          ref="exitModal"
        >
          <PromptModal
            success={() => this.props.navigation.navigate("HomeNew")}
            cancel={() => this.refs.exitModal.close()}
            title="Выйти из экзамена"
            successButton="Выйти"
            cancelButton="Отмена"
          />
        </Modal>

        <View style={this.styles.header}>
          <View style={this.styles.headerIcon}>
            <TouchableOpacity onPress={() => this.handleBackPress()}>
              <BackSvg
                width={global.smallScreen ? 24 : 24}
                height={global.smallScreen ? 24 : 24}
                style={{ marginRight: 10 }}
                fill={this.colors.text}
              />
            </TouchableOpacity>
            <View style={this.styles.headerTitle}>
              <Text style={this.styles.headerTicketNumber}>
                Билет {this.state.ticketNumber + 1}
              </Text>
              <Text style={this.styles.headerCategory}>
                Категория {this.currentCategory.substr(0, 1)}
              </Text>
            </View>
            <View style={this.styles.timer}>
              <TimerSvg
                width={global.smallScreen ? 20 : 24}
                height={global.smallScreen ? 20 : 24}
                fill={this.colors.text}
              />
              <Text style={this.styles.timerLabel}>{this.state.timer}</Text>
            </View>
          </View>

          <View style={this.styles.examProcess}>
            {Array(10)
              .fill(null)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.setQuestion(index)}
                >
                  <View
                    style={{
                      ...this.styles.examProcessItem,
                      borderColor: this.getQuestionStatusColor(index),
                    }}
                  >
                    <Text
                      style={{
                        ...this.styles.questionNumberStatus,
                        color: this.colors.text,
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={this.styles.questionArea}>
          <Text style={this.styles.questionText}>
            {this.getQuestionItem().questionText}
          </Text>
        </View>

        <ScrollView style={this.styles.answersArea}>
          {!this.getQuestionItem().questionImage || (
            <Image
              resizeMode="contain"
              style={{ height: 150, marginVertical: 5 }}
              source={{ uri: this.getQuestionItem().questionImage }}
            />
          )}
          {this.getQuestionItem().answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              disabled={this.state.examStatus != "inProgress"}
              onPress={() => this.setAnswer(index)}
            >
              <View
                style={{
                  ...this.styles.answerItem,
                  borderColor: this.getAnswerStatusColor(index),
                }}
              >
                <Text
                  style={{
                    fontSize: global.smallScreen ? 14 : 16,
                    color: this.colors.text,
                  }}
                >
                  {index + 1}. {answer}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </GestureRecognizer>
    );
  }

  getStyles = () =>
    StyleSheet.create({
      container: {
        backgroundColor: this.colors.background,
        height: "100%",
      },
      header: {
        backgroundColor: this.colors.middleground,
        paddingBottom: 15,
      },
      headerIcon: {
        ...gs.flexRow,
        alignItems: "center",
        padding: 20,
      },
      headerTitle: {
        width: "63%",
        marginLeft: 3,
      },
      headerTicketNumber: {
        color: this.colors.text,
        fontSize: global.smallScreen ? 15 : 18,
      },
      headerCategory: {
        color: "#5a5a5a",
        fontSize: global.smallScreen ? 12 : 14,
        fontWeight: "bold",
      },
      timer: {
        ...gs.flexRow,
        position: "absolute",
        left: global.screenWidth - 90,
        alignItems: "center",
        width: "37%",
      },
      timerLabel: {
        color: this.colors.text,
        marginLeft: 5,
        fontWeight: "bold",
        fontSize: global.smallScreen ? 16 : 18,
      },
      examProcess: {
        ...gs.flexRow,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
      },
      examProcessItem: {
        width: global.screenWidth / 13,
        height: global.screenWidth / 13,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        display: "flex",
        marginRight: 5,
        justifyContent: "center",
        backgroundColor: this.colors.questionNumber,
      },
      questionNumberStatus: {
        textAlign: "center",
        color: COLORS.whiteText,
        fontSize: global.smallScreen ? 16 : 18,
      },
      questionArea: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 20,
      },
      questionText: {
        flex: 1,
        flexWrap: "nowrap",
        fontSize: global.smallScreen ? 16 : 18,
        color: this.colors.text,
      },
      answersArea: {
        height: "50%",
        marginTop: 20,
      },
      answerItem: {
        borderStyle: "solid",
        borderWidth: 1,
        backgroundColor: this.colors.defaultAnswerColor,
        paddingVertical: 8,
        marginVertical: 5,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        borderRadius: 10,
      },
      exitModal: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        height: "100%",
        width: "100%",
        backgroundColor: "black",
      },
    });
}

TestScreen.navigationOptions = { header: null };
