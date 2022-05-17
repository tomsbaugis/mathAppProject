import { LogBox, StyleSheet, Text, TouchableOpacity, View, Modal, Image, TextInput, ScrollView  } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as firebase from "firebase";
import "firebase/firestore";
import Intl from "intl";
import 'intl/locale-data/jsonp/en-GB'
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
LogBox.ignoreAllLogs();
const AdditionStatisticsScreen = () => {
    const navigation = useNavigation();
    const firestoreDb = firebase.firestore();
    const currentUserEmail = auth.currentUser?.email;
    const [entries, setEntries] = useState();
    const [tableHead, setTableHead] = useState(['Date completed', 'Total equations\ncompleted', 'Correct answers', 'Incorrect answers', 'Mark', 'Time spent\n(in seconds)', 'Equations completed']);
    const [tableHeadQuestions, setTableHeadQuestions] = useState(['', 'First number', 'Equation', 'Second number', 'Your input', 'Actual result', 'Answered correctly']);
    const [tableQuestionsTitle] = useState(['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5']);
    const [widthArr] = useState([100, 100, 100, 100, 100, 100, 100]);
    const [tableData, setTableData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [correctQuestionsData, setCorrectQuestionsData] = useState([]);
    const [totalQuestionsData, setTotalQuestionsData] = useState([]);
    const [tableDataQuestions, setTableDataQuestions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);
    const [time, setTime] = useState();
    const [correctQuestions, setCorrectQuestions] = useState();
    const [totalQuestions, setTotalQuestions] = useState();
    const [maxTime, setMaxTime] = useState();
    const [minTime, setMinTime] = useState();
    const [incorrectQuestions, setIncorrectQuestions] = useState();
    const [correctQuestionsRatio, setCorrectQuestionsRatio] = useState();
    const [averageTime, setAverageTime] = useState();
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
          loadStatistics();
          // handleStatistics();
      });
  
      return () => {
        unsubscribe;
      };
    }, [navigation]);

    async function getDocs() {
        let result = [];
        const docsRef = firestoreDb.collection('Addition');
        const snapshot = await docsRef.where('studentEmail', '==', currentUserEmail).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            result.push(doc.data());
        });
        return result;
    }
    const elementButton = (value) => (
      <TouchableOpacity onPress={() => {setTableDataQuestions(value), setModalVisible(true)}}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Check completed tasks</Text>
        </View>
      </TouchableOpacity>
    );
    const loadStatistics = async () => {
        const docEntries = await getDocs();
        let tableData = [];
        let timeCollection = [];
        let correctQuestionsCollection = [];
        let totalQuestionsCollection = [];
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        docEntries.forEach(entry => {
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
          console.log(new Intl.DateTimeFormat('en-GB', options).format(dateCompleted));
          tempData.push(dateString);
          tempData.push(entry.totalQuestions);
          tempData.push(entry.correctAnswers);
          tempData.push(incorrectAnswers);
          tempData.push(`${Math.round((correctAnswerRatio + Number.EPSILON) * 100) / 100}%`);
          tempData.push(entry.timeSpentSeconds);
          tempData.push(elementButton(tableDataQuestions));
          tableData.push(tempData);
          timeCollection.push(entry.timeSpentSeconds);
          correctQuestionsCollection.push(entry.correctAnswers);
          totalQuestionsCollection.push(entry.totalQuestions);
        })
        setTableData(tableData);
        setTimeData(timeCollection);
        setCorrectQuestionsData(correctQuestionsCollection);
        setTotalQuestionsData(totalQuestionsCollection);
    }

    function handleStatistics() {
      const totalTime = timeData.reduce((prev, next) => prev + next);
      const totalCorrectQuestions = correctQuestionsData.reduce((prev, next) => prev + next);
      const totalQuestions = totalQuestionsData.reduce((prev, next) => prev + next);
      const timeMax = Math.max(...timeData);
      const timeMin = Math.min(...timeData);
      const questionsIncorrect = totalQuestions - totalCorrectQuestions;
      const correctQuestionRatio = (totalCorrectQuestions / totalQuestions) * 100;
      const averageTime = totalTime / timeData.length;
      setTime(`${totalTime}s`);
      setCorrectQuestions(totalCorrectQuestions.toString());
      setTotalQuestions(totalQuestions.toString());
      setMaxTime(`${timeMax}s`);
      setMinTime(`${timeMin}s`);
      setIncorrectQuestions(questionsIncorrect.toString());
      setCorrectQuestionsRatio(`${Math.round((correctQuestionRatio + Number.EPSILON) * 100) / 100}%`);
      setAverageTime(`${Math.round((averageTime + Number.EPSILON) * 100) / 100}s`);
    }

    return (
    <View style={styles.container3}>
        <Text style={styles.modalText}>Overall data for addition tasks</Text>
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
                  <Row data={tableHeadQuestions} widthArr={widthArr} style={styles.head} textStyle={styles.text}/>
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={statisticsModalVisible}
            onRequestClose={() => {
              setStatisticsModalVisible(!statisticsModalVisible);
            }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Overall statistics for addition tasks</Text>
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
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Rows data={tableData} widthArr={widthArr} textStyle={styles.text}/>
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <TouchableOpacity
            onPress={() => {handleStatistics(), setStatisticsModalVisible(true)}}
            style={styles.button}
        >
            <Text style={styles.buttonText}>Check statistics</Text>
        </TouchableOpacity>
    </View>
    )
}

export default AdditionStatisticsScreen

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
    textAlign: 'left',
    textAlignVertical: 'center',
    marginTop: 0,
  },
})