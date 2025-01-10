import { StatusBar, View, SafeAreaView, StyleSheet, ImageBackground, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

export default function index (){
  
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
        color: "gray"
      },
      text: {
        color: "gray",
        fontSize: 15
      },
      buttonStyle: {
        backgroundColor: "green",
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 10
      },
      buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
      }
})