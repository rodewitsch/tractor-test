import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  Image
} from 'react-native';

export function About() {

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Image resizeMode='contain' style={{ height: 100, marginVertical: 5 }} source={require('../assets/images/icon.png')}/>
      <Text style={{ textAlign: 'center', fontSize: 15 }}>
        Тесты по правилам технической эксплуатации для получения профессии тракториста-машиниста категорий A,{'\u00A0'}B,{'\u00A0'}D,{'\u00A0'}E,{'\u00A0'}F
      </Text>
      <View style={{ marginTop: 15 }}>
        <Button title="Связаться с разработчиком " onPress={() => Linking.openURL('mailto:rodewitsch@inbox.ru')}></Button>
      </View>
      <View style={{ marginTop: 15 }}>
        <Button title="Оставить отзыв в Google play" onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.rdm.tracktortest')}></Button>
      </View>
      <Text style={{ textAlign: 'center', marginTop: 15, color: 'gray' }}>Версия приложения 1.2.3</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});
