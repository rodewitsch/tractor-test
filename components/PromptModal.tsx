import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { ThemeColorType } from '../constants/Colors';

import Global from '../global.variables';

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 100,
    },
    card: {
      backgroundColor: colors.background,
      width: '85%',
      maxWidth: 400,
      borderRadius: 15,
      paddingVertical: 30,
      paddingHorizontal: 15,
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
      width: '100%',
      marginTop: 25,
    },
    button: {
      flex: 1,
      maxWidth: 160,
      display: 'flex',
      backgroundColor: colors.middleground,
      height: Global.smallScreen ? 38 : 45,
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
  visible: boolean;
}

export default function (props: ComponentProps) {
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const styles = getStyles(colors);

  if (!props.visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
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
    </View>
  );
}
