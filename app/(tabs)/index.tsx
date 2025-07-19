import Text from '@/components/GlobalText';
import Loader from "@/components/Loader";
import Post from "@/components/Post";
import Stories from '@/components/Stories';
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth()
  const posts = useQuery(api.post.getAllFeed)
  const [refreshing, setRefreshing] = useState(false)

  if (posts === undefined) return <Loader text={'Loading your feed...'} />
  if (posts.length === 0) return <EmptyFeed />

  const signoutUser = () => {
    signOut()
    router.replace('/(auth)/login')
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(()=>{
      setRefreshing(false)
    }, 3000)
  }

  return (
    <View style={styles.feedContainer}>
      {/* topbar */}
      <View style={styles.header}>
        <Text style={styles.brand}>
          Dayable
        </Text>
        <TouchableOpacity onPress={signoutUser}>
          <Ionicons name="log-out-outline" color={COLORS.white} size={25} />
        </TouchableOpacity>
      </View>

      {/* post section */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Stories />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary, COLORS.secondary]}
            progressBackgroundColor={COLORS.surfaceLight}
          />
        }
      />
    </View>
  );
}

const EmptyFeed = () => {
  return (
    <View
      style={styles.emptyContainer}
    >
      <Image
        source={require('../../assets/images/no_post.png')}
        style={styles.sadImage}
        transition={200}
        contentFit='cover'
      />
      <Text style={{ color: COLORS.grey, marginTop: -70 }}>No Post yet</Text>
    </View>
  )
}
