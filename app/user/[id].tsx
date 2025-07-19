import Text from '@/components/GlobalText'
import Loader from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/profile.styles'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from 'convex/react'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks'
import React from 'react'
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'

export default function UserProfileScreen() {

    const { id } = useLocalSearchParams()
    const profile = useQuery(api.users.getUserProfile, { id })
    const post = useQuery(api.post.getPostsByUser, { userId: id })
    const isFollowing = useQuery(api.users.isFollowing, { followingId: id })
    const toggleFollow = useMutation(api.users.toggleFollow)
    const router = useRouter()

    const handleBack = () => {
        if (router.canGoBack) router.back()
        else router.push('/(tabs)')
    }

    if (profile === undefined || post === undefined || isFollowing == undefined) return <Loader text='Fetching the user details :)' />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{profile.username}</Text>
                <View style={{ width: 24 }}></View>
            </View>

            <ScrollView>
                <View style={styles.profileInfo}>
                    {/* avatar and stats */}
                    <View style={styles.avatarAndStats}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={profile.image}
                                style={styles.avatar}
                                contentFit='cover'
                                transition={200}
                            />
                        </View>

                        {/* stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name}>{profile.fullname}</Text>
                    {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                    <TouchableOpacity
                        style={[styles.followButton, isFollowing && styles.followingButton]}
                        onPress={() => toggleFollow({ followingId: id })}
                    >
                        <Text
                            style={[styles.followButtonText, isFollowing && styles.followButtonText]}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* post section */}
                <View style={styles.postsGrid}>
                    {post.length === 0 ? (
                        <View style={styles.noPostsContainer}>
                            <Ionicons name='image-outline' size={50} color={COLORS.grey} />
                            <Text style={styles.noPostsText}>No post yet</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={post}
                            numColumns={3}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <Link href={`/posts/${item._id}`} asChild>
                                    <TouchableOpacity style={styles.gridItem}>
                                        <Image
                                            source={item.image}
                                            style={styles.gridImage}
                                            contentFit='cover'
                                            transition={200}
                                        />
                                    </TouchableOpacity>
                                </Link>
                            )}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    )
}