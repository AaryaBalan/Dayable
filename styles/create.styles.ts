import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flex: 1
    },
    topBar: {
        width: width,
        height: 50,
        padding: 10,
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: COLORS.surfaceLight,
        borderBottomWidth: 1
    },
    topBarContent: {
        color: COLORS.secondary,
        fontSize: 15,
    },
    createImage: {
        width: width * .9,
        height: height * 0.7,
        opacity: 1
    },
    createImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    // if image is setted
    shareButton:{
        backgroundColor: COLORS.secondary,
        color: COLORS.white,
        paddingVertical: 7,
        paddingHorizontal: 7,
        borderRadius: 5,
        width: 50,
        textAlign: 'center',
        fontSize: 12
    },
    imageSection: {
        width: width,
        height: width,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    changeImageButton:{
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 8,
        gap: 6,
    },
    uploadedContent:{
        flex:1
    },
    uploadContentDisabled:{
        opacity: 0.7
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    textContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        flex: 1,
    },
    textarea: {
        flex: 1,
        color: COLORS.white,
        fontSize: 13,
        minHeight: 'auto',
        fontFamily: 'Poppins_400Regular'
    },
    scrollContent: {
        flexGrow: 1,
    },
})