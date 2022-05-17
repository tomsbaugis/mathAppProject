import { LogBox, Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, InteractionManager } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
LogBox.ignoreAllLogs();
const UpdateProfileScreen = () => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [interest, setInterest] = useState();
    const [age, setAge] = useState();
    const [grade, setGrade] = useState();
    const currentUserEmail = auth.currentUser?.email;
    const navigation = useNavigation();
    const firestoreDb = firebase.firestore();
    const [isTeacher, setIsTeacher] = useState();
    let goodForUpdate = true;

    async function getUser() {
        let result;
        const usersRef = firestoreDb.collection('Users');
        const snapshot = await usersRef.where('userEmail', '==', currentUserEmail).get();

        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            result = doc.data();
        });
        return result;
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const user = await getUser();
            setIsTeacher(user?.isTeacher);
            goodForUpdate = true;
        });
    
        return () => {
          unsubscribe;
        };
    }, [navigation]);
    const handleInformationUpdate = () => {
        let updatedObj = {};
        let errors = [];
        if (typeof isTeacher !== 'undefined' && !isTeacher) {
            updatedObj = {
                firstName: firstName,
                lastName: lastName,
                interest: interest,
                age: parseInt(age),
                grade: parseInt(grade)
            }
            for (const [key, value] of Object.entries(updatedObj)) {
                if (typeof value === 'undefined') {
                    errors.push(key);
                }
            }
        }
        if (typeof isTeacher !== 'undefined' && isTeacher) {
            updatedObj = {
                firstName: firstName,
                lastName: lastName,
                age: parseInt(age),
            }
            for (const [key, value] of Object.entries(updatedObj)) {
                if (typeof value === 'undefined') {
                    errors.push(key);
                }
            }
        }
        if (errors.length > 0) {
            Alert.alert('Missing data', `Value/-s ${[...errors]} need to be provided for profile update`);
            goodForUpdate = false;
        }
        if (goodForUpdate) {
            firestoreDb
                .collection('Users')
                .doc(currentUserEmail)
                .update(updatedObj)
                .then(() => {
                    Alert.alert('Update succesfull', 'User information successfully updated!');
                })
                .catch(error => {
                    Alert.alert('Update failed', 'Something went wrong while trying to update user information');
                });
            navigation.navigate('Profile');
        }
    }
    const renderStudentInterestInfo = () => (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.textFont}>Interest: </Text>
            <TextInput
                placeholder='Interest'
                value={interest}
                onChangeText={text => setInterest(text)}
                style={styles.input}
            />
        </View>
    )
    const renderStudentClassInfo = () => (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.textFont}>Class: </Text>
            <TextInput
                placeholder='Class'
                value={grade}
                onChangeText={text => setGrade(text)}
                style={styles.input}
            />
        </View>
    )
    function checkStudentInterests() {
        if (typeof isTeacher !== 'undefined' && !isTeacher) {
            return renderStudentInterestInfo();
        }
    }
    function checkStudentClass() {
        if (typeof isTeacher !== 'undefined' && !isTeacher) {
            return renderStudentClassInfo();
        }
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
                <Text style={styles.textFont}>Age: </Text>
                <TextInput
                    placeholder='Age'
                    value={age}
                    onChangeText={text => setAge(text)}
                    style={styles.input}
                />
            </View>
            { checkStudentInterests() }
            { checkStudentClass() }
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