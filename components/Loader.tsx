import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/feed.styles'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Loader() {
    return (
        <View
            style={styles.emptyContainer}
        >
            <ActivityIndicator size={40} color={COLORS.primary}/>
        </View>
    )
}