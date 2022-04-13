import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [interest, setInterest] = useState();
    const [age, setAge] = useState();

    const navigation = useNavigation();
    const firestoreDb = firebase.firestore();
    const currentUserEmail = auth.currentUser?.email;
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            firestoreDb.collection('Users').doc(currentUserEmail).get().then(user => {
                const userData = user.data();
                setFirstName(userData?.firstName);
                setLastName(userData?.lastName);
                setInterest(userData?.interest);
                setAge(userData?.age.toString());
            });
        });
    
        return () => {
          unsubscribe;
        };
    }, [navigation]);
    const handleUpdateScreen = () => {
        navigation.navigate('Update Profile');
    }
    const handlHomeScreen = () => {
        navigation.navigate('Home');
    }
    return (
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../images/user.png')}
            />
            <View style={styles.buttonContainer}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>First Name: </Text>
                <TextInput
                    value={firstName}
                    style={styles.input}
                    editable={false}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Last Name: </Text>
                <TextInput
                    value={lastName}
                    style={styles.input}
                    editable={false}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Interest: </Text>
                <TextInput
                    value={interest}
                    style={styles.input}
                    editable={false}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Age: </Text>
                <TextInput
                    value={age}
                    style={styles.input}
                    editable={false}
                />
            </View>
            <TouchableOpacity
                onPress={handleUpdateScreen}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Update profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handlHomeScreen}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Return</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProfileScreen

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