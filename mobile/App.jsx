import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from './components/CustomButton';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/onboarding.jpg')}
        style={styles.image}>
        {/* Gradient overlay at the bottom */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.7)',
            'rgba(255, 255, 255, 1)',
          ]}
          style={styles.gradient}
        />
      </ImageBackground>
      <View style={styles.getStartedSection}>
        <Text style={styles.heading}>MERN Stack Chat App</Text>
        <Text style={styles.text}>Fast & Secure Messaging Stay in touch with friends and colleagues with real-time, encrypted chats.</Text>
        <CustomButton
          title="Get Started"
          textStyles={styles.buttonText}
          buttonStyles={styles.buttonStyles}
        />
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 400,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%', // Adjust the height to control the blur area
  },
  text: {
    fontWeight: 400,
    fontSize: 15,
    paddingVertical: 5,
    color: "gray"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
    textAlign: "center"
  },
  buttonStyles: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    marginTop: 20
  },
  getStartedSection: {
    marginTop: 200,
    paddingHorizontal: 20
  },
  heading: {
    fontWeight: 600,
    fontSize: 20,
    color: "gray"
  }
});
