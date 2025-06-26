import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    feedContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        minHeight: 0
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
    },
    brand: {
        fontSize: 20,
        color: COLORS.primary,
    },
    storyScrollContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
        backgroundColor: COLORS.background
    },
    storyContainer: {
        alignItems: "center",
        marginHorizontal: 8,
        width: 72,
    },
    storyAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.surfaceLight,
    },
    storyRing: {
        width: 68,
        height: 68,
        borderRadius: 34,
        padding: 2,
        backgroundColor: COLORS.background,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginBottom: 12
    },
    noStory: {
        borderColor: COLORS.grey,
    },
    storyUsername: {
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 12,
        marginTop: 5,
        width: 60,
    },

    // post style
    postContainer: {
        flex: 1,
        rowGap: 16
    },
    postTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },
    postAuthorImage: {
        width: 32,
        height: 32,
        borderRadius: 16
    },
    postImage: {
        height: width,
        width: width
    },
    postActionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },

    // post info
    postInfo: {
        paddingHorizontal: 12
    },
    likesText: {
        color: COLORS.white,
        fontSize: 12,
    },
    captionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4
    },
    captionUsername: {
        fontSize: 13,
        color: COLORS.primary,
        marginRight: 6,
    },
    captionText: {
        fontSize: 13,
        color: COLORS.white,
        flex: 1,
    },
    commentsText: {
        fontSize: 12,
        color: COLORS.grey,
    },
    timeAgo: {
        fontSize: 12,
        color: COLORS.grey,
        marginBottom: 8,
    },
    heartIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        opacity: 0.8,
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
})