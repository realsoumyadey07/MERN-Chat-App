import { StatusBar, View, SafeAreaView, StyleSheet, ImageBackground, Text } from 'react-native'
import React, { useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import CustomButton from '@/components/CustomButton'
import { Redirect, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function index (){
  useEffect(()=> {
    const checkToken = async ()=> {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if(token) return <Redirect href="/(root)/conversations"/>
      } catch (error: any) {
        console.error("Error while fetching token: ", error);
      }
    }
    checkToken();
  },[]);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/onboarding.jpg')} 
        style={styles.image}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)']}
          style={styles.gradient}
        />
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <Text style={styles.heading}>MERN Chat App</Text>
        <Text style={styles.text}>Stay in touch with friends and colleagues with real-time, encrypted chats.</Text>
        <CustomButton
        title="Get Started"
        handleSubmit={()=> router.push("/login")}
        textStyle={styles.buttonText}
        buttonStyle={styles.buttonStyle}
        />
      </View>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        flex: 1,
        width: 400,
        height: 400,
        position: 'absolute',
        top: 0
      },
      gradient: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '30%', // Adjust the height to control the blur area
      },
      buttonContainer: {
        marginTop: 40,
        paddingHorizontal: 10
      },
      heading: {
        fontWeight: 600,
        fontSize: 24,
        color: "#3b3b3b"
      },
      text: {
        color: "#474747",
        fontSize: 15
      },
      buttonStyle: {
        backgroundColor: "#141414",
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 20
      },
      buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
      }
});