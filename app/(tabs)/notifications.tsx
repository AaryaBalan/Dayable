import Text from '@/components/GlobalText'
import Loader from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/notifications.styles'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Notification from '@/components/Notification'

export default function Notifications() {

    const notifications = useQuery(api.notifications.getNotifications)
    if (notifications === undefined) return <Loader text={'Notifications...'}/>
    if (notifications.length === 0) return <EmptyNotification />

    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back-outline' color={COLORS.secondary} size={20} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.secondary }}>Notifications</Text>
                <View style={{ width: 20 }} />
            </View>

            <FlatList
                data={notifications}
                renderItem={({ item }) => <Notification notification={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    )
}

// empty notification component
const EmptyNotification = () => (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>

        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name='arrow-back-outline' color={COLORS.secondary} size={20} />
            </TouchableOpacity>
            <Text style={{ color: COLORS.secondary }}>Notifications</Text>
            <View style={{ width: 20 }} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
            <Image
                source={require('../../assets/images/empty-notification.png')}
                style={styles.emptyImage}
                contentFit='contain'
                transition={200}
                cachePolicy='memory-disk'
            />
            <Text style={{ color: COLORS.grey }}>No notifications yet</Text>
        </View>
    </View>
)


