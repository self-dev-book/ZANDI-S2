import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, Image, ImageBackground } from 'react-native'

import styles from '../styles/style';


let image = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  }
});



export default () => {
  return (
    <View style={[styles.row, styles.header]}>
      <Image source={require('../assets/splash.png')} 
      style= {image.backgroundImage}
      />
      {/* <ImageBackground source={{uri: imageURL}} style={styles.bgImage} /> */}
      <StatusBar style="auto" />
    </View>
  );
};