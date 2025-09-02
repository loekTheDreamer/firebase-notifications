/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging, {
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  onMessage,
} from '@react-native-firebase/messaging';

global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    '[iOS background handler] received remote message',
    remoteMessage,
  );

  try {
  } catch (error) {
    console.error('[iOS background handler] Error:', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
