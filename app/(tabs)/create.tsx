import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/create.styles'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from 'convex/react'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import * as ImagePicker from "expo-image-picker"
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Create() {

    const router = useRouter()
    const { user } = useUser()

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')
    const [isSharing, setIsSharing] = useState(false)

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8
        })

        if (!result.canceled) setImage(result.assets[0].uri)
    }

    // functions from the database
    const generateUploadUrl = useMutation(api.create.generateUploadUrl)
    const createPost = useMutation(api.create.createPost)

    const handleShare = async () => {
        // edge case
        if (!image) return

        try {
            setIsSharing(true)
            //get the upload url
            const uploadUrl = await generateUploadUrl()
            // FileSystem is used to store the image with storageId
            const uploadResult = await FileSystem.uploadAsync(uploadUrl, image, {
                httpMethod: "POST",
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                mimeType: 'image/jpeg'
            })

            if (uploadResult.status !== 200) throw new Error('Upload failed')

            const { storageId } = JSON.parse(uploadResult.body)
            await createPost({ storageId, caption })

            router.push('/(tabs)')
        } catch (error) {
            console.log(error)
        } finally {
            setIsSharing(false)
        }
    }

    if (!image) {
        return (
            <View style={{ backgroundColor: COLORS.surface, flex: 1 }}>
                {/* top bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='arrow-back-outline' color={COLORS.white} size={20} />
                    </TouchableOpacity>
                    <Text style={styles.topBarContent}>Create</Text>
                    <View style={{ width: 20 }}></View>
                </View>
                <TouchableOpacity style={styles.createImageContainer} onPress={pickImage}>
                    <Image style={styles.createImage} source={require('../../assets/images/create-1.png')} resizeMode='contain' />
                    <Text style={{ fontSize: 15, marginTop: -100, color: COLORS.white }}>Tap to select an image</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            style={styles.container}
        >
            {/* header */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={() => {
                        setImage('')
                        setCaption('')
                    }}
                    disabled={isSharing}
                >
                    <Ionicons name='close-outline' color={isSharing ? COLORS.grey : COLORS.white} size={25} style={{ width: 50 }} />
                </TouchableOpacity>
                <Text style={styles.topBarContent}>New Post</Text>
                <TouchableOpacity
                    disabled={isSharing || !image}
                    onPress={handleShare}
                >
                    {
                        isSharing ?
                            <ActivityIndicator size={25} color={COLORS.secondary} /> :
                            <Text style={styles.shareButton}>Share</Text>
                    }
                </TouchableOpacity>
            </View>

            <ScrollView
                bounces={false}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={styles.scrollContent}
                contentOffset={{ x: 0, y: 100 }}
            >
                <View style={[styles.uploadedContent, isSharing && styles.uploadContentDisabled]}>
                    <View style={styles.imageSection}>
                        <Image
                            source={image}
                            style={styles.previewImage}
                            contentFit='cover'
                            transition={500}
                        />
                        <TouchableOpacity
                            style={styles.changeImageButton}
                            onPress={pickImage}
                            disabled={isSharing}
                        >
                            <Ionicons name='image-outline' size={25} color={COLORS.white} />
                            <Text style={{ color: COLORS.white }}>Change</Text>
                        </TouchableOpacity>
                    </View>
                    {/* image section */}

                    {/* text area */}
                    <View style={styles.textContainer}>
                        <Image
                            source={user?.imageUrl}
                            style={styles.userAvatar}
                            contentFit='cover'
                            transition={300}
                        />
                        <TextInput
                            placeholder='Write a catption...'
                            style={styles.textarea}
                            placeholderTextColor={COLORS.grey}
                            multiline
                            onChangeText={setCaption}
                            editable={!isSharing}
                            value={caption}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}