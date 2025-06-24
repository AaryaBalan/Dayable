import { styles } from "@/styles/auth.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const {signOut} = useAuth()
  return (
    <View>
      <TouchableOpacity onPress={()=>signOut()} style={styles.loginButtonGoogle}>
        <Text>Signout</Text>
      </TouchableOpacity>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={'/profile'}>Profile page</Link>
    </View>
  );
}
