import { NavigationProp, RouteProp, ParamListBase, Theme, useTheme } from '@react-navigation/native';import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, BackHandler } from 'react-native';

import CloseSvg from '../assets/svg/close.svg';
import SuccessDarkSvg from '../assets/svg/success_dark.svg';
import SuccessLightSvg from '../assets/svg/success_light.svg';
import UnsuccessDarkSvg from '../assets/svg/unsuccess_dark.svg';
import UnsuccessLightSvg from '../assets/svg/unsuccess_light.svg';
import { ThemeColorType } from '../constants/Colors';

import Global from '../global.variables';

interface Answer {
  userAnswer: number;
  rightAnswer: number;
}

interface RouteParams {
  examStatus: string;
  answers: Answer[];
  ticketNumber: number;
  category: string;
}
interface ComponentProps {
  route: RouteProp<{ params: RouteParams }>;
  navigation: NavigationProp<ParamListBase>;
}

const getStyles = (colors: ThemeColorType, examStatus: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: '100%',
    },
    header: {
      zIndex: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 25,
      marginBottom: -15,
    },
    headerTitle: {
      color: colors.text,
      fontSize: Global.smallScreen ? 15 : 18,
    },
    body: {
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    resultLabel: {
      color: colors.text,
      fontSize: Global.smallScreen ? 30 : 40,
      textAlign: 'center',
    },
    examResultLabel: {
      marginTop: 5,
      color: examStatus === 'passed' ? '#007234' : '#BD0008',
      fontSize: Global.smallScreen ? 16 : 20,
      textAlign: 'center',
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.middleground,
      width: '90%',
      marginTop: 20,
      borderRadius: 10,
      height: Global.smallScreen ? 40 : 50,
    },
  });

const getTicketsCount = (category: string): number => {
  switch (category) {
    case 'A':
    case 'B':
    case 'D':
      return 40;
    case 'E1':
      return 20;
    case 'E2':
    case 'F':
      return 30;
    default:
      throw 'Undefined category';
  }
};

export default function (props: ComponentProps) {
  const { colors, dark } = useTheme() as Theme & { colors: ThemeColorType };
  const examStatus = props.route.params.examStatus;
  const answers = props.route.params.answers;
  const ticketNumber = props.route.params.ticketNumber;
  const category = props.route.params.category;
  const styles = getStyles(colors, examStatus);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      props.navigation.navigate('TestNew', {
        category: category,
        ticket: ticketNumber,
        retry: false,
      });
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const resultAction = () => {
    if (examStatus === 'passed') {
      let nextTicketNumber = ticketNumber + 1;
      if (ticketNumber >= getTicketsCount(category)) nextTicketNumber = 0;
      return props.navigation.navigate('TestNew', {
        category: category,
        ticket: nextTicketNumber,
        retry: true,
      });
    }
    return props.navigation.navigate('TestNew', {
      category: category,
      ticket: ticketNumber,
      retry: true,
    });
  };

  const getExamResultLabel = () => {
    const WRONG_ANSWERS = answers.reduce(
      (acc: number, item: Answer) => (item.userAnswer !== item.rightAnswer ? (acc += 1) : acc),
      0
    );
    switch (examStatus) {
      case 'passed': {
        if (WRONG_ANSWERS) return 'Допущено 1 ошибка';
        return 'Ни одной ошибки';
      }
      case 'failed': {
        if (WRONG_ANSWERS > 5) return `Допущено ${WRONG_ANSWERS} ошибок`;
        return `Допущено ${WRONG_ANSWERS} ошибки`;
      }
      case 'timeout':
        return 'Время вышло';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('TestNew', { category: category, ticket: ticketNumber })}
        >
          <CloseSvg
            width={Global.smallScreen ? 16 : 18}
            height={Global.smallScreen ? 16 : 18}
            style={{ marginHorizontal: 20, marginTop: 3 }}
            fill={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Результат</Text>
      </View>
      <View style={styles.body}>
        <View style={{ marginTop: -40 }}>
          {examStatus === 'passed' ? (
            dark ? (
              <SuccessDarkSvg width={Global.screenWidth} height={Global.screenWidth + 80} />
            ) : (
              <SuccessLightSvg width={Global.screenWidth} height={Global.screenWidth + 80} />
            )
          ) : dark ? (
            <UnsuccessDarkSvg width={Global.screenWidth} height={Global.screenWidth + 80} />
          ) : (
            <UnsuccessLightSvg width={Global.screenWidth} height={Global.screenWidth + 80} />
          )}
        </View>
        <View style={{ marginTop: Global.smallScreen ? -50 : 5 }}>
          <Text style={styles.resultLabel}>{examStatus === 'passed' ? 'Поздравляем!' : 'Экзамен не сдан'}</Text>
          <Text style={styles.examResultLabel}>{getExamResultLabel()}</Text>
        </View>
        <TouchableOpacity onPress={() => resultAction()} style={styles.button}>
          <Text style={{ color: colors.text, textAlign: 'center', fontSize: Global.smallScreen ? 16 : 18 }}>
            {examStatus === 'passed' ? 'Следующий билет' : 'Пройти еще раз'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
