import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef  } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {  Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import GitHubLogin, { loadGitHubToken, deleteGitHubToken } from './views/GitHubLogin';
import Loading from './views/Loading';
import Main from './views/Main';
import Setting from './views/Setting';
import Alarm,{getTargetDate, sendPushNotification} from './views/Alarm';

import { getUserInfo, getUserEvents } from './util/GitHubAPI';


const Stack = createStackNavigator();
let ExpoTokenForBG = null;

// TaskManager.defineTask(YOUR_TASK_NAME, () => {
//   try {
//     const receivedNewData =  // do your background fetch here
//     return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
//   } catch (error) {
//     return BackgroundFetch.Result.Failed;
//   }
// });

let setStateFn = () => {
  console.log("State not yet initialized");
};

// refer https://docs.expo.io/versions/latest/sdk/background-fetch/
async function initBackgroundFetch(taskName,
                                   taskFn,
                                   interval = 1) {
  let status = await BackgroundFetch.getStatusAsync();
  switch(status) {
    case BackgroundFetch.Status.Restricted: console.log('Restricted'); break;
    case BackgroundFetch.Status.Denied:     console.log('Denied');     break;
    case BackgroundFetch.Status.Available:  console.log('Available');  break;
    default:                                console.log(status);       break;
  }

  console.log("init 시작되어따!");
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      console.log(`TaskManager.defineTask()`);
      TaskManager.defineTask(taskName, taskFn);
    }
    const options = {
      minimumInterval: interval // in seconds
      // startOnBoot // Whether to restart background fetch events when the device has finished booting. Defaults to false. (Android only)
    };
    
    console.log(`BackgroundFetch.registerTaskAsync()`);
    let result = await BackgroundFetch.registerTaskAsync(taskName, options);
    console.log(`registerTaskAsync = `, result);
  } catch (err) {
    console.log("registerTaskAsync() failed:", err);
  }
}

async function myTask() {
  try {
    // fetch data here...
    const backendData = "Simulated fetch " + Math.random();
    //await UpdateBG();
    console.log("myTask() ", backendData);
    sendPushNotification(ExpoTokenForBG, 1);
    
    setStateFn(backendData);
    return backendData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
}
// initBackgroundFetch('myTaskName', myTask, 10);
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldetBadge: false,
//   }),
// });

//registerTaskAsync() failed: [TypeError: BackgroundFetch.registerTaskAsync is not a function. (In 'BackgroundFetch.registerTaskAsync(taskName, options)', 'BackgroundFetch.registerTaskAsync' is undefined)]

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

  const [state, setState] = useState(null);
  setStateFn = setState;
  // state 
  const [isLoaded, setIsLoaded] = useState(false);
  const [intervalID, setIntervalID] = useState(null);
  const [gitHubToken, setGitHubToken] = useState(undefined); // 혹시 모르니 테스트해볼게
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [avatar, setAvatar] = useState(undefined);
  const [userID, setUserID] = useState(undefined);
  const [lastEventDate, setLastEventDate] = useState(undefined);
  const [EventDateList, setEventDateList] = useState(undefined);
  const [count, setCount] = useState(1);
  
  // state_push
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

	// only once when mounted
  useEffect(() => {
    console.log('useEffect push notification');
    registerForPushNotificationsAsync().then(pushToken => {
      ExpoTokenForBG = pushToken;
      setExpoPushToken(pushToken)
    });

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
    console.log(`loadApp()`);
    let token = await loadGitHubToken();
    resetGitHubToken(token); //props 변화할 때마다 useEffect는 실행될 것!
  };

  const resetGitHubToken = async (token) => {

    // set state
    setGitHubToken(token);
    // 5초 이후에 토큰 요청하기
    if (token != null) {
      loadUserInfo(token)
      .then(loadUserEvents)
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
    //console.log(userInfo);
    
    // set state
    setName(userInfo.name);
    setEmail(userInfo.email);
    setAvatar(userInfo.avatar_url);
    setUserID(userInfo.login);

    return [userInfo.login, userInfo.email];
  };
  
  const loadUserEvents = async ([loginID, email]) => {
		// 사용자 활동 정보 저장하기
		console.log(`loadUserEvents(${loginID}, ${email})`);
    let userActivity = await getUserEvents(gitHubToken, loginID);
    let myCommitList = [];
    
    const yyyymmdd = (() => //한 달 전 년월일
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
		})();

		console.log(yyyymmdd);
		console.log(`userActivity.length=${userActivity.length}`);

    for (let activity of userActivity) {

			//한 달 전까지 출력!
      if (activity.created_at < yyyymmdd) {
        continue;
      }

			// 다른 사람들의 커밋도 가져오는 문제를 해결하고자 내 커밋만 저장할 변수 생성
      let commitsPerDay = activity?.payload?.commits || [];
      for (let commit of commitsPerDay) {
				// 내 아이디만 걸리게끔
				// TODO: loginID만 비교하는 것은 약함. email, name 등과도 비교해야 함.
        if (commit.author.name == loginID || commit.author.email == email) {
          // myCommitList에 내 커밋 시간 추가
          myCommitList.push(activity.created_at);
        }
      }
		}

		const lastEventDate = myCommitList[0] || null;
    console.log(`myCommitList.length = ${myCommitList.length}`);
    setEventDateList(myCommitList);
		setLastEventDate(lastEventDate); // 가장 최근 커밋 날
		return lastEventDate;
  }
  
  UpdateBG = () => {
    console.log('UpdateBG()')
    if (gitHubToken === undefined) {
      loadApp();
    } else if (gitHubToken && userID && email && !intervalID) { // 토큰은 있고 intervalID는 없을 때
      console.log('setInterval');
      setIntervalID(setInterval(() => {
				loadUserEvents(userID, email)
				.then(lastEventDate => {
					if (getTargetDate(lastEventDate, count) <= Date.now()) { // 지금 시간이 더 크면 푸시하기

						console.log(getTargetDate(lastEventDate, count));
						console.log(Date.now());

						//푸시~
						// sendPushNotification(expoPushToken,count)
						console.log('push');
					}
				});
      }, 30000)); //30초에 한번씩 불러옴~

      // setInteval 취소 함수
      // clearInterval(intervalID);
    }

    console.log('end of UpdateBG()');
	}

  useEffect(() => UpdateBG(), [
		gitHubToken, lastEventDate
	]);
  
//TODO: 토큰 무효화
// 1. 토큰을 기기에서 지웠다.
 //2. 하지만 그 토큰을 다시 쓸 수는 있다.
 //3. 그래서 토큰을 무효화해야 한다.
 //4. 음 그러니까 GitHub에다가 요청해야 한다. 이 토큰 이용정지 해달라고. 약간 카드 발급 받고나서 카드만 잘라버린 꼴 
 //암튼 그래도 일단 뭔가 하기는 했다. 이제 토큰 무효화 요청하는 코드부터 짜야겠다
	return (
		isLoaded
		?
		<NavigationContainer>
			{
				gitHubToken
				?
				( // 토큰이 있을 경우
					EventDateList !== undefined && lastEventDate !== undefined
					?
					( // EventDateList 가 있을 경우
						<Stack.Navigator>
							<Stack.Screen name="Main" component={Main} options={{ headerShown: false }} eventDateList={EventDateList} lastEventDate={lastEventDate} />
							<Stack.Screen name="Setting">
								{props => <Setting {...props} setGitHubToken={setGitHubToken} gitHubToken={gitHubToken} name={name} email={email} avatar={avatar} />}
							</Stack.Screen>
							<Stack.Screen name="Alarm" options={{title:'알람 설정'}} >
								{props => <Alarm {...props} expoPushToken={expoPushToken} lastEventDate={lastEventDate}/>}
							</Stack.Screen>
						</Stack.Navigator>
					)
					:
					(
						<>
						</>
					)
				)
				:
				( // 토큰이 없을 경우
					<Stack.Navigator>
						<Stack.Screen name="GitHubLogin">
							{props => <GitHubLogin {...props} setGitHubToken={resetGitHubToken} />}
						</Stack.Screen>
					</Stack.Navigator>
				)
			}
		</NavigationContainer>
		:
		<Loading/>
	);
};