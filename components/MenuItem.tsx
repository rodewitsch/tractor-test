import { NavigationProp, ParamListBase, Theme, useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Global from '../global.variables';
import { ThemeColorType } from '../constants/Colors';

const getStyles = (colors: ThemeColorType) =>
  StyleSheet.create({
    item: {
      backgroundColor: colors.middleground,
      marginVertical: 4,
      flexDirection: 'row',
      borderRadius: 10,
      height: Global.smallScreen ? 55 : 65,
      marginHorizontal: 50,
      width: Global.screenWidth - 30,
    },
    itemDescription: {
      color: colors.text,
      paddingLeft: 15,
      fontSize: Global.smallScreen ? 13 : 15,
      textAlignVertical: 'center',
    },
    categoryLetter: {
      marginTop: Global.smallScreen ? -24 : -27,
      fontWeight: 'bold',
      fontFamily: 'monospace',
      fontSize: Global.smallScreen ? 73 : 86,
      color: colors.category,
    },
  });
interface ComponentProps {
  image: React.ReactNode;
  category: string;
  description: string;
}

export default function (props: ComponentProps) {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const startTest = (category: string) => {
    if (Global.appSettings.requestTicketNumber) {
      navigation.navigate('Tickets', { category });
    } else {
      navigation.navigate('TestNew', { category });
    }
  };

  const { image, category, description } = props;
  const { colors } = useTheme() as Theme & { colors: ThemeColorType };
  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={styles.item} onPress={() => startTest(category)}>
      <View style={{ marginTop: 15, marginLeft: 15 }}>{image}</View>
      <View style={{ zIndex: 3, width: Global.screenWidth - 95, marginTop: 13 }}>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <View style={{ zIndex: 2, position: 'absolute', left: Global.screenWidth - 90 }}>
        <Text style={styles.categoryLetter}>{category.substring(0, 1)}</Text>
      </View>
    </TouchableOpacity>
  );
}
