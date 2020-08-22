import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Text, View } from 'react-native';

import styles from '../styles/style';

export default () => {
  return (
    <View style={styles.container}>
      <Text>This is the Setting</Text>
      <StatusBar style="auto" />
    </View>
  );
};
