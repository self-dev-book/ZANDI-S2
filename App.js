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
import Alarm from './views/Alarm';

const Stack = createStackNavigator();

export default () => {

  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const [gitHubToken, setGitHubToken] = useState(undefined); // 혹시 모르니 테스트해볼게

  // load app
  const loadApp = () => {
    loadGitHubToken()
    .then(token => {
      setGitHubToken(token);
      setIsLoaded(true);
    });
  };

  useEffect(() => {
    if (gitHubToken === undefined) {
      loadApp();
    }
  });

//TODO: 토큰 무효화
// 1. 토큰을 기기에서 지웠다.
 //2. 하지만 그 토큰을 다시 쓸 수는 있다.
 //3. 그래서 토큰을 무효화해야 한다.
 //4. 음 그러니까 GitHub에다가 요청해야 한다. 이 토큰 이용정지 해달라고. 약간 카드 발급 받고나서 카드만 잘라버린 꼴 
 //암튼 그래도 일단 뭔가 하기는 했다. 이제 토큰 무효화 요청하는 코드부터 짜야겠다
  return (
    isLoaded ? // 삼항연산자
    <NavigationContainer>
      <Stack.Navigator>
        {gitHubToken ? (
          <>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Setting">
              {props => <Setting {...props} gitHubToken={gitHubToken} name="test" email="test@test.test" avatar="https://avatars3.githubusercontent.com/u/43772472?s=60&v=4"/>}
            </Stack.Screen>
            <Stack.Screen 
              name="Alarm" 
              component={Alarm}
              options={{title:'알람 설정'}} />
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