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
  Alert,
  Dimensions
} from 'react-native';

import IconSvg from '../../assets/svg/icon.svg';
import GearSvg from '../../assets/svg/gear.svg';

import CategoryASvg from '../../assets/svg/category_a.svg';
import CategoryBSvg from '../../assets/svg/category_b.svg';
import CategoryDSvg from '../../assets/svg/category_d.svg';
import CategoryE1Svg from '../../assets/svg/category_e1.svg';
import CategoryE2Svg from '../../assets/svg/category_e2.svg';
import CategoryFSvg from '../../assets/svg/category_f.svg';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const smallScreen = screenWidth <= 320;

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    category: 'A',
    description: 'колесные трактора \nмощностью до 80\u00A0кВт',
    image: <CategoryASvg width={smallScreen ? 39 : 49} height={smallScreen ? 26 : 36}></CategoryASvg>
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    category: 'B',
    description: 'колесные трактора \nмощностью свыше 80\u00A0кВт',
    image: <CategoryBSvg width={smallScreen ? 39 : 49} height={smallScreen ? 33 : 43}></CategoryBSvg>
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    category: 'D',
    description: 'самоходные машины \nсельского назначения',
    image: <CategoryDSvg width={smallScreen ? 40 : 50} height={smallScreen ? 28 : 38}></CategoryDSvg>
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d74',
    category: 'E1',
    description: 'дорожно-строительные \nмашины (асфальтоукладчики)',
    image: <CategoryE1Svg width={smallScreen ? 41 : 51} height={smallScreen ? 23 : 33}></CategoryE1Svg>
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d78',
    category: 'E2',
    description: 'дорожно-строительные машины \n(грейдеры, скреперы, катки)',
    image: <CategoryE2Svg width={smallScreen ? 40 : 50} height={smallScreen ? 31 : 41}></CategoryE2Svg>
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d75',
    category: 'F',
    description: 'экскаваторы с вместимостью \nковша до 1 м³ и спец. погрузчики',
    image: <CategoryFSvg width={smallScreen ? 40 : 50} height={smallScreen ? 31 : 41}></CategoryFSvg>
  },
];


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

  goToSettings() {
    this.props.navigation.navigate('Settings');
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

          <StatusBar hidden={true} />

          <View style={styles.header}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%' }}>
                <IconSvg></IconSvg>
                <Text style={{ color: '#FFFFFF', fontSize: smallScreen ? 18 : 24, marginLeft: 10 }}>{'TractorTest'}</Text>
              </View>
              <TouchableOpacity onPress={() => this.goToSettings()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                <GearSvg></GearSvg>
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: smallScreen ? 13 : 16, marginTop: smallScreen ? 13 : 15 }}>{'Тесты по правилам технической \n эксплуатации для получения профессии \n тракториста-машиниста \n категории A, B, D, E, F'}</Text>
          </View>

          <FlatList
            style={{ height: '80%', display: 'flex', marginTop: 15 }}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
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
      parent.props.navigation.navigate('TestNew', { category })
    }
  }

  return (
    <TouchableOpacity style={styles.item} onPress={() => startTest(category)}>
      <View style={{ marginTop: 15, marginLeft: 15 }}>{image}</View>
      <View style={{ zIndex: 3, width: screenWidth - 95, marginTop: 13 }}>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <View style={{ zIndex: 2, position: 'absolute', left: screenWidth - 90 }}>
        <Text style={{ marginTop: smallScreen ? -24 : -27, fontWeight: 'bold', fontFamily: 'monospace', fontSize: smallScreen ? 73 : 86, color: '#333333' }}>{category.substr(0, 1)}</Text>
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
    backgroundColor: '#101010',
    color: '#FFFFFF'
  },
  header: {
    backgroundColor: '#1F1F1F',
    height: '25%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: '#FFFFFF'
  },
  item: {
    backgroundColor: '#1F1F1F',
    marginVertical: 4,
    flexDirection: "row",
    borderRadius: 10,
    height: smallScreen ? 55 : 65,
    marginHorizontal: 50,
    width: screenWidth - 30
  },
  itemDescription: {
    color: '#FFFFFF',
    paddingLeft: 15,
    fontSize: smallScreen ? 13 : 15,
    textAlignVertical: 'center'
  }
});
