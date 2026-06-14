import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'OtakuBox',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export default function App() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0a0f" />
      <AppNavigator />
    </>
  );
}
