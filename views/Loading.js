import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, Image, ImageBackground } from 'react-native'

// import styles from '../styles/style';


let styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover', // or 'stretch'
  },
  text: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 32
}
});



export default () => {
  return (
    // <View style={[styles.row, styles.header]}>
      <Image source={require('../assets/splash.png')} 
        style= {styles.backgroundImage}
      />
      /*{ <ImageBackground source={{uri: imageURL}} style={styles.bgImage} /> }*/
      // <StatusBar style="auto" />
    // </View>
   );
};