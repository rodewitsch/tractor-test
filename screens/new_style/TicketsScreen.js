import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Dimensions
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemeColors from '../../constants/ThemeColors';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const screenHeight = screen.height;
const smallScreen = screenWidth <= 320;

export class TicketsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.category = props.navigation.state.params.category;
    this.state = { tickets: Array(this.getTicketsCount(this.category)).fill(1).map((item, index) => index + 1) };
    this.colors = ThemeColors(global.darkTheme);
    this.styles = this.getStyles();
    this.colsCount = Math.floor((screenWidth - 60) / 55);
    this.rowsCount = Math.ceil(this.getTicketsCount(this.category) / this.colsCount);
    if (this.colsCount * this.rowsCount > this.getTicketsCount(this.category)) this.state.tickets.push(...Array(this.colsCount * this.rowsCount - this.getTicketsCount(this.category)));
  }

  componentWillUnmount = () => this.backHandler.remove();

  getTicketsCount = (category) => {
    switch (category) {
      case 'A':
      case 'B':
      case 'D': return 40;
      case 'E1': return 20;
      case 'E2':
      case 'F': return 30;
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => this.props.navigation.navigate('HomeNew');

  render() {
    return (
      <View style={this.styles.container}>
        {this.state.tickets.map((item, index) =>
          <TouchableOpacity key={index} style={{ ...this.styles.item, ...(!item ? this.styles.hiddenItem : null) }} onPress={() => item ? this.props.navigation.navigate('TestNew', { category: this.category, ticket: index }) : false}>
            <Text style={this.styles.itemLabel}>{`${index + 1}`}</Text>
          </TouchableOpacity>)
        }
        <TouchableOpacity style={{ ...this.styles.item, ...this.styles.button }} onPress={() => this.props.navigation.navigate('TestNew', { category: this.category })}>
          <Text style={this.styles.buttonLabel}>Случайный билет</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...this.styles.item, ...this.styles.button, backgroundColor: this.colors.questionNumber, marginTop: 25 }} onPress={() => this.props.navigation.navigate('HomeNew')}>
          <Text style={this.styles.buttonLabel}>Отмена</Text>
        </TouchableOpacity>
      </View >
    );
  }

  getStyles = () => StyleSheet.create({
    container: {
      backgroundColor: this.colors.background,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      paddingTop: '25%',
      paddingHorizontal: 30
    },
    item: {
      width: 45,
      margin: 5,
      backgroundColor: this.colors.middleground,
      height: screenWidth / 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    },
    itemLabel: {
      fontSize: smallScreen ? 16 : 20,
      color: this.colors.text
    },
    button: {
      height: screenWidth / 10,
      width: screenWidth / 1.22
    },
    buttonLabel: {
      fontWeight: 'bold',
      color: this.colors.text
    },
    hiddenItem: {
      opacity: 0,
      height: 0
    }
  })
}

TicketsScreen.navigationOptions = { header: null };
