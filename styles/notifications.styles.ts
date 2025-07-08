import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    emptyImage: {
        width: width,
        height: height * 0.4,
        resizeMode: 'contain',
        marginBottom: 20
    },
    header: {
        width: width,
        height: 50,
        padding: 10,
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: COLORS.surfaceLight,
        borderBottomWidth: 1,
        marginBottom: 20
    },
    notificationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    notificationContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        columnGap: 10
    },
    avatarContainer: {
        position: "relative",
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    iconBadge: {
        position: "absolute",
        bottom: -4,
        right: -4,
        backgroundColor: COLORS.background,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    notificationInfo: {
        flex: 1,
    },
    username: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 2,
    },
    action: {
        color: COLORS.grey,
        fontSize: 12,
        marginBottom: 2,
    },
    timeAgo: {
        color: COLORS.grey,
        fontSize: 11,
    },
    postImage: {
        width: 52,
        height: 52,
        borderRadius: 6,
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
})