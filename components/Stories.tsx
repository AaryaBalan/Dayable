import { STORIES } from "@/constants/story_data"
import { FlatList } from "react-native"
import Story from "./Story"
import { styles } from "@/styles/feed.styles"

const Stories = () => (
    <FlatList
        horizontal
        data={STORIES}
        renderItem={({ item }) => <Story story={item} />}
        keyExtractor={(item) => item.id}
        style={styles.storyScrollContainer}
        showsHorizontalScrollIndicator={false}
    />
)

export default Stories