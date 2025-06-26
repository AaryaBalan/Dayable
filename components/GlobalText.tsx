import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

type FontWeight = '400' | '500' | '600' | '700';

interface GlobalTextProps {
  style?: object;
  weight?: FontWeight;
  children: React.ReactNode;
  [key: string]: any;
}

const GlobalText = ({ style = {}, weight = '400', children, ...props }: GlobalTextProps) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  // Map weight to font family
  const fontMap = {
    '400': 'Poppins_400Regular',
    '500': 'Poppins_500Medium',
    '600': 'Poppins_600SemiBold',
    '700': 'Poppins_700Bold',
  };

  return (
    <Text
      {...props}
      style={[{ fontFamily: fontMap[weight] || 'Poppins_400Regular' }, style]}
    >
      {children}
    </Text>
  );
};


export default GlobalText;
