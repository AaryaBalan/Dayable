import InitialLayout from '@/components/InitialLayout';
import { COLORS } from '@/constants/theme';
import ClerkAndConvexProvider from '@/providers/ClerkAndConvexProvider';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar"
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {

  // update the navigation bar theme in android
  useEffect(()=>{
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#000000")
      NavigationBar.setButtonStyleAsync('light')
    }
  },[])

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  )
}
