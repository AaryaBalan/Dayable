import { COLORS } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: COLORS.background,
        marginBottom: Platform.OS === "ios" ? 44 : 0,
        flex: 1,
        marginTop: Platform.OS === "ios" ? 44 : 0,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
    },
    modalTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
    commentContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface,
    },
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
    },
    commentUsername: {
        color: COLORS.white,
        fontWeight: "500",
        marginBottom: 4,
        fontSize: 13
    },
    commentText: {
        color: COLORS.white,
        fontSize: 13,
        lineHeight: 20,
    },
    commentTime: {
        color: COLORS.grey,
        fontSize: 11,
        marginTop: 4,
    },
    commentInput: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.surface,
        backgroundColor: COLORS.background,
    },
    input: {
        flex: 1,
        color: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 12,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 5,
        fontSize: 14,
    },
    postButton: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 14,
    },
    postButtonDisabled: {
        opacity: 0.5,
    },
})