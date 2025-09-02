import { getMessaging, getToken } from '@react-native-firebase/messaging';

import { Platform as RNPlatform } from 'react-native';

import { getInstallations, getId } from '@react-native-firebase/installations';
import { getApp } from '@react-native-firebase/app';

let initialized = false;
let cleanupFns: Array<() => void> = [];

export async function initNotifications(): Promise<string | null> {
  if (initialized) return null;
  initialized = true;
  console.log('initNotifications');

  // Only handle iOS. Disable notifications on Android entirely.

  // await requestNotificationPermissions();

  const app = getApp();

  const install = getInstallations(app);
  const id = await getId(install);

  const messaging = getMessaging(app);

  // Send current device token to backend once on init
  let currentToken: string | null = null;
  try {
    currentToken = await getToken(messaging);
    console.log('currentToken: ', currentToken);

    if (currentToken) {
      await upsertDeviceToken({
        FCMToken: currentToken,
        platform: RNPlatform.OS as BackendPlatform,
        deviceId: id,
      });
    }
  } catch (error) {
    console.log('initNotifications getToken/upsert error:', error);
    // best-effort; do not crash
  }

  // const unsubOnMessage = onMessage(messaging, async remoteMessage => {
  //   console.log('onMessage: ', remoteMessage);
  //   const title = remoteMessage.notification?.title ?? 'Notification';
  //   const body = remoteMessage.notification?.body;
  //   const data = Object.fromEntries(
  //     Object.entries(remoteMessage.data ?? {}).map(([k, v]) => [
  //       k,
  //       typeof v === 'string' ? v : JSON.stringify(v),
  //     ]),
  //   );
  //   console.log('const unsubOnMessage = onMessage for notifications');
  //   await displayLocalNotification(title, body, data);
  // });

  // const unsubTokenRefresh = onTokenRefresh(messaging, async newToken => {
  //   try {
  //     await upsertDeviceToken({
  //       FCMToken: newToken,
  //       platform: RNPlatform.OS as BackendPlatform,
  //       deviceId: id,
  //     });
  //   } catch (e) {
  //     // best-effort; do not crash
  //   }
  // });

  // Foreground Notifee listener is registered at app entry (index.js)
  // cleanupFns = [unsubOnMessage, unsubTokenRefresh];

  return currentToken;
}

export function teardownNotifications() {
  cleanupFns.forEach(fn => {
    try {
      fn();
    } catch {}
  });
  cleanupFns = [];
  initialized = false;
}
