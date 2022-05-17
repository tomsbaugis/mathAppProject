import { LogBox, Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
LogBox.ignoreAllLogs();
const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    const navigation = useNavigation();

    const handleSignUp = () => {
        const firestoreDb = firebase.firestore();
        if (password === repeatedPassword) {
            auth.createUserWithEmailAndPassword(email, repeatedPassword).then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered new user with email: ', user.email);
                firestoreDb.collection("Users")
                    .doc(email.toLowerCase())
                    .set({
                        userEmail: email.toLowerCase(),
                        isTeacher: false,
                        accountLevel: 'Student'
                    })
                    .catch(error => {
                        Alert.alert('Failed to save data', error.message);
                    });
                Alert.alert('User creation successful', 'User successfully created');
                navigation.navigate('Login');
            }).catch(error => {
                Alert.alert('Invalid email', error.message);
            })
        } else {
            Alert.alert('Password mismatch', 'Passwords did not match, please try again');
        }
    }
  return (
    <KeyboardAvoidingView
        style={styles.container}
        behaviour='padding'
    >
    
        <View style={styles.inputContainer}>
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
            />
            <TextInput
                placeholder='Repeat password'
                value={repeatedPassword}
                onChangeText={text => setRepeatedPassword(text)}
                style={styles.input}
                secureTextEntry
            />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.buttonOutlineText}>Register user</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

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
        marginTop: 40,
    },
    button: {
        backgroundColor: 'blue',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
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
    buttonOutlineText: {
        color: 'blue', 
        fontWeight: '700',
        fontSize: 16,  
    },
})