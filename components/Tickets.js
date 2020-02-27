import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class Tickets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tickets: []
    };
  }

  componentDidMount() {
    switch (this.props.category) {
      case 'A': this.setState({ tickets: Array(40).fill(1) }); break;
      case 'B': this.setState({ tickets: Array(40).fill(1) }); break;
      case 'D': this.setState({ tickets: Array(40).fill(1) }); break;
      case 'E1': this.setState({ tickets: Array(20).fill(1) }); break;
      case 'E2': this.setState({ tickets: Array(30).fill(1) }); break;
      case 'F': this.setState({ tickets: Array(30).fill(1) }); break;
    }
  }

  render() {
    return (
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', height: 340 }}>
          {this.state.tickets.map((item, index) => <TouchableOpacity key={index} style={styles.item} onPress={() => this.props.navigation.navigate('Test', { category: this.props.category, ticket: index })}><Text style={{ fontSize: 20 }}>{`${index + 1}`}</Text></TouchableOpacity>)}
        </View >
        <TouchableOpacity style={{ ...styles.item, width: 270 }} onPress={() => this.props.navigation.navigate('Test', { category: this.props.category })}><Text style={{fontWeight: 'bold'}}>Случайный билет</Text></TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: 49,
    margin: 3,
    backgroundColor: 'white',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
