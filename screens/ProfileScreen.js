import {LogBox, Alert, StyleSheet, Text, Modal, TouchableOpacity, View, Image, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
LogBox.ignoreAllLogs();
const ProfileScreen = () => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [interest, setInterest] = useState();
    const [age, setAge] = useState();
    const [grade, setGrade] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [isTeacher, setIsTeacher] = useState();
    const [accountLevel, setAccountLevel] = useState();

    const navigation = useNavigation();
    const firestoreDb = firebase.firestore();
    const currentUserEmail = auth.currentUser?.email;
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
            console.log(user);
            setFirstName(user?.firstName);
            setLastName(user?.lastName);
            setInterest(user?.interest);
            setAge(user?.age.toString());
            setGrade(user?.grade.toString());
            setIsTeacher(user?.isTeacher);
            setAccountLevel(user?.accountLevel);
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
    const handleAdditionStatisticsScreen = () => {
        navigation.navigate('Addition Statistics');
        setModalVisible(!modalVisible);
    }
    const handleSubtractionStatisticsScreen = () => {
        navigation.navigate('Subtraction Statistics');
        setModalVisible(!modalVisible);
    }
    const handleMultiplicationStatisticsScreen = () => {
        navigation.navigate('Multiplication Statistics');
        setModalVisible(!modalVisible);
    }
    const handleDivisionStatisticsScreen = () => {
        navigation.navigate('Division Statistics');
        setModalVisible(!modalVisible);
    }
    const handleTextTaskStatisticsScreen = () => {
        navigation.navigate('Text Task Statistics');
        setModalVisible(!modalVisible);
    }
    const renderStudentInterestInfo = () => (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.textFont}>Interest: </Text>
            <TextInput
                value={interest}
                style={styles.input}
                editable={false}
            />
        </View>
    )
    const renderStudentClassInfo = () => (
        <View style={{flexDirection: 'row'}}>
        <Text style={styles.textFont}>Class: </Text>
        <TextInput
            value={grade}
            style={styles.input}
            editable={false}
        />
    </View>
    )
    const renderStudentElement = () => (
        <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.button}
        >
            <Text style={styles.buttonText}>See your task statistics</Text>
        </TouchableOpacity>
    );
    function checkIsTeacher() {
        if (typeof isTeacher !== 'undefined' && !isTeacher) {
            return renderStudentElement();
        }
    }
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
            <Image
                style={styles.tinyLogo}
                source={require('../images/user.png')}
            />
            <View style={styles.buttonContainer}>
            <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>First Name: </Text>
                <TextInput
                    value={firstName}
                    style={styles.input}
                    editable={false}
                />
            </View>
            <Text style={styles.someText}> </Text>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Last Name: </Text>
                <TextInput
                    value={lastName}
                    style={styles.input}
                    editable={false}
                />
            </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textFont}>Age: </Text>
                    <TextInput
                        value={age}
                        style={styles.input}
                        editable={false}
                    />
                </View>
                <Text style={styles.someText}> </Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textFont}>Account level: </Text>
                    <TextInput
                        value={accountLevel}
                        style={styles.input}
                        editable={false}
                    />
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                { checkStudentInterests() }
                <Text style={styles.someText}> </Text>
                { checkStudentClass() }
            </View>
            <TouchableOpacity
                onPress={handleUpdateScreen}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Update profile</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Choose for which subject to check statistics</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleAdditionStatisticsScreen}
                            >
                            <Text style={styles.buttonText}>Addition</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTextFont}> </Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleSubtractionStatisticsScreen}
                            >
                            <Text style={styles.buttonText}>Subtraction</Text>
                            </TouchableOpacity>
                        </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleMultiplicationStatisticsScreen}
                        >
                        <Text style={styles.buttonText}>Multiplication</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTextFont}> </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleDivisionStatisticsScreen}
                        >
                        <Text style={styles.buttonText}>Divison</Text>
                        </TouchableOpacity>
                    </View>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleTextTaskStatisticsScreen}
                        >
                        <Text style={styles.buttonText}>Text tasks</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            { checkIsTeacher()}
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center",
        fontWeight: '700',
        fontSize: 16,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalButton: {
        backgroundColor: 'blue',
        width: 130,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputContainer: {
      width: '80%'
    },
    tinyLogo: {
        width: 90,
        height: 90,
    },
    input: {
      backgroundColor: 'white',
      width: 80,
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
    modalTextFont: {
        height: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 0,
    },
    textFont: {
        width: 60,
        height: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 0,
    },
    someText: {
        width: 10,
        height: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 0,
    }
})