import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  StatusBar,
  BackHandler,
  NativeEventSubscription,
} from 'react-native';
import Modal from 'react-native-modalbox';
import IconDarkSvg from '../assets/svg/icon_dark.svg';
import GearSvg from '../assets/svg/gear.svg';
import CategoryASvg from '../assets/svg/category_a.svg';
import CategoryBSvg from '../assets/svg/category_b.svg';
import CategoryDSvg from '../assets/svg/category_d.svg';
import CategoryE1Svg from '../assets/svg/category_e1.svg';
import CategoryE2Svg from '../assets/svg/category_e2.svg';
import CategoryFSvg from '../assets/svg/category_f.svg';

import GlobalStyles from '../styles/global';
import MenuItem from '../components/MenuItem';
import PromptModal from '../components/PromptModal';
import { useTheme } from '@react-navigation/native';

import Global from '../global.variables';

export default function (props: any) {
  const { colors, dark } = useTheme();
  return <HomeScreen {...props} darkTheme={dark} colors={colors}></HomeScreen>;
}

class HomeScreen extends React.Component {
  colors: any;
  styles: any;
  menuItems: Object[];
  backHandler: NativeEventSubscription | undefined;

  constructor(props: any) {
    super(props);
    this.styles = this.getStyles();
  }

  componentWillUnmount = () => {
    this.backHandler.remove();
  };

  handleBackPress = () => {
    return (Global.appSettings.requestAppExit ? this.refs.exitModal.open() : BackHandler.exitApp()) || true;
  };

  goToSettings = () => this.props.navigation.navigate('Settings');

  componentDidMount = () =>
    (this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress));

  render() {
    this.styles = this.getStyles();
    this.menuItems = [
      {
        category: 'A',
        description: 'колесные трактора \nмощностью до 80\u00A0кВт',
        image: (
          <CategoryASvg
            width={Global.smallScreen ? 39 : 49}
            height={Global.smallScreen ? 26 : 36}
            fill={this.props.colors.text}
          />
        ),
      },
      {
        category: 'B',
        description: 'колесные трактора \nмощностью свыше 80\u00A0кВт',
        image: (
          <CategoryBSvg
            width={Global.smallScreen ? 39 : 49}
            height={Global.smallScreen ? 33 : 43}
            fill={this.props.colors.text}
          />
        ),
      },
      {
        category: 'D',
        description: 'самоходные машины \nсельского назначения',
        image: (
          <CategoryDSvg
            width={Global.smallScreen ? 40 : 50}
            height={Global.smallScreen ? 28 : 38}
            fill={this.props.colors.text}
          />
        ),
      },
      {
        category: 'E1',
        description: 'дорожно-строительные \nмашины (асфальтоукладчики)',
        image: (
          <CategoryE1Svg
            width={Global.smallScreen ? 41 : 51}
            height={Global.smallScreen ? 23 : 33}
            fill={this.props.colors.text}
          />
        ),
      },
      {
        category: 'E2',
        description: 'дорожно-строительные машины \n(грейдеры, скреперы, катки)',
        image: (
          <CategoryE2Svg
            width={Global.smallScreen ? 40 : 50}
            height={Global.smallScreen ? 31 : 41}
            fill={this.props.colors.text}
          />
        ),
      },
      {
        category: 'F',
        description: 'экскаваторы с вместимостью \nковша до 1 м³ и спец. погрузчики',
        image: (
          <CategoryFSvg
            width={Global.smallScreen ? 40 : 50}
            height={Global.smallScreen ? 31 : 41}
            fill={this.props.colors.text}
          />
        ),
      },
    ];
    return (
      <SafeAreaView style={this.styles.container}>
        <StatusBar hidden={true} />

        <Modal style={GlobalStyles.modal} backButtonClose={true} position="center" ref="exitModal">
          <PromptModal
            success={() => {
              this.refs.exitModal.close();
              setTimeout(() => BackHandler.exitApp(), 300);
            }}
            cancel={() => this.refs.exitModal.close()}
            title="Выйти из приложения"
            successButton="Выйти"
            cancelButton="Отмена"
          />
        </Modal>

        <View style={this.styles.header}>
          <View style={GlobalStyles.flexRow}>
            <View style={this.styles.titleArea}>
              <IconDarkSvg />
              <Text style={this.styles.title}>TractorTest</Text>
            </View>
            <TouchableOpacity onPress={() => this.goToSettings()} style={this.styles.settingsButton}>
              <GearSvg fill={this.props.colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={this.styles.description}>
            {
              'Тесты по правилам технической \n эксплуатации для получения профессии \n тракториста-машиниста \n категории A, B, D, E, F'
            }
          </Text>
        </View>

        <FlatList
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          data={this.menuItems}
          renderItem={({ item }) => <MenuItem {...item} />}
          keyExtractor={(item) => item.category}
        />
      </SafeAreaView>
    );
  }

  getStyles = () => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: this.props.colors.background,
        color: this.props.colors.text,
      },
      header: {
        backgroundColor: this.props.colors.middleground,
        height: '25%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        color: this.props.colors.text,
        marginBottom: 15,
      },
      titleArea: {
        ...GlobalStyles.flexRow,
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
      },
      title: {
        color: this.props.colors.text,
        fontSize: Global.smallScreen ? 18 : 24,
        fontWeight: 'bold',
        marginLeft: 10,
      },
      settingsButton: {
        ...GlobalStyles.flexRow,
        alignItems: 'center',
        marginTop: 3,
      },
      description: {
        textAlign: 'center',
        color: this.props.colors.text,
        fontSize: Global.smallScreen ? 13 : 16,
        marginTop: Global.smallScreen ? 13 : 15,
      },
    });
  };
}
