import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Global from '../global.variables';

export default function (props: any) {
  const { colors } = useTheme();
  return <PromptModal {...props} colors={colors}></PromptModal>;
}

class PromptModal extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props;
    this.colors = this.props.colors;
    this.styles = this.getStyles();
  }

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.title}>{this.props.title}</Text>
        <View style={this.styles.buttonsArea}>
          <TouchableOpacity onPress={this.props.cancel} style={this.styles.button}>
            <Text style={this.styles.label}>{this.props.cancelButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.success} style={this.styles.button}>
            <Text style={this.styles.label}>{this.props.successButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  getStyles = () =>
    StyleSheet.create({
      container: {
        backgroundColor: this.colors.background,
        height: '100%',
        width: Global.screenWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: Global.smallScreen ? 18 : 22,
        color: this.colors.text,
        textAlign: 'center',
      },
      buttonsArea: {
        backgroundColor: this.colors.background,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 25,
      },
      button: {
        display: 'flex',
        backgroundColor: this.colors.middleground,
        height: Global.smallScreen ? 38 : 45,
        width: Global.smallScreen ? 130 : 160,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      label: {
        color: this.colors.text,
        textAlign: 'center',
        fontSize: Global.smallScreen ? 14 : 17,
      },
    });
}
