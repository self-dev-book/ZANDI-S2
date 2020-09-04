import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GitHubLogin, { loadGitHubToken, deleteGitHubToken } from './views/GitHubLogin';
import Loading from './views/Loading';
import Main from './views/Main';
import Setting from './views/Setting';

import { getUserInfo, getUserActivity } from './util/GitHubAPI';

const Stack = createStackNavigator();

export default () => {

  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const [gitHubToken, setGitHubToken] = useState(undefined);

  // load app
  const loadApp = async () => {
    let token = await loadGitHubToken();

    setGitHubToken(token);
    if (token != null) {
      await Promise.all([
        loadUserInfo(token),
        loadUserActivity(token)
      ])
      .catch(async (error) => {
        console.log(`Error: ${error}`);

        // anyway, delete the token
        await deleteGitHubToken();
        setGitHubToken(null);
      });
    }
    setIsLoaded(true);
  };

  // 사용자 정보 저장하기
  const loadUserInfo = async (token) => {
    let userInfo = await getUserInfo(token);
  }

  // 사용자 활동 정보 저장하기
  const loadUserActivity = async (token) => {
    let userActivity = await getUserActivity(token);
  }

  useEffect(() => {
    if (gitHubToken === undefined) {
      loadApp();
    }
  });

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
            <Stack.Screen name="GitHubLogin">
              {props => <GitHubLogin {...props} setGitHubToken={setGitHubToken} />}
            </Stack.Screen>
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
    :
    <Loading/>
  );
};