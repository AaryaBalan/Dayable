import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/feed.styles'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from 'convex/react'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React, { useRef, useState } from 'react'
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import CommentsModal from './CommentsModal'
import Text from './GlobalText'
import {formatDistanceToNow} from 'date-fns'

export default function Post({ post }) {
    const lastTap = useRef(null)

    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [likesCount, setLikesCount] = useState(post.likes)
    const [isHeartVisible, setIsHeartVisible] = useState(false)
    //comments
    const [commentsCount, setCommentsCount] = useState(post.comments)
    const [showComment, setShowComment] = useState(false)

    const toggleLike = useMutation(api.post.toggleLike)

    const handleLike = async () => {
        try {
            setIsLiked(prev => !prev)
            const newLike = await toggleLike({ postId: post._id })
            setLikesCount(prev => (newLike ? prev + 1 : prev - 1))
        } catch (error) {
            console.log(error)
        }
    }

    const handleDoubleTap = () => {
        const now = Date.now()
        if (lastTap.current && now - lastTap.current < 300) {
            handleLike()
            if (!isLiked) {
                setIsHeartVisible(true)
                setTimeout(() => {
                    setIsHeartVisible(false)
                }, 1000)
            }
        } else {
            lastTap.current = now
        }
    }

    return (
        <View>
            {/* top bar */}
            <View style={styles.postTopBar}>
                <Link href={'/(tabs)/profile'}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}
                    >
                        <Image
                            source={post.author.image}
                            style={styles.postAuthorImage}
                            contentFit='cover'
                            transition={200}
                            cachePolicy='memory-disk'
                        />
                        <Text style={{ color: COLORS.white, fontSize: 14 }}>{post.author.username}</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity>
                    <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* image */}
            <TouchableWithoutFeedback onPress={handleDoubleTap}>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={post.image}
                        style={styles.postImage}
                        contentFit='cover'
                        transition={200}
                        cachePolicy='memory-disk'
                    />
                    {
                        isHeartVisible &&
                        <Ionicons name='heart' size={100} style={styles.heartIcon} color={COLORS.primary} />
                    }
                </View>
            </TouchableWithoutFeedback>

            {/* post action */}
            <View style={styles.postActionBar}>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', columnGap: 16 }}
                >
                    <TouchableOpacity
                        onPress={handleLike}
                    >
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            color={isLiked ? COLORS.primary : COLORS.white}
                            size={22}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComment(true)}>
                        <Ionicons name='chatbubble-outline' color={COLORS.white} size={22} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Ionicons name='bookmark-outline' size={22} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* post info */}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>
                    {likesCount > 0 ? `${likesCount} likes` : "Be the first to like"}
                </Text>
                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername} weight='700'>{post.author.username}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}
                <TouchableOpacity>
                    <Text style={styles.commentsText}>
                        {post.comments > 0 ? `view all ${post.comments} comments` : 'Start the conversation'} 
                    </Text>
                </TouchableOpacity>
                <Text style={styles.timeAgo}>{formatDistanceToNow(post._creationTime, {addSuffix: true})}</Text>
            </View>

            {/* comments section */}
            <CommentsModal
                postId={post._id}
                visible={showComment}
                onClose={() => setShowComment(false)}
                onCommentAdded={() => setCommentsCount(prev => prev + 1)}
            />

        </View>
    )
}