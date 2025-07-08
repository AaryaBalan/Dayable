import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { styles } from '@/styles/comments.style'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from 'convex/react'
import React, { useState } from 'react'
import { FlatList, KeyboardAvoidingView, Modal, Platform, TextInput, TouchableOpacity, View } from 'react-native'
import Comment from './Comment'
import Text from './GlobalText'
import Loader from './Loader'

type CommentsModalProps = {
    visible: boolean;
    onClose: () => void;
    onCommentAdded: () => void;
    postId: string;
};

export default function CommentsModal({
    visible,
    onClose,
    onCommentAdded,
    postId,
}: CommentsModalProps) {

    const [comment, setComment] = useState('')
    const comments = useQuery(api.comments.getComments, { postId: postId as Id<"posts"> })
    const addComment = useMutation(api.comments.addComment)

    const handleAddComment = async () => {
        if (!comment.trim()) return
        try {
            await addComment({
                content: comment,
                postId: postId as Id<"posts">
            })
            setComment('')
            onCommentAdded()
        } catch (error) {
            console.log('Error while adding comment', error)
        }
    }

    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                style={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name='close' color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Comments</Text>
                    <View style={{ width: 24 }} />
                </View>

                {comments === undefined ?
                    <Loader /> :
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => (
                            <Comment
                                comment={{
                                    ...item,
                                    user: {
                                        image: item.user.image ?? '',
                                        clerkId: item.user.clerkId ?? '',
                                        username: item.user.username ?? '',
                                    }
                                }}
                            />
                        )}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{ flex: 1, marginTop: 15 }}
                    />
                }

                <View style={styles.commentInput}>
                    <TextInput
                        style={styles.input}
                        placeholder='Add a comment...'
                        placeholderTextColor={COLORS.grey}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />
                    <TouchableOpacity onPress={handleAddComment} disabled={!comment.trim()}>
                        <Text style={[styles.postButton, !comment.trim() && styles.postButtonDisabled]}>
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}