import Text from '@/components/GlobalText'
import Loader from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/bookmarks.style'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from 'convex/react'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

export default function Bookmark() {

    const bookmarks = useQuery(api.bookmarks.getBookmarks)
    if (bookmarks === undefined) return <Loader text={"Fetching your bookmark..."} />
    if (bookmarks.length === 0) return <NoBookmark />

    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back-outline' color={COLORS.secondary} size={20} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.secondary }}>Bookmarks</Text>
                <View style={{ width: 20 }} />
            </View>

            {/* bookmark posts */}
            <FlatList
                data={bookmarks}
                keyExtractor={(item, index) => {
                    return item && item.post && item.post._id ? String(item.post._id) : index.toString();
                }}
                renderItem={({ item }) => (
                    item && item.post ? (
                        <Link href={`/posts/${item.post._id}`} asChild>
                            <TouchableOpacity
                                style={styles.bookmarkContainer}
                            >
                                <Image
                                    source={item.post.image}
                                    style={styles.bookmarkImage}
                                    contentFit='cover'
                                    transition={200}
                                    cachePolicy='memory-disk'
                                />
                            </TouchableOpacity>
                        </Link>
                    ) : null
                )}
                showsVerticalScrollIndicator={false}
                numColumns={2}
            />
        </View>
    )
}

const NoBookmark = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <Image
            source={require('../../assets/images/sad.png')}
            style={styles.sadImage}
            transition={200}
            contentFit='cover'
        />
        <Text style={{ fontSize: 15, color: COLORS.grey }}>No Bookmarks Yet</Text>
    </View>
)