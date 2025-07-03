import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  StatusBar,
  BackHandler,
  Modal,
} from 'react-native';
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
import { NavigationProp, ParamListBase, Theme, useTheme } from '@react-navigation/native';

import Global from '../global.variables';
import { ThemeColorType } from '../constants/Colors';
import { useEffect } from 'react';

const getStyles = (colors: ThemeColorType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      color: colors.text,
    },
    header: {
      backgroundColor: colors.middleground,
      height: '25%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      color: colors.text,
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
      color: colors.text,
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
      color: colors.text,
      fontSize: Global.smallScreen ? 13 : 16,
      marginTop: Global.smallScreen ? 13 : 15,
    },
  });
};

const getMenuItems = (colors: ThemeColorType) => {
  return [
    {
      category: 'A',
      description: 'колесные трактора \nмощностью до 80\u00A0кВт',
      image: (
        <CategoryASvg width={Global.smallScreen ? 39 : 49} height={Global.smallScreen ? 26 : 36} fill={colors.text} />
      ),
    },
    {
      category: 'B',
      description: 'колесные трактора \nмощностью свыше 80\u00A0кВт',
      image: (
        <CategoryBSvg width={Global.smallScreen ? 39 : 49} height={Global.smallScreen ? 33 : 43} fill={colors.text} />
      ),
    },
    {
      category: 'D',
      description: 'самоходные машины \nсельского назначения',
      image: (
        <CategoryDSvg width={Global.smallScreen ? 40 : 50} height={Global.smallScreen ? 28 : 38} fill={colors.text} />
      ),
    },
    {
      category: 'E1',
      description: 'дорожно-строительные \nмашины (асфальтоукладчики)',
      image: (
        <CategoryE1Svg width={Global.smallScreen ? 41 : 51} height={Global.smallScreen ? 23 : 33} fill={colors.text} />
      ),
    },
    {
      category: 'E2',
      description: 'дорожно-строительные машины \n(грейдеры, скреперы, катки)',
      image: (
        <CategoryE2Svg width={Global.smallScreen ? 40 : 50} height={Global.smallScreen ? 31 : 41} fill={colors.text} />
      ),
    },
    {
      category: 'F',
      description: 'экскаваторы с вместимостью \nковша до 1 м³ и спец. погрузчики',
      image: (
        <CategoryFSvg width={Global.smallScreen ? 40 : 50} height={Global.smallScreen ? 31 : 41} fill={colors.text} />
      ),
    },
  ];
};

interface ComponentProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function (props: ComponentProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const styles = getStyles(colors);
  const menuItems = getMenuItems(colors);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (Global.appSettings.requestAppExit) {
        setModalVisible(true);
      } else {
        BackHandler.exitApp();
      }
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      <Modal visible={modalVisible} style={GlobalStyles.modal} backButtonClose={true} position="center">
        <PromptModal
          success={() => {
            setModalVisible(false);
            setTimeout(() => BackHandler.exitApp(), 300);
          }}
          cancel={() => {
            setModalVisible(false);
          }}
          title="Выйти из приложения"
          successButton="Выйти"
          cancelButton="Отмена"
        />
      </Modal>

      <View style={styles.header}>
        <View style={GlobalStyles.flexRow}>
          <View style={styles.titleArea}>
            <IconDarkSvg />
            <Text style={styles.title}>TractorTest</Text>
          </View>
          <TouchableOpacity onPress={() => props.navigation.navigate('Settings')} style={styles.settingsButton}>
            <GearSvg fill={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>
          {
            'Тесты по правилам технической \n эксплуатации для получения профессии \n тракториста-машиниста \n категории A, B, D, E, F'
          }
        </Text>
      </View>

      <FlatList
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        data={menuItems}
        renderItem={({ item }) => <MenuItem {...item} />}
        keyExtractor={(item) => item.category}
      />
    </SafeAreaView>
  );
}
