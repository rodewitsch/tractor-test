import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  StatusBar
} from 'react-native';

import Modal from 'react-native-modalbox';
import DATA from '../constants/MenuItems';
import Icon from 'react-native-vector-icons/Ionicons';
import { About } from '../components/About';
import { Settings } from '../components/Settings';

export default class HomeScreen extends React.Component {

  render() {
    return (
      <SafeAreaView style={styles.container} >
        <View
          style={{ width: '100%', height: '100%' }}>

          <Modal style={styles.modal} position={"center"} ref={"about"}>
            <About></About>
          </Modal>

          <Modal style={styles.modal} position={"center"} ref={"settings"}>
            <Settings></Settings>
          </Modal>


          <StatusBar hidden={true} />

          <Text style={styles.title}>
            Тесты по правилам технической эксплуатации для получения профессии тракториста-машиниста категорий A,{'\u00A0'}B,{'\u00A0'}D,{'\u00A0'}E,{'\u00A0'}F
          </Text>

          <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginRight: 15 }}>
            <TouchableOpacity onPress={() => this.refs.about.open()} style={{ height: 40, width: 40 }} >
              <Icon style={{ fontSize: 35, color: 'gray' }} name='md-information-circle-outline' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.refs.settings.open()} >
              <Icon style={{ fontSize: 35, color: 'gray', marginLeft: 10 }} name='md-settings' />
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ height: '80%' }}
            data={DATA}
            renderItem={({ item }) => <Item props={this.props} disabled={item.disabled} category={item.category} image={item.image} description={item.description} />}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    )
  };
}

function Item({ props, category, image, disabled, description }) {
  return (
    <TouchableOpacity disabled={disabled} onPress={() => props.navigation.navigate('Test', { category })}>
      <View style={{ ...styles.item, backgroundColor: disabled ? 'white' : 'white' }}>
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
    backgroundColor: '#e8e8e8'
  },
  title: {
    height: '18%',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  item: {
    backgroundColor: 'white',
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
    color: '#e8e8e8',
    position: 'absolute'
  },
  itemDescription: {
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
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 400,
    width: 300
  }
});
