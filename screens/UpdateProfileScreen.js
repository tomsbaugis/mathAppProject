import { StyleSheet, Text, TouchableOpacity, View, TextInput, InteractionManager } from 'react-native'
import React, { useState } from 'react'
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const UpdateProfileScreen = () => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [interest, setInterest] = useState();
    const [age, setAge] = useState();
    const currentUserEmail = auth.currentUser?.email;
    const navigation = useNavigation();
    const handleInformationUpdate = () => {
        const firestoreDb = firebase.firestore();
        firestoreDb
            .collection('Users')
            .doc(currentUserEmail)
            .update({
                firstName: firstName,
                lastName: lastName,
                interest: interest,
                age: parseInt(age)
            })
            .then(() => {
                alert('User information successfully updated!');
            })
            .catch(error => {
                alert('Something went wrong while trying to update user information');
            });
        navigation.navigate('Profile');
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>First Name: </Text>
                <TextInput
                    placeholder='First Name'
                    value={firstName}
                    onChangeText={text => setFirstName(text)}
                    style={styles.input}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Last Name: </Text>
                <TextInput
                    placeholder='Last Name'
                    value={lastName}
                    onChangeText={text => setLastName(text)}
                    style={styles.input}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Interest: </Text>
                <TextInput
                    placeholder='Interest'
                    value={interest}
                    onChangeText={text => setInterest(text)}
                    style={styles.input}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Age: </Text>
                <TextInput
                    placeholder='Age'
                    value={age}
                    onChangeText={text => setAge(text)}
                    style={styles.input}
                />
            </View>
            <TouchableOpacity
                onPress={handleInformationUpdate}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Update information</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputContainer: {
      width: '80%'
    },
    tinyLogo: {
        width: 80,
        height: 80,
    },
    input: {
      backgroundColor: 'white',
      width: 150,
      height: 40,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
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
    buttonOutlineText: {
      color: 'blue',
      fontWeight: '700',
      fontSize: 16,  
    },
    textFont: {
        width: 80,
        height: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 0,
    },
})