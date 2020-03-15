import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  StatusBar,
  AsyncStorage,
  BackHandler,
  Alert
} from 'react-native';

import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';

import { About } from '../components/About';
import { Settings } from '../components/Settings';
import { Tickets } from '../components/Tickets';

import DATA from '../constants/MenuItems';
import COLORS from '../constants/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null,
      settings: {
        requestTicketNumber: false,
        requestAppExit: false,
        requestExamExit: true
      }
    };
  }

  refreshState() {
    AsyncStorage.getItem('settings').then(data => {
      if (data) this.setState({ ...this.state, settings: JSON.parse(data) });
      if (!data) AsyncStorage.setItem('settings', JSON.stringify(this.state.settings));
    })
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {
    if (!this.state.settings.requestAppExit) return false;
    Alert.alert(
      '',
      'Закрыть приложение',
      [
        {
          text: 'Отмена',
          onPress: () => true,
          style: 'cancel',
        },
        { text: 'Выйти', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
    return true;
  }

  componentDidMount() {
    this.refreshState();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <SafeAreaView style={styles.container} >
        <View
          style={{ width: '100%', height: '100%' }}>

          <Modal swipeToClose={false} position={"center"} backButtonClose={true} style={styles.about} ref={"about"}>
            <About></About>
          </Modal>

          <Modal swipeToClose={false} position={"center"} backButtonClose={true} onClosed={() => this.refreshState()} style={styles.settings} ref={"settings"}>
            <Settings></Settings>
          </Modal>

          <Modal swipeToClose={false} position={"center"} backButtonClose={true} style={styles.tickets} ref={"tickets"}>
            <Tickets navigation={this.props.navigation} category={this.state.selectedCategory}></Tickets>
          </Modal>

          <StatusBar hidden={true} />

          <Text style={styles.title}>
            Тесты по правилам технической эксплуатации для получения профессии тракториста-машиниста категорий A,{'\u00A0'}B,{'\u00A0'}D,{'\u00A0'}E,{'\u00A0'}F
          </Text>

          <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginRight: 15 }}>
            <TouchableOpacity onPress={() => this.refs.about.open()} style={{ height: 40, width: 40 }} >
              <Icon style={{ fontSize: 35, color: COLORS.settingsButtonColor }} name='md-information-circle-outline' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.refs.settings.open()} >
              <Icon style={{ fontSize: 35, color: COLORS.settingsButtonColor, marginLeft: 10 }} name='md-settings' />
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ height: '80%' }}
            data={DATA}
            renderItem={({ item }) => <Item parent={this} ticketsModal={this.refs.tickets} requestTicketNumber={this.state.settings.requestTicketNumber} category={item.category} image={item.image} description={item.description} />}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    )
  };
}

function Item({ parent, category, image, description, requestTicketNumber, ticketsModal }) {

  function startTest(category) {
    parent.setState({ ...parent.state, selectedCategory: category });
    if (requestTicketNumber) {
      ticketsModal.open();
    } else {
      parent.props.navigation.navigate('Test', { category })
    }
  }


  return (
    <TouchableOpacity onPress={() => startTest(category)}>
      <View style={styles.item}>
        <View style={{ flexDirection: 'row' }}>
          <Image resizeMode='contain' style={styles.itemImage} source={{ uri: image }}></Image>
          <Text style={styles.itemCategory}>{category.substr(0, 1)}</Text>
          <Text style={styles.itemDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  title: {
    height: '18%',
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  item: {
    backgroundColor: COLORS.selectItemsBackground,
    marginVertical: 4,
    flexDirection: "row",
    minHeight: 70
  },
  itemCategory: {
    fontSize: 90,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    height: 107,
    right: 90,
    bottom: -13,
    color: COLORS.background,
    position: 'absolute'
  },
  itemDescription: {
    color: COLORS.text,
    paddingLeft: 15,
    paddingRight: 130,
    fontSize: 18,
    textAlignVertical: 'center'
  },
  itemImage: {
    height: '100%',
    width: 50,
    marginLeft: 10
  },
  settings: {
    alignItems: 'center',
    padding: 10,
    height: 250,
    width: 300
  },
  about: {
    alignItems: 'center',
    padding: 10,
    height: 350,
    width: 300
  },
  tickets: {
    backgroundColor: COLORS.background,
    alignItems: 'center',
    padding: 10,
    height: 420,
    width: 300
  }
});
