import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/feed.styles'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React, { useRef, useState } from 'react'
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import CommentsModal from './CommentsModal'
import Text from './GlobalText'


export default function Post({ post }) {
    const lastTap = useRef < number | null > (null)
    const { user } = useUser()

    // if user is not logged in change the url to login page
    if (!user) {
        return (
            <Link href='/(auth)/login'>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.white }}>Please login to view posts</Text>
                </View>
            </Link>
        )
    }

    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [likesCount, setLikesCount] = useState(post.likes)
    const [isHeartVisible, setIsHeartVisible] = useState(false)
    //comments
    const [commentsCount, setCommentsCount] = useState(post.comments)
    const [showComment, setShowComment] = useState(false)
    //bookmark
    const [isBookmarked, setIdBookmarked] = useState(post.isBookmarked)

    const toggleLike = useMutation(api.post.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
    const deletePost = useMutation(api.post.deletePost)

    const handleLike = async () => {
        try {
            const newLike = await toggleLike({ postId: post._id })
            setIsLiked(prev => !prev)
            setLikesCount(prev => newLike ? prev + 1 : prev - 1)
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

    const handleBookmark = async () => {
        try {
            setIdBookmarked(prev => !prev)
            await toggleBookmark({ postId: post._id })
        } catch (error) {
            console.log('Error while toggling bookmark', error)
        }
    }

    const handleDelete = async () => {
        try{
            await deletePost({post: post._id})
        }catch (error){
            console.log('Error while deleting post', error)
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

                {post.author.clerkId === user.id ?
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name='trash' size={20} color={COLORS.white} />
                    </TouchableOpacity> :
                    <TouchableOpacity>
                        <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.white} />
                    </TouchableOpacity>
                }

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
                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        color={isBookmarked ? COLORS.secondary : COLORS.white}
                        size={22}
                    />
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
                {post.comments > 0 &&
                    <TouchableOpacity onPress={() => setShowComment(true)}>
                        <Text style={styles.commentsText}>view all {post.comments} comments</Text>
                    </TouchableOpacity>
                }
                <Text style={styles.timeAgo}>{formatDistanceToNow(post._creationTime, { addSuffix: true })}</Text>
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