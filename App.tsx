/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useEffect } from 'react';
import { getApp } from '@react-native-firebase/app';

import messaging, {
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  onMessage,
} from '@react-native-firebase/messaging';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    const init = async () => {
      const app = getApp();
      const msg = getMessaging(app);

      const isRegistered = await isDeviceRegisteredForRemoteMessages(msg);
      console.log('isRegistered: ', isRegistered);
      try {
        // const register = await registerDeviceForRemoteMessages(msg);
        // console.log('register: ', register);
      } catch (error) {
        console.log('registerDeviceForRemoteMessages error: ', error);
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);

        console.log('app:');

        try {
          const currentToken = await getToken(msg);
          console.log('currentToken: ', currentToken);
          onMessage(msg, async remoteMessage => {
            console.log('onMessage: ', remoteMessage);
          });
        } catch (error) {
          console.log('getToken error: ', error);
        }
      }
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: safeAreaInsets.top,
            paddingBottom: safeAreaInsets.bottom,
          },
        ]}
      >
        <Text>hello firebase notifications</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
  },
});

export default App;
