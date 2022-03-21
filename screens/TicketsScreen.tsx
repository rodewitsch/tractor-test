import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, BackHandler } from 'react-native';
import { ThemeColorType } from '../constants/Colors';
import Global from '../global.variables';
import { useEffect } from 'react';

const getTicketsCount = (category: string): number => {
  switch (category) {
    case 'A':
      return 25;
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

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    wrapper: {
      height: '100%',
      width: '100%',
      backgroundColor: colors.background,
    },
    container: {
      backgroundColor: colors.background,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Global.screenHeight <= 540 ? '15%' : '25%',
      paddingHorizontal: 30,
    },
    item: {
      width: Global.smallScreen ? 35 : 45,
      margin: 5,
      backgroundColor: colors.middleground,
      height: Global.screenWidth / 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    itemLabel: {
      fontSize: Global.smallScreen ? 16 : 20,
      color: colors.text,
    },
    button: {
      height: Global.screenWidth / 10,
      width: Global.screenWidth / 1.22,
    },
    buttonLabel: {
      fontWeight: 'bold',
      color: colors.text,
    },
    hiddenItem: {
      opacity: 0,
      height: 0,
    },
  });

export default function (props: any) {
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const category = props.route.params.category;
  const state = {
    tickets: Array(getTicketsCount(category))
      .fill(1)
      .map((item, index) => index + 1),
  };
  const styles = getStyles(colors);
  const colsCount = Math.floor((Global.screenWidth - 60) / 55);
  const rowsCount = Math.ceil(getTicketsCount(category) / colsCount);
  if (colsCount * rowsCount > getTicketsCount(category))
    state.tickets.push(...Array(colsCount * rowsCount - getTicketsCount(category)));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      props.navigation.navigate('HomeNew');
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {state.tickets.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ ...styles.item, ...(!item ? styles.hiddenItem : {}) }}
            onPress={() => !item || props.navigation.navigate('TestNew', { category: category, ticket: index })}
          >
            <Text style={styles.itemLabel}>{`${index + 1}`}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={{ ...styles.item, ...styles.button }}
          onPress={() => props.navigation.navigate('TestNew', { category: category })}
        >
          <Text style={styles.buttonLabel}>Случайный билет</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.item,
            ...styles.button,
            backgroundColor: colors.questionNumber,
            marginTop: 25,
          }}
          onPress={() => props.navigation.navigate('HomeNew')}
        >
          <Text style={styles.buttonLabel}>Отмена</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
