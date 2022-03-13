import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Text, Switch, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/global';

export default function (props: any) {
  const { colors } = useTheme();
  return <SettingsItem {...props} colors={colors}></SettingsItem>;
}

class SettingsItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.colors = this.props.colors;
    this.styles = this.getStyles();
  }

  shouldComponentUpdate = () => {
    this.colors = this.props.colors;
    this.styles = this.getStyles();
    return true;
  };

  render = () => (
    <View style={{ ...GlobalStyles.flexRow, justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity onPress={this.props.onPress} style={{ width: '85%' }}>
        <Text style={this.styles.settingLabel}>{this.props.title}</Text>
      </TouchableOpacity>
      <Switch
        style={this.styles.checkbox}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={this.props.value ? '#579DD0' : '#f4f3f4'}
        onValueChange={this.props.onPress}
        value={this.props.value}
      />
    </View>
  );

  getStyles = () =>
    StyleSheet.create({
      settingLabel: {
        color: this.colors.text,
        fontSize: global.smallScreen ? 13 : 15,
        marginTop: 15,
      },
      checkbox: {
        marginTop: 15,
        marginRight: 5,
      },
    });
}
