/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';
import reducers from './App/redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import Root from './App/navigation/DrawerNavigator';
import FlashMessage from 'react-native-flash-message';
// import FlashMessage from "react-native-flash-message";
import {
  Alert,
  Linking,
  LogBox,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {
  UPDATE_DEVICE_TOKEN,
  UPDATE_NOTIFICATION_POPUP,
} from './App/redux/UserReducer';
import {getWebViewUrl} from './App/utiles/common';
import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {webview} from './App/networking/Constats';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'Could not find image',
  'Non-serializable values were found in the navigation state',
]);
LogBox.ignoreLogs(['remote notifications are not supported in the simulator']);
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead. ',
]);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['bookedAppointment', 'twilio'],
};
const logger = createLogger({
  // ...options
});
const persistedReducer = persistReducer(persistConfig, reducers);
export const Store = createStore(
  persistedReducer /* ,applyMiddleware(logger) */,
);
const persistor = persistStore(Store);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigationRef = createNavigationContainerRef();
  }

  render() {
    return (
      <Provider store={Store}>
        <PersistGate
          loading={null}
          children={bootstrapped => {
            return <Root />;
          }}
          persistor={persistor}
        />
        <FlashMessage
          position="top"
          floating={true}
          icon="auto"
          duration={2000}
          hideStatusBar={false}
          titleStyle={{marginRight: 20}}
        />
      </Provider>
    );
  }
}

export default App;
