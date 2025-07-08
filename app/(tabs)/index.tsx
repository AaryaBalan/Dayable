import Text from '@/components/GlobalText';
import Loader from "@/components/Loader";
import Post from "@/components/Post";
import Story from "@/components/Story";
import { STORIES } from "@/constants/story_data";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth()
  const posts = useQuery(api.post.getAllFeed)

  if (posts === undefined) return <Loader text={'Loading your feed...'}/>
  if (posts.length === 0) return <EmptyFeed />

  const signoutUser = () => {
    signOut()
    router.replace('/(auth)/login')
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
        ListHeaderComponent={<StoriesSection />}
      />
    </View>
  );
}

const StoriesSection = () => (
  <FlatList
    horizontal
    data={STORIES}
    renderItem={({ item }) => <Story story={item} />}
    keyExtractor={(item) => item.id}
    style={styles.storyScrollContainer}
    showsHorizontalScrollIndicator={false}
  />
)

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
