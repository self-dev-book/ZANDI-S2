import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import styles from '../styles/style';

import keys from '../keys.json';

const StorageGitHubTokenName = 'GitHubToken';

export const loadGitHubToken = async () => {
  let token = null;

  // return the token (or null)
  try {
    token = await AsyncStorage.getItem(StorageGitHubTokenName);
  } catch (error) {
    console.log(error);
  }

  console.log(`loadGitHubToken(): ${token}`);
  return token;
};


const storeGitHubToken = async (token) => {
  console.log(`storeGitHubToken()`);

  // store the token
  try {
    await AsyncStorage.setItem(StorageGitHubTokenName, token);
  } catch (error) {
    console.log(error);
  }
};

export const deleteGitHubToken = async () => {
  console.log(`deleteGitHubToken()`);

  // delete the token
  try {
    await AsyncStorage.removeItem(StorageGitHubTokenName);

    // restart the app
    // Updates.reload();  
  }
   catch (error) {
    console.log(error);
  }
};

const requestGitHubToken = async (state, setGitHubState, setGitHubToken, setGitHubTokenRequested) => {
  console.log(`requestGitHubToken(${state})`);

  // request an access token
  try {
    let {
      data: {
        result,
        message
      }
    } = await axios.get(`${keys.GitHubLoginMiddlewareURL_Token}?state=${state}`);

    if (result == 1) {
      // success
      storeGitHubToken(message);
      setGitHubToken(message);
      return;
    } else {
      // fail
      console.log(message);
    }
  } catch (error) {
    console.log(error);
    setGitHubState(null);
  }

  setGitHubTokenRequested(false);
};

const getRandomState = async (setGitHubState) => {
  console.log(`getRandomState()`);
  let state = null;

  // request a random state
  try {
    let {
      data: {
        message
      }
    } = await axios.get(keys.GitHubLoginMiddlewareURL_State);

    // message is the state
    state = message;
  } catch (error) {
    console.log(error);
  }

  // set token
  setGitHubState(state);
};

export default (props) => {
  // state
  const [gitHubState, setGitHubState] = useState(undefined);
  const [gitHubTokenRequested, setGitHubTokenRequested] = useState(false);

  useEffect(() => {
    if (!gitHubState) {
      // state not exist
      getRandomState(setGitHubState);
    } else if (gitHubTokenRequested === false) {
      // able to request a token
      setGitHubTokenRequested(true);
      setTimeout(() => {
        requestGitHubToken(gitHubState, setGitHubState, props.setGitHubToken, setGitHubTokenRequested);
      }, 500);
    }
  });

  if (gitHubState) {
    // state exist
    return (
      <WebView
        source={{ uri: `${keys.GitHubLoginMiddlewareURL_Login}?state=${gitHubState}` }}
        style={{ marginTop: 20 }}
      />
    );
  } else if (gitHubState === null) {
    // state not exist
    return (
      <View style={styles.container}>
        <Text>Error occured while login to GitHub.</Text>
        <Button
          title="Retry"
          onPress={() => getRandomState(setGitHubState)}
        />
        <StatusBar style="auto" />
      </View>
    );
  } else {
    // state not loaded
    return (
      <View style={styles.container}>
        <Text>Please wait...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
};