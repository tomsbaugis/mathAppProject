import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import * as firebase from "firebase";
import "firebase/firestore";
import { auth } from '../firebase';

let score = 0;
let repetition = 0;
let time = 0;
let interval;
let startButtonText = 'Begin attempt';
let questions = {};
let isCorrect;

const AdditionScreen = () => {
    const currentUserEmail = auth.currentUser?.email;
    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
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
    const handleAdditionEquation = () => {
        if (repetition === 0) {
            setNumber1(generateNumber(10));
            setNumber2(generateNumber(10));
            startTime();
            startButtonText = 'Solve';
        }
        const firstNumber = parseInt(number1);
        const secondNumber = parseInt(number2);
        const resultNumber = parseInt(result);
        if (firstNumber + secondNumber === resultNumber && typeof firstNumber !== 'undefined' && typeof secondNumber !== 'undefined') {
            isCorrect = true;
            score++;
        } else {
            isCorrect = false;
        }
        if (repetition !== 0) {
            questions[`question-${repetition}`] = {
                firstNumber: firstNumber,
                secondNumber: secondNumber,
                equationType: 'Addition',
                userInputResult: resultNumber,
                actualResult: firstNumber + secondNumber,
                isCorrect: isCorrect
            }
        }
        repetition++;
        setNumber1(generateNumber(10));
        setNumber2(generateNumber(10));
        setResult('');
        if(repetition === 6) {
            console.log('HERE ARE QUESTIONS: ', questions);
            const firestoreDb = firebase.firestore();
            firestoreDb.collection("Addition")
                .doc(`Addition_${Date.now()}`)
                .set({
                    totalQuestions: 5,
                    correctAnswers: parseInt(score),
                    timeSpentSeconds: parseInt(time),
                    questions: questions,
                    userEmail: currentUserEmail
                })
                .catch(error => {
                    alert(error);
                });
            navigation.navigate('Home');
            alert(`Completed 5 equations.\nResult: ${score} of 5 questions answered correctly.\nTime elapsed: ${time} seconds.`);
        }
    }
    const [number1, setNumber1] = useState();
    const [number2, setNumber2] = useState();
    const [result, setResult] = useState();
    const [timeStamp, setTime] = useState();
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
                <Text style={styles.textFont}>+</Text>
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
        </KeyboardAvoidingView>
    )
}

export default AdditionScreen

const styles = StyleSheet.create({
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