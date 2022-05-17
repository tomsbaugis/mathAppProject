import React, { useEffect, useState } from 'react'
import { LogBox, Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
LogBox.ignoreAllLogs();
let score = 0;
let repetition = 0;
let time = 0;
let interval;
let startButtonText = 'Begin attempt';
let questions = {};
let isCorrect;
let video;

const MultiplicationScreen = () => {
    const currentUserEmail = auth.currentUser?.email;
    const navigation = useNavigation();
    const firestoreDb = firebase.firestore();

    const [number1, setNumber1] = useState();
    const [number2, setNumber2] = useState();
    const [result, setResult] = useState();
    const [timeStamp, setTime] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [grade, setGrade] = useState();
    const [cameraRef, setCameraRef] = useState();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            const { audioStatus } = await Audio.requestPermissionsAsync();
            setHasAudioPermission(audioStatus === 'granted');
        })();
        const unsubscribe = navigation.addListener('focus', () => {
            firestoreDb.collection('Users').doc(currentUserEmail).get().then(user => {
                const userData = user.data();
                setFirstName(userData?.firstName);
                setLastName(userData?.lastName);
                setGrade(userData?.grade.toString());
            });
            setNumber1('');
            setNumber2('');
            setTime('');
            clearInterval(interval);
            score = 0;
            repetition = 0;
            time = 0;
            startButtonText = 'Begin attempt';
            questions = {};
        });
    
        return () => {
          unsubscribe;
        };
    }, [navigation]);
    const generateNumber = max => {
        const createdNumber = Math.floor(Math.random() * max);
        return createdNumber;
    }
    const startTime = () => {
        interval = setInterval(() => {
            time++;
            setTime(time);
        }, 1000)
    }
    const handleAdditionEquation = async () => {
        if (repetition === 0) {
            setNumber1(generateNumber(10));
            setNumber2(generateNumber(10));
            startTime();
            video = cameraRef.recordAsync();
            startButtonText = 'Solve';
        }
        const firstNumber = parseInt(number1);
        const secondNumber = parseInt(number2);
        const resultNumber = parseInt(result);
        if (firstNumber * secondNumber === resultNumber && typeof firstNumber !== 'undefined' && typeof secondNumber !== 'undefined') {
            isCorrect = true;
            score++;
        } else {
            isCorrect = false;
        }
        if (repetition !== 0) {
            questions[`question-${repetition}`] = {
                firstNumber: firstNumber,
                secondNumber: secondNumber,
                equationType: 'Multiplication',
                userInputResult: resultNumber,
                actualResult: firstNumber * secondNumber,
                isCorrect: isCorrect
            }
        }
        repetition++;
        setNumber1(generateNumber(10));
        setNumber2(generateNumber(10));
        setResult('');
        if(repetition === 6) {
            cameraRef.stopRecording();
            console.log(await video);
            const firestoreDb = firebase.firestore();
            firestoreDb.collection("Multiplication")
                .doc(`Multiplication_${Date.now()}`)
                .set({
                    totalQuestions: 5,
                    correctAnswers: parseInt(score),
                    timeSpentSeconds: parseInt(time),
                    questions: questions,
                    student: `${firstName} ${lastName}`,
                    studentEmail: currentUserEmail,
                    grade: grade,
                    dateCompleted: Date.now(),
                    taskType: 'Equation-Multiplication'
                })
                .catch(error => {
                    alert(error);
                });
            navigation.navigate('Home');
            Alert.alert('Miltiplication task results', `Completed 5 equations.\nResult: ${score} of 5 questions answered correctly.\nTime elapsed: ${time} seconds.`);
        }
    }
    
    const [hasPermission, setHasPermission] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behaviour='padding'
        >
            <TextInput
                value={timeStamp?.toString()}
                style={styles.input}
                editable={false}
            />
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Solve the following equation</Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
                <TextInput
                    value={number1?.toString()}
                    style={styles.input}
                    editable={false}
                />
                <Text style={styles.textFont}>*</Text>
                <TextInput
                    value={number2?.toString()}
                    style={styles.input}
                    editable={false}
                />
                <Text style={styles.textFont}>=</Text>
                <TextInput
                    placeholder='Answer here'
                    value={result}
                    onChangeText={text => setResult(text)}
                    style={styles.input}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleAdditionEquation}
                    style={styles.button}
                >
                <Text style={styles.buttonText}>{startButtonText}</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Camera style={styles.camera} type={Camera.Constants.Type.front} ref={ ref => setCameraRef(ref)} >
                
                </Camera>
            </View>
        </KeyboardAvoidingView>
    )
}

export default MultiplicationScreen

const styles = StyleSheet.create({
    camera: {
        width: 1,
        height: 1,
        opacity: 0
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '80%'
    },
    textFont: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0,
        width: 25,
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
        marginTop: 20,
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