import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        rowGap: -1,
        backgroundColor: COLORS.background
    },
    image: {
        width: width,
        height: height * 0.6
    },
    textContainer: {
        flexDirection: "column",
        rowGap: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.grey
    },
    loginButtonContainer: {
        width: width * 0.75,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    loginButtonGoogle: {
        padding: 10,
        backgroundColor: COLORS.secondary,
        borderRadius: 5,
        color: COLORS.white,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        columnGap: 10
    },
})
