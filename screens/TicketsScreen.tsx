import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, ScrollView, BackHandler, View, TouchableOpacity } from 'react-native';

import Global from '../global.variables';

export default function (props: any) {
  const { colors } = useTheme();
  return <TicketsScreen {...props} colors={colors}></TicketsScreen>;
}
class TicketsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.category = this.props.route.params.category;
    this.state = {
      tickets: Array(this.getTicketsCount(this.category))
        .fill(1)
        .map((item, index) => index + 1),
    };
    this.colors = this.props.colors;
    this.styles = this.getStyles();
    this.colsCount = Math.floor((Global.screenWidth - 60) / 55);
    this.rowsCount = Math.ceil(this.getTicketsCount(this.category) / this.colsCount);
    if (this.colsCount * this.rowsCount > this.getTicketsCount(this.category))
      this.state.tickets.push(...Array(this.colsCount * this.rowsCount - this.getTicketsCount(this.category)));
  }

  componentWillUnmount = () => this.backHandler.remove();

  getTicketsCount = (category) => {
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
    }
  };

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  handleBackPress = () => {
    this.props.navigation.navigate('HomeNew');
    return true; 
  }

  render() {
    return (
      <View style={this.styles.wrapper}>
        <ScrollView contentContainerStyle={this.styles.container}>
          {this.state.tickets.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{ ...this.styles.item, ...(item || this.styles.hiddenItem) }}
              onPress={() =>
                !item || this.props.navigation.navigate('TestNew', { category: this.category, ticket: index })
              }
            >
              <Text style={this.styles.itemLabel}>{`${index + 1}`}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{ ...this.styles.item, ...this.styles.button }}
            onPress={() => this.props.navigation.navigate('TestNew', { category: this.category })}
          >
            <Text style={this.styles.buttonLabel}>Случайный билет</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...this.styles.item,
              ...this.styles.button,
              backgroundColor: this.colors.questionNumber,
              marginTop: 25,
            }}
            onPress={() => this.props.navigation.navigate('HomeNew')}
          >
            <Text style={this.styles.buttonLabel}>Отмена</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  getStyles = () =>
    StyleSheet.create({
      wrapper: {
        height: '100%',
        width: '100%',
        backgroundColor: this.colors.background,
      },
      container: {
        backgroundColor: this.colors.background,
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
        backgroundColor: this.colors.middleground,
        height: Global.screenWidth / 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      },
      itemLabel: {
        fontSize: Global.smallScreen ? 16 : 20,
        color: this.colors.text,
      },
      button: {
        height: Global.screenWidth / 10,
        width: Global.screenWidth / 1.22,
      },
      buttonLabel: {
        fontWeight: 'bold',
        color: this.colors.text,
      },
      hiddenItem: {
        opacity: 0,
        height: 0,
      },
    });
}
