import { styles } from '@/styles/comments.style'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Text from './GlobalText'
import { useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'


export default function Comment({ comment }) {
    const { user } = useUser()
    return (
        <View style={styles.commentContainer}>
            <Link href={comment.user.clerkId === user?.id ? '/(tabs)/profile' : `/user/${comment.userId}`} asChild>
                <TouchableOpacity>
                    <Image
                        source={comment.user.image}
                        style={styles.commentAvatar}
                    />
                </TouchableOpacity>
            </Link>
            <View>
                <Text style={styles.commentUsername}>{user?.id === comment.user.clerkId ? 'You' : comment.user.username}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                    {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
                </Text>
            </View>
        </View>
    )
}