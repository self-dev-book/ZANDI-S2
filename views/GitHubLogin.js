import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import styles from '../styles/style';
import { getUserInfo } from '../util/GitHubAPI';

import keys from '../keys.json';

const StorageGitHubTokenName = 'GitHubToken';

export const loadGitHubToken = async () => {
  console.log(`loadGitHubToken()`);
  try {
    // return the token (or null)
    let token = await AsyncStorage.getItem(StorageGitHubTokenName);
    console.log(`${token} loaded`);

    // for test
    if (token) getUserInfo(token);

    return token;
  } catch (error) {
    // fail to load a token
    console.log(error);
    return null;
  }
};

const storeGitHubToken = async (token) => {
  console.log(`storeGitHubToken()`);
  try {
    // store the token
    await AsyncStorage.setItem(StorageGitHubTokenName, token);
  } catch (error) {
    // fail to store the token
    console.log(error);
  }
};

export const deleteGitHubToken = async () => {
  console.log(`deleteGitHubToken()`);
  try {
    // delete token
    await AsyncStorage.removeItem(StorageGitHubTokenName);
  } catch (error) {
    // fail to delete a token
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

  // request a random state
  try {
    let {
      data: {
        message
      }
    } = await axios.get(keys.GitHubLoginMiddlewareURL_State);

    // message is the state
    setGitHubState(message);
    console.log(message);
  } catch (error) {
    setGitHubState(null);
    console.log(error);
  }
};

export default (props) => {
  // state
  const [gitHubState, setGitHubState] = useState(undefined);
  const [gitHubToken, setGitHubToken] = useState(null);
  const [gitHubTokenRequested, setGitHubTokenRequested] = useState(false);

  useEffect(() => {
    if (!gitHubState) {
      getRandomState(setGitHubState);
    } else if (!gitHubToken) {
      if (gitHubTokenRequested === false) {
        setGitHubTokenRequested(true);
        setTimeout(() => {
          requestGitHubToken(gitHubState, setGitHubState, setGitHubToken, setGitHubTokenRequested);
        }, 500);
      }
    } else {
      props.setGitHubToken(gitHubToken);
    }
  });

  if (gitHubToken) {
    // token exist
    return (
      <View style={styles.container}>
        <Text>Access token acquired. Please wait.</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else if (gitHubState) {
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
        <Text>Please wait.</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
};