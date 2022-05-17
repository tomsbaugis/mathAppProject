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
let tasks = {};
let video;
let temp = {};
let isCorrect;

const TextTaskScreen = () => {
    const currentUserEmail = auth.currentUser?.email;
    const navigation = useNavigation();
    const firestoreDb = firebase.firestore();

    const [result, setResult] = useState();
    const [timeStamp, setTime] = useState();
    const [firstName, setFirstName] = useState();
    const [interests, setInterests] = useState();
    const [lastName, setLastName] = useState();
    const [grade, setGrade] = useState();
    const [text, setText] = useState();
    const [cameraRef, setCameraRef] = useState();
    const equationTypes = ['Addition', 'Subtraction', 'Multiplication', 'Division'];

    useEffect(() => {
        // (async () => {
        //     const { status } = await Camera.requestCameraPermissionsAsync();
        //     setHasPermission(status === 'granted');
        //     const { audioStatus } = await Audio.requestPermissionsAsync();
        //     setHasAudioPermission(audioStatus === 'granted');
        // })();
        const unsubscribe = navigation.addListener('focus', () => {
            firestoreDb.collection('Users').doc(currentUserEmail).get().then(user => {
                const userData = user.data();
                setFirstName(userData?.firstName);
                setLastName(userData?.lastName);
                setInterests((userData?.interest).toLowerCase());
                setGrade(userData?.grade.toString());
            });
            setTime('');
            clearInterval(interval);
            score = 0;
            repetition = 0;
            time = 0;
            startButtonText = 'Begin attempt';
            tasks = {};
        });
    
        return () => {
          unsubscribe;
        };
    }, [navigation]);
    const generateNumber = (min, max) => {
        const createdNumber = Math.floor(Math.random() * (max - min) + min);
        return createdNumber;
    }
    const startTime = () => {
        interval = setInterval(() => {
            time++;
            setTime(time);
        }, 1000)
    }
    function createTextTask(name, interest, equationType) {
        let type;
        const firstNumber = generateNumber(0, 11);
        const secondNumber = generateNumber(1, 11);
        let equationResult;
        let result = {};
        switch (equationType) {
            case 'Addition':
                type = `gained ${secondNumber} more ${interest}?`;
                equationResult = firstNumber + secondNumber;
                break;
            case 'Subtraction':
                type = `lost ${secondNumber} of their ${interest}?`;
                equationResult = firstNumber - secondNumber;
                break;
            case 'Multiplication':
                type = `multiplied the number of their ${interest} by ${secondNumber}?`;
                equationResult = firstNumber * secondNumber;
                break;
            case 'Division':
                type = `divided the number of their ${interest} by ${secondNumber}? (to the nearest whole number)`;
                equationResult = Math.floor(firstNumber / secondNumber);
                break;
            default:
                console.log(`Invalid equation type ${equationType} provided`);
                break;
        }
    
        const text = `${name} has ${firstNumber} ${interest}. How many ${interest} would ${name} have, if they ${type}`;
        result.text = text;
        result.firstNumber = firstNumber;
        result.secondNumber = secondNumber;
        result.equationType = equationType;
        result.equationResult = equationResult;
        return result;
    }
    const textTask = createTextTask(firstName, interests, equationTypes[generateNumber(0, 4)]);
    
    const handleTextTask = async () => {
        if (repetition === 0) {
            startTime();
            // video = cameraRef.recordAsync();
            startButtonText = 'Solve';
        }
        const resultNumber = parseInt(result);
        if (typeof temp.result !== 'undefined') {
            if (resultNumber === temp.result.equationResult) {
                score++;
                isCorrect = true;
            } else {
                isCorrect = false;
            }
            if (repetition !== 0) {
                tasks[`task-${repetition}`] = {
                    firstNumber: temp.result.firstNumber,
                    secondNumber: temp.result.secondNumber,
                    equationType: temp.result.equationType,
                    userInputResult: resultNumber,
                    actualResult: temp.result.equationResult,
                    isCorrect: isCorrect
                }
            }
        }
        setText(textTask.text);
        temp.result = textTask;
        repetition++;
        setResult('');
        if(repetition === 6) {
            // cameraRef.stopRecording();
            // console.log(await video);
            const firestoreDb = firebase.firestore();
            firestoreDb.collection("TextTask")
                .doc(`TextTask_${Date.now()}`)
                .set({
                    totalQuestions: 5,
                    correctAnswers: parseInt(score),
                    timeSpentSeconds: parseInt(time),
                    questions: tasks,
                    student: `${firstName} ${lastName}`,
                    studentEmail: currentUserEmail,
                    grade: grade,
                    dateCompleted: Date.now(),
                    taskType: 'Text Task'
                })
                .catch(error => {
                    alert(error);
                });
            console.log(tasks);
            navigation.navigate('Home');
            Alert.alert('Text task results',`Completed 5 equations.\nResult: ${score} of 5 tasks completed correctly.\nTime elapsed: ${time} seconds.`);
        }
    }
    
    // const [hasPermission, setHasPermission] = useState(null);
    // const [hasAudioPermission, setHasAudioPermission] = useState(null);

    // if (hasPermission === false) {
    //     return <Text>No access to camera</Text>;
    // }
    // if (hasAudioPermission === false) {
    //     return <Text>No access to audio</Text>;
    // }
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
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Solve the following task</Text>
            <TextInput
                multiline
                alignItems= 'center'
                placeholder='Text'
                value={text}
                style={styles.textFont}
                editable={false}
            />
            <TextInput
                placeholder='Answer here'
                value={result}
                onChangeText={text => setResult(text)}
                style={styles.input}
                keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleTextTask}
                    style={styles.button}
                >
                <Text style={styles.buttonText}>{startButtonText}</Text>
                </TouchableOpacity>
            </View>
            {/* <View>
                <Camera style={styles.camera} type={Camera.Constants.Type.front} ref={ ref => setCameraRef(ref)} >
                
                </Camera>
            </View> */}
        </KeyboardAvoidingView>
    )
}

export default TextTaskScreen

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
        textAlign: 'left',
        textAlignVertical: 'top',
        textAlign: 'justify',
        fontWeight: 'bold',
        fontSize: 16,
        width: 350,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
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