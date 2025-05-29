import { Text, View } from "react-native";

export default function UserComponent({ letter }: { letter: String }){
    return (
        <View style={{
            width: 35,
            height: 35,
            borderRadius: 50,
            backgroundColor: "#f7f5f5",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text style={{fontWeight: 600}}>{letter.toUpperCase()}</Text>
        </View>
    )
}