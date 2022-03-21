import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Image, View, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import Modal from 'react-native-modalbox';

import COLORS, { ThemeColorType } from '../constants/Colors';

import * as A from '../assets/questions/a/index';
import * as B from '../assets/questions/b/index';
import * as D from '../assets/questions/d/index';
import * as E1 from '../assets/questions/e1/index';
import * as E2 from '../assets/questions/e2/index';
import * as F from '../assets/questions/f/index';

import GlobalStyles from '../styles/global';
import BackSvg from '../assets/svg/back.svg';
import TimerSvg from '../assets/svg/timer.svg';
import PromptModal from '../components/PromptModal';
import { NavigationProp, Theme, useTheme, ParamListBase, RouteProp } from '@react-navigation/native';

import Global from '../global.variables';

interface RouteParams {
  examStatus: string;
  ticket: number;
  category: string;
  retry: boolean;
}

interface ComponentProps {
  route: RouteProp<{ params: RouteParams }>;
  navigation: NavigationProp<ParamListBase>;
}

const getCategoryTickets = (category: string) => {
  switch (category) {
    case 'A':
      return A;
    case 'B':
      return B;
    case 'D':
      return D;
    case 'E1':
      return E1;
    case 'E2':
      return E2;
    case 'F':
      return F;
    default:
      throw 'Unknown category';
  }
};

const randomInteger = (min: number, max: number): number => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: '100%',
    },
    header: {
      backgroundColor: colors.middleground,
      paddingBottom: 15,
    },
    headerIcon: {
      ...GlobalStyles.flexRow,
      alignItems: 'center',
      padding: 20,
    },
    headerTitle: {
      width: '63%',
      marginLeft: 3,
    },
    headerTicketNumber: {
      color: colors.text,
      fontSize: Global.smallScreen ? 15 : 18,
    },
    headerCategory: {
      color: '#5a5a5a',
      fontSize: Global.smallScreen ? 12 : 14,
      fontWeight: 'bold',
    },
    timer: {
      ...GlobalStyles.flexRow,
      position: 'absolute',
      left: Global.screenWidth - 90,
      alignItems: 'center',
      width: '37%',
    },
    timerLabel: {
      color: colors.text,
      marginLeft: 5,
      fontWeight: 'bold',
      fontSize: Global.smallScreen ? 16 : 18,
    },
    examProcess: {
      ...GlobalStyles.flexRow,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    examProcessItem: {
      width: Global.screenWidth / 13,
      height: Global.screenWidth / 13,
      borderRadius: 10,
      borderWidth: 1,
      borderStyle: 'solid',
      display: 'flex',
      marginRight: 5,
      justifyContent: 'center',
      backgroundColor: colors.questionNumber,
    },
    questionNumberStatus: {
      textAlign: 'center',
      color: COLORS.whiteText,
      fontSize: Global.smallScreen ? 16 : 18,
    },
    questionArea: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginTop: 20,
    },
    questionText: {
      flex: 1,
      flexWrap: 'nowrap',
      fontSize: Global.smallScreen ? 16 : 18,
      color: colors.text,
    },
    answersArea: {
      height: '50%',
      marginTop: 20,
    },
    answerItem: {
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: colors.defaultAnswerColor,
      paddingVertical: 8,
      marginVertical: 5,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      borderRadius: 10,
    },
    exitModal: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      height: '100%',
      width: '100%',
      backgroundColor: 'black',
    },
  });

export default function (props: ComponentProps) {
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const exitModal = useRef<Modal>(null);
  const styles = getStyles(colors);

  const currentCategory = props.route.params.category;
  const selectedTicket = props.route.params.ticket;

  const ticketNumber =
    selectedTicket !== undefined
      ? selectedTicket
      : randomInteger(0, getCategoryTickets(currentCategory).default.length - 1);

  const initialExamState = {
    examStatus: 'inProgress',
    ticketNumber,
    questionNumber: 0,
    timer: '10:00',
    answers: new Array(getCategoryTickets(currentCategory).default[ticketNumber].length)
      .fill(null)
      .map((item, index) => ({
        rightAnswer: getQuestionItem(ticketNumber, index).rightAnswer - 1,
        userAnswer: -1,
      })),
  };

  const [timeout, setTimeoutValue] = useState(600);
  const [state, setState] = useState(initialExamState);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (state.examStatus !== 'inProgress') return;
    const tick = setTimeout(() => setTimeoutValue(timeout - 1), 1000);

    let minutes = parseInt((timeout / 60).toFixed(2), 10);
    let seconds = parseInt((timeout % 60).toFixed(2), 10);

    setState({
      ...state,
      timer: (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds),
    });

    if (timeout < 0) {
      setState({
        ...state,
        examStatus: 'timeout',
      });

      return props.navigation.navigate('Result', {
        examStatus: state.examStatus,
        ticketNumber: state.ticketNumber,
        answers: state.answers,
        category: currentCategory,
      });
    }

    return () => {
      if (tick) clearInterval(tick);
    };
  }, [timeout]);

  useEffect(() => {
    if (state.examStatus !== 'inProgress' && props?.route?.params?.retry) {
      setState(initialExamState);
      setTimeoutValue(600);
    }
  });

  function getQuestionItem(ticketNumber: number = state.ticketNumber, questionNumber: number = state.questionNumber) {
    return getCategoryTickets(currentCategory).default[ticketNumber][questionNumber];
  }

  function getExamStatus() {
    if (state.answers.every((item) => item.userAnswer !== -1)) {
      if (state.answers.reduce((acc, item) => (item.userAnswer !== item.rightAnswer ? (acc += 1) : acc), 0) > 1)
        return 'failed';
      else return 'passed';
    }
    return 'inProgress';
  }

  function handleBackPress() {
    if (!Global.appSettings.requestExamExit) props.navigation.navigate('HomeNew');
    exitModal.current?.open();
    return true;
  }

  function setQuestion(number: number) {
    if (number > 9 || number < 0) return;
    setState({ ...state, questionNumber: number });
  }

  function setAnswer(number: number) {
    if (state.examStatus !== 'inProgress') return;
    if (state.answers[state.questionNumber].userAnswer !== -1) {
      const EMPTY_ANSWER = state.answers.findIndex(
        (item, index) => item.userAnswer === -1 && index > state.questionNumber
      );
      if (state.questionNumber < 9 && EMPTY_ANSWER !== -1) {
        setState({
          ...state,
          questionNumber: EMPTY_ANSWER,
        });
      } else {
        setState({
          ...state,
          questionNumber: state.answers.findIndex((item) => item.userAnswer === -1),
        });
      }
    } else {
      state.answers[state.questionNumber].userAnswer = number;
      state.examStatus = getExamStatus();
      setState({ ...state });
      if (state.examStatus !== 'inProgress') {
        return props.navigation.navigate('Result', {
          examStatus: state.examStatus,
          ticketNumber: state.ticketNumber,
          answers: state.answers,
          category: currentCategory,
        });
      }
    }
  }

  function onSwipe(gestureName: string, gestureState: { dx: number }) {
    if (gestureName === null) {
      const { dx } = gestureState;
      if (dx > 0) {
        setQuestion(state.questionNumber - 1);
      } else if (dx < 0) {
        setQuestion(state.questionNumber + 1);
      }
    } else {
      switch (gestureName) {
        case 'SWIPE_RIGHT':
          setQuestion(state.questionNumber - 1);
          break;
        case 'SWIPE_LEFT':
          setQuestion(state.questionNumber + 1);
          break;
      }
    }
  }

  function getQuestionStatusColor(number: number) {
    if (number === state.questionNumber) return 'white';
    if (state.answers[number].userAnswer === -1) return colors.questionNumber;
    if (state.answers[number].rightAnswer === state.answers[number].userAnswer)
      return COLORS.questionStatusSuccessBackground;
    return COLORS.questionStatusWrongBackground;
  }

  function getAnswerStatusColor(number: number) {
    const rightAnswer = getQuestionItem().rightAnswer - 1;
    const userAnswer = state.answers[state.questionNumber].userAnswer;
    if (userAnswer === -1) return colors.defaultAnswerColor;
    if (number === userAnswer && userAnswer === rightAnswer) return COLORS.questionStatusSuccessBackground;
    if (number !== userAnswer && number === rightAnswer) return COLORS.questionStatusSuccessBackground;
    if (number === userAnswer && number !== rightAnswer) return COLORS.questionStatusWrongBackground;
    return colors.defaultAnswerColor;
  }

  return (
    <GestureRecognizer onSwipe={(direction, state) => onSwipe(direction, state)} style={styles.container}>
      <Modal
        useNativeDriver={true}
        style={GlobalStyles.modal}
        backButtonClose={true}
        position={'center'}
        ref={exitModal}
      >
        <PromptModal
          success={() => props.navigation.navigate('HomeNew')}
          cancel={() => exitModal.current?.close()}
          title="Выйти из экзамена"
          successButton="Выйти"
          cancelButton="Отмена"
        />
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <TouchableOpacity onPress={() => handleBackPress()}>
            <BackSvg
              width={Global.smallScreen ? 24 : 24}
              height={Global.smallScreen ? 24 : 24}
              style={{ marginRight: 10 }}
              fill={colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTicketNumber}>Билет {state.ticketNumber + 1}</Text>
            <Text style={styles.headerCategory}>Категория {currentCategory.substr(0, 1)}</Text>
          </View>
          <View style={styles.timer}>
            <TimerSvg width={Global.smallScreen ? 20 : 24} height={Global.smallScreen ? 20 : 24} fill={colors.text} />
            <Text style={styles.timerLabel}>{state.timer}</Text>
          </View>
        </View>

        <View style={styles.examProcess}>
          {Array(10)
            .fill(null)
            .map((item, index) => (
              <TouchableOpacity key={index} onPress={() => setQuestion(index)}>
                <View
                  style={{
                    ...styles.examProcessItem,
                    borderColor: getQuestionStatusColor(index),
                  }}
                >
                  <Text
                    style={{
                      ...styles.questionNumberStatus,
                      color: colors.text,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View style={styles.questionArea}>
        <Text style={styles.questionText}>{getQuestionItem().questionText}</Text>
      </View>

      <ScrollView style={styles.answersArea}>
        {!getQuestionItem().questionImage || (
          <Image
            resizeMode="contain"
            style={{ height: 150, marginVertical: 5 }}
            source={{ uri: getQuestionItem().questionImage }}
          />
        )}
        {getQuestionItem().answers.map((answer, index) => (
          <TouchableOpacity key={index} disabled={state.examStatus !== 'inProgress'} onPress={() => setAnswer(index)}>
            <View
              style={{
                ...styles.answerItem,
                borderColor: getAnswerStatusColor(index),
              }}
            >
              <Text
                style={{
                  fontSize: Global.smallScreen ? 14 : 16,
                  color: colors.text,
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
