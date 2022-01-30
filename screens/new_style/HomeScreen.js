import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  StatusBar,
  BackHandler
} from 'react-native';
import Modal from 'react-native-modalbox';
import IconLightSvg from '../../assets/svg/icon_light.svg';
import IconDarkSvg from '../../assets/svg/icon_dark.svg';
import GearSvg from '../../assets/svg/gear.svg';
import CategoryASvg from '../../assets/svg/category_a.svg';
import CategoryBSvg from '../../assets/svg/category_b.svg';
import CategoryDSvg from '../../assets/svg/category_d.svg';
import CategoryE1LightSvg from '../../assets/svg/category_e1_light.svg';
import CategoryE1DarkSvg from '../../assets/svg/category_e1_dark.svg';
import CategoryE2Svg from '../../assets/svg/category_e2.svg';
import CategoryFSvg from '../../assets/svg/category_f.svg';

import gs from '../../styles/global';
import MenuItem from '../../components/new/MenuItem';
import PromptModal from '../../components/new/PromptModal';
import ThemeColors from '../../constants/ThemeColors';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.colors = ThemeColors(global.appSettings.darkTheme);
    this.styles = this.getStyles();
    this.didBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.colors = ThemeColors(global.appSettings.darkTheme);
        this.setState({ selectedCategory: null });
      }
    );
    this.menuItems = [
      {
        category: 'A',
        description: 'колесные трактора \nмощностью до 80\u00A0кВт',
        image: <CategoryASvg width={global.smallScreen ? 39 : 49} height={global.smallScreen ? 26 : 36} fill={this.colors.text} />
      },
      {
        category: 'B',
        description: 'колесные трактора \nмощностью свыше 80\u00A0кВт',
        image: <CategoryBSvg width={global.smallScreen ? 39 : 49} height={global.smallScreen ? 33 : 43} fill={this.colors.text} />
      },
      {
        category: 'D',
        description: 'самоходные машины \nсельского назначения',
        image: <CategoryDSvg width={global.smallScreen ? 40 : 50} height={global.smallScreen ? 28 : 38} fill={this.colors.text} />
      },
      {
        category: 'E1',
        description: 'дорожно-строительные \nмашины (асфальтоукладчики)',
        image: global.appSettings.darkTheme
          ? <CategoryE1LightSvg width={global.smallScreen ? 41 : 51} height={global.smallScreen ? 23 : 33} />
          : <CategoryE1DarkSvg width={global.smallScreen ? 41 : 51} height={global.smallScreen ? 23 : 33} />
      },
      {
        category: 'E2',
        description: 'дорожно-строительные машины \n(грейдеры, скреперы, катки)',
        image: <CategoryE2Svg width={global.smallScreen ? 40 : 50} height={global.smallScreen ? 31 : 41} fill={this.colors.text} />
      },
      {
        category: 'F',
        description: 'экскаваторы с вместимостью \nковша до 1 м³ и спец. погрузчики',
        image: <CategoryFSvg width={global.smallScreen ? 40 : 50} height={global.smallScreen ? 31 : 41} fill={this.colors.text} />
      },
    ];
  }

  shouldComponentUpdate() {
    this.styles = this.getStyles();
    return true;
  }

  componentWillUnmount = () => {
    this.didBlurSubscription.remove();
    this.backHandler.remove();
  }

  handleBackPress = () => (global.appSettings.requestAppExit ? this.refs.exitModal.open() : BackHandler.exitApp()) || true;

  goToSettings = () => this.props.navigation.navigate('Settings');

  componentDidMount = () => this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  render() {
    return (
      <SafeAreaView style={this.styles.container} >
        <StatusBar hidden={true} />

        <Modal style={gs.modal} backButtonClose={true} position='center' ref='exitModal'>
          <PromptModal
            success={() => {
              this.refs.exitModal.close();
              setTimeout(() => BackHandler.exitApp(), 300);
            }}
            cancel={() => this.refs.exitModal.close()}
            title='Выйти из приложения'
            successButton='Выйти'
            cancelButton='Отмена' />
        </Modal>

        <View style={this.styles.header}>
          <View style={gs.flexRow}>
            <View style={this.styles.titleArea}>
              {global.appSettings.darkTheme ? <IconLightSvg /> : <IconDarkSvg />}
              <Text style={this.styles.title}>TractorTest</Text>
            </View>
            <TouchableOpacity onPress={() => this.goToSettings()} style={this.styles.settingsButton}>
              <GearSvg fill={this.colors.text}/>
            </TouchableOpacity>
          </View>
          <Text style={this.styles.description}>{'Тесты по правилам технической \n эксплуатации для получения профессии \n тракториста-машиниста \n категории A, B, D, E, F'}</Text>
        </View>

        <FlatList
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          data={this.menuItems}
          renderItem={({ item }) => <MenuItem ticketsModal={this.refs.ticketsModal} {...item} />}
          keyExtractor={item => item.category}
        />
      </SafeAreaView >
    )
  };

  getStyles = () => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: this.colors.background,
      color: this.colors.text
    },
    header: {
      backgroundColor: this.colors.middleground,
      height: '25%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      color: this.colors.text,
      marginBottom: 15
    },
    titleArea: {
      ...gs.flexRow,
      paddingLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%'
    },
    title: {
      color: this.colors.text,
      fontSize: global.smallScreen ? 18 : 24,
      fontWeight: 'bold',
      marginLeft: 10
    },
    settingsButton: {
      ...gs.flexRow,
      alignItems: 'center',
      marginTop: 3
    },
    description: {
      textAlign: 'center',
      color: this.colors.text,
      fontSize: global.smallScreen ? 13 : 16,
      marginTop: global.smallScreen ? 13 : 15
    }
  })
}

HomeScreen.navigationOptions = { header: null };