import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { ThemeColorType } from '../constants/Colors';

import Global from '../global.variables';

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: '100%',
      width: Global.screenWidth,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: Global.smallScreen ? 18 : 22,
      color: colors.text,
      textAlign: 'center',
    },
    buttonsArea: {
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'row',
      marginTop: 25,
    },
    button: {
      display: 'flex',
      backgroundColor: colors.middleground,
      height: Global.smallScreen ? 38 : 45,
      width: Global.smallScreen ? 130 : 160,
      borderRadius: 10,
      marginHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: colors.text,
      textAlign: 'center',
      fontSize: Global.smallScreen ? 14 : 17,
    },
  });

interface ComponentProps {
  title: string;
  cancel: (event: GestureResponderEvent) => void;
  cancelButton: string;
  success: (event: GestureResponderEvent) => void;
  successButton: string;
}

export default function (props: ComponentProps) {
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.buttonsArea}>
        <TouchableOpacity onPress={props.cancel} style={styles.button}>
          <Text style={styles.label}>{props.cancelButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.success} style={styles.button}>
          <Text style={styles.label}>{props.successButton}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
