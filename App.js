import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GitHubLogin, { loadGitHubToken } from './views/GitHubLogin';
import Loading from './views/Loading';
import Main from './views/Main';
import Setting from './views/Setting';

const Stack = createStackNavigator();

export default () => {

  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const [gitHubToken, setGitHubToken] = useState(null);

  // load app
  const loadApp = () => {
    loadGitHubToken()
    .then(token => {
      setGitHubToken(token);
      setIsLoaded(true);
    });
  };
  loadApp();

  return (
    isLoaded ?
    <NavigationContainer>
      <Stack.Navigator>
        {gitHubToken ? (
          <>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Setting" component={Setting} />
          </>
        ) : (
          <>
            <Stack.Screen name="GitHubLogin" component={GitHubLogin} />
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
    :
    <Loading/>
  );
};