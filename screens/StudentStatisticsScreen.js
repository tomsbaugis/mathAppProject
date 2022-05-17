import React, { useState, useEffect } from "react";
import { LogBox, Picker, StyleSheet, Text, TouchableOpacity, View, Modal, Image, TextInput, ScrollView  } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
LogBox.ignoreAllLogs();
const StudentStatisticsScreen = () => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [usersArr, setUsersArr] = useState([]);
    const [tableHead, setTableHead] = useState(['Date completed', 'Total equations\ncompleted', 'Correct answers', 'Incorrect answers', 'Mark', 'Time spent\n(in seconds)', 'Type of task', 'Tasks completed']);
    const [tableHeadQuestions, setTableHeadQuestions] = useState(['', 'First number', 'Equation', 'Second number', 'Your input', 'Actual result', 'Answered correctly']);
    const [tableQuestionsTitle] = useState(['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5']);
    const [tableDataActual, setTableData] = useState([]);
    const [widthArr] = useState([100, 100, 100, 100, 100, 100, 100, 100]);
    const [widthArrQuestions] = useState([100, 100, 100, 100, 100, 100, 100]);
    const [timeData, setTimeData] = useState([]);
    const [correctQuestionsData, setCorrectQuestionsData] = useState([]);
    const [totalQuestionsData, setTotalQuestionsData] = useState([]);
    const [timeDataAddition, setTimeDataAddition] = useState([]);
    const [correctQuestionsDataAddition, setCorrectQuestionsDataAddition] = useState([]);
    const [totalQuestionsDataAddition, setTotalQuestionsDataAddition] = useState([]);
    const [timeDataSubtraction, setTimeDataSubtraction] = useState([]);
    const [correctQuestionsDataSubtraction, setCorrectQuestionsDataSubtraction] = useState([]);
    const [totalQuestionsDataSubtraction, setTotalQuestionsDataSubtraction] = useState([]);
    const [timeDataMultiplication, setTimeDataMultiplication] = useState([]);
    const [correctQuestionsDataMultiplication, setCorrectQuestionsDataMultiplication] = useState([]);
    const [totalQuestionsDataMultiplication, setTotalQuestionsDataMultiplication] = useState([]);
    const [timeDataDivision, setTimeDataDivision] = useState([]);
    const [correctQuestionsDataDivision, setCorrectQuestionsDataDivision] = useState([]);
    const [totalQuestionsDataDivision, setTotalQuestionsDataDivision] = useState([]);
    const [timeDataText, setTimeDataText] = useState([]);
    const [correctQuestionsDataText, setCorrectQuestionsDataText] = useState([]);
    const [totalQuestionsDataText, setTotalQuestionsDataText] = useState([]);
    const [tableDataQuestions, setTableDataQuestions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleSubjects, setModalVisibleSubjects] = useState(false);
    const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);
    const [time, setTime] = useState();
    const [correctQuestions, setCorrectQuestions] = useState();
    const [totalQuestions, setTotalQuestions] = useState();
    const [maxTime, setMaxTime] = useState();
    const [minTime, setMinTime] = useState();
    const [incorrectQuestions, setIncorrectQuestions] = useState();
    const [correctQuestionsRatio, setCorrectQuestionsRatio] = useState();
    const [averageTime, setAverageTime] = useState();
    const [type, setType] = useState();
    const firestoreDb = firebase.firestore();
    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUsers();
            // handleStatistics();
        });
    
        return () => {
          unsubscribe;
        };
      }, [navigation]);
    async function getUsers() {
        let result = [];
        const usersRef = firestoreDb.collection('Users');
        const snapshot = await usersRef.where('isTeacher', '==', false).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            result.push(doc.data());
        });
        setUsersArr(result);
    }
    async function getDocs(collection) {
        let result = [];
        console.log('Student selected: ', selectedStudent);
        const docsRef = firestoreDb.collection(collection);
        const snapshot = await docsRef.where('studentEmail', '==', selectedStudent).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            result.push(doc.data());
        });
        let tableData = [];
        let timeCollection = [];
        let correctQuestionsCollection = [];
        let totalQuestionsCollection = [];
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        result.forEach(entry => {
            let tempData = [];
            let tableDataQuestions = [];
            for (const [key, values] of Object.entries(entry.questions)) {
                let temp = [];
                temp.push(values.firstNumber);
                temp.push(values.equationType);
                temp.push(values.secondNumber);
                temp.push(values.userInputResult);
                temp.push(values.actualResult);
                temp.push(values.isCorrect ? 'Yes' : 'No');
                tableDataQuestions.push(temp);
            }
            const correctAnswerRatio = (entry.correctAnswers / entry.totalQuestions) * 100;
            const incorrectAnswers = entry.totalQuestions - entry.correctAnswers;
            const dateTimeCompleted = entry.dateCompleted;
            const dateCompleted = new Date(dateTimeCompleted);
            const dateString = dateCompleted.toLocaleDateString('en-US', options);
            tempData.push(dateString);
            tempData.push(entry.totalQuestions);
            tempData.push(entry.correctAnswers);
            tempData.push(incorrectAnswers);
            tempData.push(`${Math.round((correctAnswerRatio + Number.EPSILON) * 100) / 100}%`);
            tempData.push(entry.timeSpentSeconds);
            tempData.push(entry.taskType);
            tempData.push(elementButton(tableDataQuestions));
            tableData.push(tempData);
            timeCollection.push(entry.timeSpentSeconds);
            correctQuestionsCollection.push(entry.correctAnswers);
            totalQuestionsCollection.push(entry.totalQuestions);
        })
        setTableData(tableDataActual => tableDataActual.concat(tableData));
        setTimeData(timeData => timeData.concat(timeCollection));
        setCorrectQuestionsData(correctQuestionsData => correctQuestionsData.concat(correctQuestionsCollection));
        setTotalQuestionsData(totalQuestionsData => totalQuestionsData.concat(totalQuestionsCollection));
        switch (collection) {
            case 'Addition':
                setTimeDataAddition(timeCollection);
                setCorrectQuestionsDataAddition(correctQuestionsCollection);
                setTotalQuestionsDataAddition(totalQuestionsCollection);
                break;
            case 'Subtraction':
                setTimeDataSubtraction(timeCollection);
                setCorrectQuestionsDataSubtraction(correctQuestionsCollection);
                setTotalQuestionsDataSubtraction(totalQuestionsCollection);
                break;
            case 'Multiplication':
                setTimeDataMultiplication(timeCollection);
                setCorrectQuestionsDataMultiplication(correctQuestionsCollection);
                setTotalQuestionsDataMultiplication(totalQuestionsCollection);
                break;
            case 'Division':
                setTimeDataDivision(timeCollection);
                setCorrectQuestionsDataDivision(correctQuestionsCollection);
                setTotalQuestionsDataDivision(totalQuestionsCollection);
                break;
            case 'TextTask':
                setTimeDataText(timeCollection);
                setCorrectQuestionsDataText(correctQuestionsCollection);
                setTotalQuestionsDataText(totalQuestionsCollection);
                break;
            default:
                console.log(`Invalid equation type ${equationType} provided`);
                break;
        }
    }
    function clearData() {
        setTableData([]);
        setTimeData([]);
        setCorrectQuestionsData([]);
        setTotalQuestionsData([]);
        setTimeDataAddition([]);
        setCorrectQuestionsDataAddition([]);
        setTotalQuestionsDataAddition([]);
        setTimeDataSubtraction([]);
        setCorrectQuestionsDataSubtraction([]);
        setTotalQuestionsDataSubtraction([]);
        setTimeDataMultiplication([]);
        setCorrectQuestionsDataMultiplication([]);
        setTotalQuestionsDataMultiplication([]);
        setTimeDataDivision([]);
        setCorrectQuestionsDataDivision([]);
        setTotalQuestionsDataDivision([]);
        setTimeDataText([]);
        setCorrectQuestionsDataText([]);
        setTotalQuestionsDataText([]);
    }
    function handleStatistics(subject) {
        let subjectTimeData = [];
        let subjectCorrectionQuestionsData = [];
        let subjectTotalQuestions = [];
        switch (subject) {
            case 'Addition':
                subjectTimeData = timeDataAddition;
                subjectCorrectionQuestionsData = correctQuestionsDataAddition;
                subjectTotalQuestions = totalQuestionsDataAddition;
                break;
            case 'Subtraction':
                subjectTimeData = timeDataSubtraction;
                subjectCorrectionQuestionsData = correctQuestionsDataSubtraction;
                subjectTotalQuestions = totalQuestionsDataSubtraction;
                break;
            case 'Multiplication':
                subjectTimeData = timeDataMultiplication;
                subjectCorrectionQuestionsData = correctQuestionsDataMultiplication;
                subjectTotalQuestions = totalQuestionsDataMultiplication;
                break;
            case 'Division':
                subjectTimeData = timeDataDivision;
                subjectCorrectionQuestionsData = correctQuestionsDataDivision;
                subjectTotalQuestions = totalQuestionsDataDivision;
                break;
            case 'Text':
                subjectTimeData = timeDataText;
                subjectCorrectionQuestionsData = correctQuestionsDataText;
                subjectTotalQuestions = totalQuestionsDataText;
                break;
            case 'Overall':
                subjectTimeData = timeData;
                subjectCorrectionQuestionsData = correctQuestionsData;
                subjectTotalQuestions = totalQuestionsData;
                break;
            default:
                console.log(`Invalid equation type ${subject} provided`);
                break;
        }
        const totalTime = subjectTimeData.reduce((prev, next) => prev + next);
        const totalCorrectQuestions = subjectCorrectionQuestionsData.reduce((prev, next) => prev + next);
        const totalQuestions = subjectTotalQuestions.reduce((prev, next) => prev + next);
        const timeMax = Math.max(...subjectTimeData);
        const timeMin = Math.min(...subjectTimeData);
        const questionsIncorrect = totalQuestions - totalCorrectQuestions;
        const correctQuestionRatio = (totalCorrectQuestions / totalQuestions) * 100;
        const averageTime = totalTime / subjectTimeData.length;
        setTime(`${totalTime}s`);
        setCorrectQuestions(totalCorrectQuestions.toString());
        setTotalQuestions(totalQuestions.toString());
        setMaxTime(`${timeMax}s`);
        setMinTime(`${timeMin}s`);
        setIncorrectQuestions(questionsIncorrect.toString());
        setCorrectQuestionsRatio(`${Math.round((correctQuestionRatio + Number.EPSILON) * 100) / 100}%`);
        setAverageTime(`${Math.round((averageTime + Number.EPSILON) * 100) / 100}s`);
      }
    const elementButton = (value) => (
        <TouchableOpacity onPress={() => {setTableDataQuestions(value), setModalVisible(true)}}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Check completed tasks</Text>
          </View>
        </TouchableOpacity>
      );
    const loadStatistics = async () => {
      clearData();
      await getDocs('Addition');
      await getDocs('Subtraction');
      await getDocs('Multiplication');
      await getDocs('Division');
      await getDocs('TextTask');
    }
    return (
        <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.someText}>Choose a student: </Text>
          <Picker
            selectedValue={selectedStudent}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setSelectedStudent(itemValue)}
          >
              <Picker.Item label='' value='default' />
            {usersArr.map(user => <Picker.Item label={`${user?.firstName} ${user?.lastName}`} value={user?.userEmail} />)}
          </Picker>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleSubjects}
            onRequestClose={() => {
              setModalVisibleSubjects(!modalVisibleSubjects);
            }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>See statistics for a subject</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {setStatisticsModalVisible(true), setType('addition'), handleStatistics('Addition')}}
                >
                <Text style={styles.buttonText}>Addition</Text>
                </TouchableOpacity>
                <Text style={styles.modalTextFont}> </Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {setStatisticsModalVisible(true), setType('subtraction'), handleStatistics('Subtraction')}}
                >
                <Text style={styles.buttonText}>Subtraction</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {setStatisticsModalVisible(true), setType('multiplication'), handleStatistics('Multiplication')}}
                >
                <Text style={styles.buttonText}>Multiplication</Text>
                </TouchableOpacity>
                <Text style={styles.modalTextFont}> </Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {setStatisticsModalVisible(true), setType('division'), handleStatistics('Division')}}
                >
                <Text style={styles.buttonText}>Divison</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {setStatisticsModalVisible(true), setType('text'), handleStatistics('Text')}}
                >
                <Text style={styles.buttonText}>Text tasks</Text>
                </TouchableOpacity>
                <Text style={styles.modalTextFont}> </Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {setStatisticsModalVisible(true), setType('all completed'), handleStatistics('Overall')}}
                >
                <Text style={styles.buttonText}>Overall</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={statisticsModalVisible}
            onRequestClose={() => {
              setStatisticsModalVisible(!statisticsModalVisible);
            }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView2}>
              <Text style={styles.modalText}>Overall statistics for {type} tasks</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Total questions: </Text>
                <TextInput
                    value={totalQuestions}
                    style={styles.input}
                    editable={false}
                />
                <Text style={styles.textFont}>Total time spent: </Text>
                <TextInput
                    value={time}
                    style={styles.input}
                    editable={false}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Correct questions: </Text>
                <TextInput
                    value={correctQuestions}
                    style={styles.input}
                    editable={false}
                />
                <Text style={styles.textFont}>Most time spent on a task: </Text>
                <TextInput
                    value={maxTime}
                    style={styles.input}
                    editable={false}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Incorrect questions: </Text>
                <TextInput
                    value={incorrectQuestions}
                    style={styles.input}
                    editable={false}
                />
                <Text style={styles.textFont}>Least time spent on a task: </Text>
                <TextInput
                    value={minTime}
                    style={styles.input}
                    editable={false}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textFont}>Correct answer ratio: </Text>
                <TextInput
                    value={correctQuestionsRatio}
                    style={styles.input}
                    editable={false}
                />
                <Text style={styles.textFont}>Average time spent on a task: </Text>
                <TextInput
                    value={averageTime}
                    style={styles.input}
                    editable={false}
                />
              </View>
            </View>
          </View>
        </Modal>


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
            <View style={styles.modalView2}>
            <Text style={styles.modalText}>Detailed information about the questions completed</Text>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Row data={tableHeadQuestions} widthArr={widthArrQuestions} style={styles.head} textStyle={styles.text}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1}}>
                  <TableWrapper style={styles.wrapper}>
                    <Col data={tableQuestionsTitle} style={styles.title} textStyle={styles.text}/>
                    <Rows data={tableDataQuestions} widthArr={[100, 100, 100, 100, 100, 100]} style={styles.row} textStyle={styles.text}/>
                  </TableWrapper>
                </Table>
                </ScrollView>
              </View>
            </ScrollView>
            </View>
            </View>
        </Modal>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Rows data={tableDataActual} widthArr={widthArr} textStyle={styles.text}/>
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
              onPress={loadStatistics}
              style={styles.button}
          >
              <Text style={styles.buttonText}>Load statistics</Text>
          </TouchableOpacity>
          <Text style={styles.modalTextFont}> </Text>
          <TouchableOpacity
              onPress={() => setModalVisibleSubjects(true)}
              style={styles.button}
          >
              <Text style={styles.buttonText}>Check statistics</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}

export default StudentStatisticsScreen

const styles = StyleSheet.create({
    btn: { backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' },
    container3: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center' },
    dataWrapper: { marginTop: -1 },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    someText: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 0,
    },
    modalText: {
      marginBottom: 10,
      textAlign: "center",
      fontWeight: '700',
      fontSize: 16,
    },
    modalView2: {
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
      elevation: 5,
      height: 370
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
      elevation: 5,
    },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    container2: {
      paddingTop: 100,
      paddingHorizontal: 30,
    },
    modalButton: {
        backgroundColor: 'blue',
        width: 130,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center",
        fontWeight: '700',
        fontSize: 16,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    container2: {
      flex: 1
    },
    inputContainer: {
      width: '80%'
    },
    tinyLogo: {
        width: 80,
        height: 80,
    },
    input: {
      width: 76,
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
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
      width: '45%',
      height: '90%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 5
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: 'blue',
      borderWidth: 2
    },
    buttonText: {
      textAlign: 'center',
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
      textAlign: 'left',
      textAlignVertical: 'center',
      marginTop: 0,
    },
  })