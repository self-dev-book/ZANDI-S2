import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Text, View } from 'react-native';

import styles from '../styles/style';

export default ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>This is the Main</Text>
      <Button
        title="Go to Setting"
        onPress={() => navigation.navigate('Setting')}
      />
      <StatusBar style="auto" />
    </View>
  );
};
