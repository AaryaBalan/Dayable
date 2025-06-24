import { styles } from '@/styles/auth.styles'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Login() {

    const { startSSOFlow } = useSSO()
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' })
            if (setActive && createdSessionId) {
                setActive({ session: createdSessionId })
                router.replace('/(tabs)')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>

            {/* text container */}
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>Dayable</Text>
                <Text style={styles.descriptionText}>Make Every Day Dayable.</Text>
            </View>

            {/* image container */}
            <View>
                <Image
                    source={require('../../assets/images/dayable.png')}
                    style={styles.image}
                    resizeMode='cover'
                />
            </View>

            {/* login buttons container */}
            <View style={styles.loginButtonContainer}>
                <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    style={styles.loginButtonGoogle}
                >
                    <Text style={{ color: "white" }}>Continue with Google</Text>
                    <Ionicons name='logo-google' size={15} color={'white'} />
                </TouchableOpacity>
            </View>

        </View>
    )
}