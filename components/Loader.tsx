import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/feed.styles'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import Text from './GlobalText'

type LoaderProps = {
    text: string;
};

export default function Loader({ text }: LoaderProps) {
    return (
        <View
            style={styles.emptyContainer}
        >
            <ActivityIndicator size={40} color={COLORS.primary}/>
            <Text style={{color: COLORS.grey}}>{text}</Text>
        </View>
    )
}