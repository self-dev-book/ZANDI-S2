import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles/style';

export const loadGitHubToken = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // return the token
      resolve("abcde");
    }, 1000);
  });
};

export default () => {
  return (
    <View style={styles.container}>
      <Text>GitHub</Text>
      <StatusBar style="auto" />
    </View>
  );
};