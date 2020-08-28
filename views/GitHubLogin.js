import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Button, Text, View } from 'react-native';
import axios from 'axios';

import styles from '../styles/style';

import keys from '../keys.json';

export const loadGitHubToken = () => {
  console.log(`loadGitHubToken()`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // return the token
<<<<<<< HEAD
      resolve("abcde");
    }, 1000);
=======
      resolve(null);
    }, 2000);
  });
};

const requestGitHubToken = (state, setGitHubState, setGitHubToken, setGitHubTokenRequested) => {
  console.log(`requestGitHubToken(${state})`);
  axios.get(`${keys.GitHubLoginMiddlewareURL_Token}?state=${state}`)
  .then(response => {
    let result = response.data.result;
    let message = response.data.message;

    if (result == 1) {
      // success
      setGitHubToken(message);
    } else {
      // fail
      console.log(message);
    }
  })
  .catch(err => {
    console.log(err);
    setGitHubState(null);
  })
  .then(() => {
    setGitHubTokenRequested(false);
  })
};

const getRandomState = (setGitHubState) => {
  console.log(`getRandomState()`);
  axios.get(keys.GitHubLoginMiddlewareURL_State)
  .then(response => {
    let state = response.data.message;
    setGitHubState(state);
    console.log(state);
  })
  .catch(err => {
    setGitHubState(null);
    console.log(err);
>>>>>>> origin/master
  });
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
    return (
      <View style={styles.container}>
        <Text>Your access token is {gitHubToken}. Please wait.</Text>
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