import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    sadImage: {
        width: width ,
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
    bookmarkContainer: {
        width: 50 * width / 100,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 8,
    },
    bookmarkImage: {
        width: '100%', 
        aspectRatio: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
})