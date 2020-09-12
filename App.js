import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef  } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {  Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GitHubLogin, { loadGitHubToken, deleteGitHubToken } from './views/GitHubLogin';
import Loading from './views/Loading';
import Main from './views/Main';
import Setting from './views/Setting';
import Alarm from './views/Alarm';


import { getUserInfo, getUserActivity } from './util/GitHubAPI';


const Stack = createStackNavigator();


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let pushToken;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(pushToken);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return pushToken;
}




export default () => {

  // state 
  const [isLoaded, setIsLoaded] = useState(false);
  const [gitHubToken, setGitHubToken] = useState(undefined); // 혹시 모르니 테스트해볼게
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [avatar, setAvatar] = useState(undefined);

  // state_push
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  
  useEffect(() => {
    registerForPushNotificationsAsync().then(pushToken => setExpoPushToken(pushToken));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);


  // load app
  const loadApp = async () => {
    let token = await loadGitHubToken();
    resetGitHubToken(token);
  };

  const resetGitHubToken = async (token) => {
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
  }

  // 사용자 정보 저장하기
  const loadUserInfo = async (token) => {
    let userInfo = await getUserInfo(token);
    setName(userInfo.name);
    setEmail(userInfo.email);
    setAvatar(userInfo.avatar_url);
  }

  // 사용자 활동 정보 저장하기
  const loadUserActivity = async (token) => {
    let userActivity = await getUserActivity(token);
    for (let activity of userActivity) {
      console.log(activity.created_at)
    }
    console.log(typeof userActivity)
    console.log(userActivity.length)
  }

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
    isLoaded ?
    <NavigationContainer>
      <Stack.Navigator>
        {gitHubToken ? (
          <>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Setting">
            {props => <Setting {...props} setGitHubToken={setGitHubToken} gitHubToken={gitHubToken} name={name} email={email} avatar={avatar} />}
            </Stack.Screen>
            <Stack.Screen name="Alarm" options={{title:'알람 설정'}} >
						{props => <Alarm {...props} expoPushToken={expoPushToken} dayAfterCommit={1}/>}

						</Stack.Screen>
              
          </>
        ) : (
          <>
            <Stack.Screen name="GitHubLogin">
              {props => <GitHubLogin {...props} setGitHubToken={resetGitHubToken} />}
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