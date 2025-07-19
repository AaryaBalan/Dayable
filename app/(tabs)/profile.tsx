import Text from '@/components/GlobalText'
import Loader from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/profile.styles'
import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from 'convex/react'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

export default function Profile() {
    const { signOut, userId } = useAuth()
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip")

    const signoutUser = () => {
        signOut()
        router.replace('/(auth)/login')
    }

    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [editDetails, setEditDetails] = useState({
        fullname: currentUser?.fullname || '',
        bio: currentUser?.bio || '',
    })

    //post by user
    const posts = useQuery(api.post.getPostsByUser, {})
    // to update user profile
    const updateProfile = useMutation(api.users.updateUserProfile)
    // to handle edit submit function
    const handleSaveProfile = async () => {
        await updateProfile(editDetails)
        setIsEditModalVisible(false)
    }

    if (currentUser === undefined || posts === undefined || updateProfile === undefined) return <Loader text='Loading your Profile :)' />

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <Text style={{ color: COLORS.white }}>{currentUser?.username}</Text>
                <TouchableOpacity onPress={signoutUser}>
                    <Ionicons name="log-out-outline" color={COLORS.white} size={25} />
                </TouchableOpacity>
            </View>

            {/* profile picture and stats */}
            <ScrollView>
                <View style={styles.profileInfo}>
                    {/* avatar and stats */}
                    <View style={styles.avatarAndStats}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={currentUser.image}
                                style={styles.avatar}
                                contentFit='cover'
                                transition={200}
                            />
                        </View>

                        {/* stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name}>{currentUser.fullname}</Text>
                    {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

                    {/* action bar */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name='share-outline' size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {posts.length === 0 && <NoPost />}

                {/* display post */}
                <FlatList
                    data={posts}
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
            </ScrollView>

            {/* edit profile modal */}
            <Modal
                visible={isEditModalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? "padding" : 'height'}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                    <Ionicons name='close' size={24} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editDetails.fullname || currentUser.fullname}
                                    onChangeText={(text) => setEditDetails((prev) => ({ ...prev, fullname: text }))}
                                    placeholderTextColor={COLORS.grey}
                                    placeholder='Jhon Doe'
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Bio</Text>
                                <TextInput
                                    style={[styles.input, styles.bioInput]}
                                    value={editDetails.bio || currentUser.bio}
                                    onChangeText={(text) => setEditDetails((prev) => ({ ...prev, bio: text }))}
                                    multiline
                                    numberOfLines={4}
                                    placeholderTextColor={COLORS.grey}
                                    placeholder="Jhon Doe's bio"
                                />
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

function NoPost() {
    return (
        <View
            style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background
            }}
        >
            <Ionicons name='image-outline' size={50} color={COLORS.grey} />
            <Text style={{ fontSize: 15, color: COLORS.grey }}>No post yet</Text>
        </View>
    )
}