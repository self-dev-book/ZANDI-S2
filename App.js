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

import { getUserInfo, getUserEvents } from './util/GitHubAPI';


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
  const [lastEventDate, setLastEventDate] = useState(undefined);
  const [EventDateList, setEventDateList] = useState(undefined);
  
  // state_push
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  
  useEffect(() => { //useEffect 하나로 합치기
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
    console.log()
    let token = await loadGitHubToken();
    resetGitHubToken(token);
  };

  const resetGitHubToken = async (token) => {

    // set state
    setGitHubToken(token);

    if (token != null) {
      loadUserInfo(token)
      .catch(async (error) => {
        console.log(`Error: ${error}`);

        // anyway, delete the token
        //await deleteGitHubToken();
        //setGitHubToken(null);
      });
    }

    setIsLoaded(true);
  }

  // 사용자 정보 저장하기
  const loadUserInfo = async (token) => {
    let userInfo = await getUserInfo(token);
    console.log(userInfo);

    // set state
    setName(userInfo.name);
    setEmail(userInfo.email);
    setAvatar(userInfo.avatar_url);

    // 사용자 활동 정보 저장하기
    let userActivity = await getUserEvents(token, userInfo.login);      
    let myCommitList = new Array;
    
    const yyyymmdd = () => //한 달 전 년월일
    {
      let now = new Date();
      var yyyy = now.getFullYear();
      var mm = now.getMonth();//한달 전!(달은 0부터 시작)
      var dd = now.getDate().toString();
      // 1월에서 30일 전은 작년 12월
      if(mm==0){
          yyyy--;
          mm=12;
      }
      
      yyyy=yyyy.toString();
      mm=mm.toString();
  
      return yyyy + '-' +(mm[1] ? mm : '0'+mm[0]) + "-" + (dd[1] ? dd : '0'+dd[0]);  
    }
 
    console.log(yyyymmdd());

    for (let activity of userActivity) {
      //console.log(activity)  // 커밋 시간
      //console.log(activity.payload.commits);

      if(activity.created_at < yyyymmdd() ){//한 달 전까지 출력!
        break;
      }
     // a?.b optional chaining
      // 다른 사람들의 커밋도 가져오는 문제를 해결하고자 내 커밋만 저장할 변수 생성
      let commitsPerDay = activity?.payload?.commits || [];
      for(let commit of commitsPerDay){
        // 내 아이디만 걸리게끔
        if(commit.author.name == userInfo.login){
          // myCommitList에 내 커밋 시간 추가
          myCommitList.push(activity.created_at);
        }
      }
      // if(activity.type!="WatchEvent"){
      //   setLastCommitDay(activity.created_at)
      //   break; 
    }
    console.log(myCommitList);
    setEventDateList(myCommitList);
    setLastEventDate(myCommitList[0]);  // 가장 최근 커밋 날
    //console.log(typeof userActivity)
    //console.log(userActivity.length)
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
        {gitHubToken ? (    // 토큰이 있을 경우
          <>
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} eventDateList={EventDateList} />
            <Stack.Screen name="Setting">
            {props => <Setting {...props} setGitHubToken={setGitHubToken} gitHubToken={gitHubToken} name={name} email={email} avatar={avatar} />}
            </Stack.Screen>
            <Stack.Screen name="Alarm" options={{title:'알람 설정'}} >
						{props => <Alarm {...props} expoPushToken={expoPushToken} lastEventDate={lastEventDate}/>}

						</Stack.Screen>
              
          </>
        ) : (          // 토큰이 없을 경우
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