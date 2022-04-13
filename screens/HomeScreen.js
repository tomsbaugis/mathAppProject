import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

  const navigation = useNavigation();

  const handleSignout = () => {
    auth.signOut().then(() => {
      navigation.navigate('Login');
    })
  }
  const handleAdditionScreen = () => {
    navigation.navigate('Addition');
  }
  const handleProfileScreen = () => {
    navigation.navigate('Profile');
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('../images/logo3.png')}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleProfileScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Profile page</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAdditionScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Addition page</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignout}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  tinyLogo: {
    width: 200,
    height: 200,
  },
  buttonOutlineText: {
    color: 'blue',
    fontWeight: '700',
    fontSize: 16,  
  },
})