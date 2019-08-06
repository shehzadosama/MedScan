import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Share } from 'react-native';

import Home from './src/views/Home';
import History from './src/views/History';
import Config from './src/views/Config';
import More from './src/views/More';
import Main from './src/views/Main';


import * as global from './src/global'
import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

const MainStack = createStackNavigator(
  {
    Home,
    Config,
    History,
    More,
    Main
  },
  {
    // initialRouteName: "Home",
    initialRouteName: "Main",
    defaultNavigationOptions: {
      header: null
    },
  }
);

type Props = {};
export default class App extends Component<Props> {
  state = {
    loaded: false,
  };

  render() {
    if (!this.state.loaded) return null;

    const AppContainer = createAppContainer(MainStack);

    return (
      <AppContainer />
    );
  }

  componentDidMount = () => {
    global.loadAppData().then(() => {
      this.setState({ loaded: true })
    }).catch(e => {
      this.setState({ loaded: true })
      console.log(e.message);
    });
  }
}
