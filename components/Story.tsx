import Text from '@/components/GlobalText'
import { styles } from '@/styles/feed.styles'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

interface StoryProps {
    story: {
        avatar: string;
        username: string;
        hasStory: boolean;
    };
}

export default function Story({ story }: StoryProps) {
    return (
        <TouchableOpacity style={styles.storyContainer}>
            <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
                <Image
                    source={{ uri: story.avatar }}
                    style={styles.storyAvatar}
                />
                <Text
                    style={styles.storyUsername}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >{story.username}</Text>
            </View>
        </TouchableOpacity>
    )
}