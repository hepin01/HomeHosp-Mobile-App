/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App, {Store} from './App';
import {name as appName} from './app.json';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {UPDATE_DEVICE_TOKEN} from './App/redux/UserReducer';
import {getWebViewUrl} from './App/utiles/common';
import { navigate } from './App/utiles/NavigationService';




AppRegistry.registerComponent(appName, () => App);
