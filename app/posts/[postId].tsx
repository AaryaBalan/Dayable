import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import {
    useLocalSearchParams,
    useRouter
} from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'

import CommentsModal from '@/components/CommentsModal'
import Text from '@/components/GlobalText'
import Loader from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/feed.styles'
import { Link } from 'expo-router'

// ✅ Validate postId before calling useQuery
export default function PostScreen() {
    const { postId } = useLocalSearchParams()
    const router = useRouter()
    const { user } = useUser()

    // Only call useQuery if postId is a valid string
    const post = typeof postId === 'string'
        ? useQuery(api.post.getPostById, { postId })
        : undefined

    const toggleLike = useMutation(api.post.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
    const deletePost = useMutation(api.post.deletePost)

    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isHeartVisible, setIsHeartVisible] = useState(false)
    const [showComment, setShowComment] = useState(false)

    const lastTap = useRef < number | null > (null)

    useEffect(() => {
        if (!user) {
            router.replace('/(auth)/login')
        }
    }, [user])

    useEffect(() => {
        if (post) {
            setIsLiked(post.isLiked)
            setIsBookmarked(post.isBookmarked)
        }
    }, [post])

    if (!user || post === undefined || typeof postId !== 'string') {
        return <Loader text="Fetching the post..." />
    }

    // Your event handlers like handleLike, handleBookmark, handleDelete go here...
    const handleLike = async () => {
        try {
            await toggleLike({ postId: post.post._id })
            setIsLiked(prev => !prev)
        } catch (error) {
            console.log('Error while liking the post:', error)
        }
    }

    const handleDoubleTap = () => {
        const now = Date.now()
        if (lastTap.current && now - lastTap.current < 300) {
            if (!isLiked) {
                setIsHeartVisible(true)
                setTimeout(() => setIsHeartVisible(false), 1000)
            }
            handleLike()
        } else {
            lastTap.current = now
        }
    }

    const handleBookmark = async () => {
        try {
            setIsBookmarked(prev => !prev)
            await toggleBookmark({ postId: post.post._id })
        } catch (error) {
            console.log('Error while toggling bookmark', error)
        }
    }

    const handleDelete = async () => {
        try {
            await deletePost({ postId: post.post._id })
            router.back()
        } catch (error) {
            console.log('Error while deleting post', error)
        }
    }

    const handleBack = () => {
        if (router.canGoBack) router.back()
        else router.push('/(tabs)')
    }


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>
                <View style={{ width: 24 }}></View>
            </View>

            <View style={styles.postTopBar}>
                <Link
                    href={
                        user.id === post.author.clerkId
                            ? '/(tabs)/profile'
                            : `/user/${post.author._id}`
                    }
                    asChild
                >
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}
                    >
                        <Image
                            source={post.author.image}
                            style={styles.postAuthorImage}
                            contentFit="cover"
                            transition={200}
                            cachePolicy="memory-disk"
                        />
                        <Text style={{ color: COLORS.white, fontSize: 14 }}>
                            {post.author.username}
                        </Text>
                    </TouchableOpacity>
                </Link>

                {post.author.clerkId === user.id ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name="trash" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableWithoutFeedback onPress={handleDoubleTap}>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={post.post.image}
                        style={styles.postImage}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk"
                    />
                    {isHeartVisible && (
                        <Ionicons
                            name="heart"
                            size={100}
                            style={styles.heartIcon}
                            color={COLORS.primary}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.postActionBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 16 }}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            color={isLiked ? COLORS.primary : COLORS.white}
                            size={22}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComment(true)}>
                        <Ionicons name="chatbubble-outline" color={COLORS.white} size={22} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        color={isBookmarked ? COLORS.secondary : COLORS.white}
                        size={22}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.postInfo}>
                <Text style={styles.likesText}>
                    {post.post.likes > 0 ? `${post.post.likes} likes` : 'Be the first to like'}
                </Text>
                {post.post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername} weight="700">
                            {post.author.username}
                        </Text>
                        <Text style={styles.captionText}>{post.post.caption}</Text>
                    </View>
                )}
                {post.post.comments > 0 && (
                    <TouchableOpacity onPress={() => setShowComment(true)}>
                        <Text style={styles.commentsText}>
                            View all {post.post.comments} comments
                        </Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post.post._creationTime, { addSuffix: true })}
                </Text>
            </View>

            {post && (
                <CommentsModal
                    postId={post.post._id}
                    visible={showComment}
                    onClose={() => setShowComment(false)}
                />
            )}
        </View>
    )
}
