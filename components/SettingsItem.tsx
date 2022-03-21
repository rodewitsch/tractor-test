import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Text, Switch, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/global';
import Global from '../global.variables';
import { ThemeColorType } from '../constants/Colors';

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    settingLabel: {
      color: colors.text,
      fontSize: Global.smallScreen ? 13 : 15,
      marginTop: 15,
    },
    checkbox: {
      marginTop: 15,
      marginRight: 5,
    },
  });

interface ComponentProps {
  title: string;
  onPress: () => void;
  value: boolean;
}

export default function (props: ComponentProps) {
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const styles = getStyles(colors);
  return (
    <View style={{ ...GlobalStyles.flexRow, justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity onPress={props.onPress} style={{ width: '85%' }}>
        <Text style={styles.settingLabel}>{props.title}</Text>
      </TouchableOpacity>
      <Switch
        style={styles.checkbox}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={props.value ? '#579DD0' : '#f4f3f4'}
        onValueChange={props.onPress}
        value={props.value}
      />
    </View>
  );
}
