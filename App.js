import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GitHubLogin, { loadGitHubToken } from './views/GitHubLogin';
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
  const loadApp = () => {
    loadGitHubToken()
    .then(token => {
      setGitHubToken(token);
      if (token != null) {
        loadUserInfo(token)
        loadUserActivity(token)
      }
      setIsLoaded(true);
    });
  }; 

  // 사용자 정보 저장하기
  const loadUserInfo = (token) => {    
      getUserInfo(token)
      .then(userInfo => {
        const userName = userInfo.name 
        // ...
      
      })
      .catch(error => {
        console.log(error)
      })
    
  }

  // 사용자 활동 정보 저장하기
  const loadUserActivity = (token) => {
      getUserActivity(token)
      .then(actInfo => {
        const userActivityList = actInfo // 몰게써 흑흐긓ㄱ  
        // ...
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (gitHubToken === undefined) {
      loadApp();
    }
  });

  // 

  return (
    isLoaded ? // 삼항연산자
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