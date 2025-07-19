import Text from '@/components/GlobalText'
import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/notifications.styles'
import { Ionicons } from '@expo/vector-icons'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

// notification item
export default Notification = ({ notification }) => (
    <View style={styles.notificationItem}>
        <View style={styles.notificationContent}>

            {/* sender avatar image */}
            <Link href={`/user/${notification.sender._id} `} asChild>
                <TouchableOpacity>
                    <Image
                        source={notification.sender.image}
                        style={styles.avatar}
                        contentFit='cover'
                        transition={200}
                    />
                    <View style={styles.iconBadge}>
                        {
                            notification.type === 'like' ? (
                                <Ionicons name='heart' size={14} color={COLORS.danger} />
                            ) : notification.type === 'comment' ? (
                                <Ionicons name='chatbubble' size={14} color={COLORS.blue} />
                            ) : <Ionicons name='person-add' size={14} color={COLORS.secondary} />
                        }
                    </View>
                </TouchableOpacity>
            </Link>

            {/* notification text */}
            <View style={styles.notificationInfo}>
                <Link href={`/user/${notification.sender._id}`} asChild>
                    <TouchableOpacity>
                        <Text style={styles.username}>{notification.sender.username}</Text>
                    </TouchableOpacity>
                </Link>
                <Text style={styles.action}>
                    {
                        notification.type === 'like' ? (
                            'liked your post'
                        ) : notification.type === 'comment' ? (
                            `commented: "${notification.comment}"`
                        ) : 'started following you'
                    }
                </Text>
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(notification._creationTime, { addSuffix: true })}
                </Text>
            </View>
        </View>

        {
            notification.post && (
                <Link href={`/posts/${notification.post._id}`} asChild>
                    <TouchableOpacity>
                        <Image
                            source={notification.post.image}
                            style={styles.postImage}
                            contentFit='cover'
                            transition={200}
                            cachePolicy='memory-disk'
                        />
                    </TouchableOpacity>
                </Link>
            )
        }
    </View>
)