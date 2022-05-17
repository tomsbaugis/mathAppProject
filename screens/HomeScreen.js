import { LogBox, Modal, Alert, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useEffect }from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native';
import * as firebase from "firebase";
import "firebase/firestore";
LogBox.ignoreAllLogs();
const HomeScreen = () => {

  const currentUserEmail = auth.currentUser?.email;
  const navigation = useNavigation();
  const firestoreDb = firebase.firestore();
  const [modalVisible, setModalVisible] = useState(false);
  const [isTeacher, setIsTeacher] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [displayName, setDisplayName] = useState()

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
        setIsTeacher();
        const user = await getUser();
        console.log(user);
        setFirstName(user?.firstName);
        setLastName(user?.lastName);
        setIsTeacher(user?.isTeacher);
      });
      if (typeof firstName !== 'undefined' && typeof lastName !== 'undefined') {
        setDisplayName(`${firstName} ${lastName}`);
      } else {
        setDisplayName('User');
      }
      return () => {
        unsubscribe;
      };
  }, [navigation]);
  const handleSignout = () => {
    auth.signOut().then(() => {
      navigation.navigate('Login');
    })
  }
  const handleAdditionScreen = () => {
    navigation.navigate('Addition');
    setModalVisible(!modalVisible);
  }
  const handleSubtractionScreen = () => {
    navigation.navigate('Subtraction');
    setModalVisible(!modalVisible);
  }
  const handleMultiplicationScreen = () => {
    navigation.navigate('Multiplication');
    setModalVisible(!modalVisible);
  }
  const handleDivisionScreen = () => {
    navigation.navigate('Division');
    setModalVisible(!modalVisible);
  }
  const handleTextTaskScreen = () => {
    navigation.navigate('Text Tasks');
    setModalVisible(!modalVisible);
  }
  const handleStudentStatisticsScreen = () => {
    navigation.navigate('Student Statistics');
  }
  const handleProfileScreen = () => {
    navigation.navigate('Profile');
  }
  const renderStudentElement = () => (
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      style={styles.button}
    >
      <Text style={styles.buttonText}>Tasks</Text>
    </TouchableOpacity>
  );
  function checkIsTeacher() {
    if (typeof isTeacher !== 'undefined' && !isTeacher) {
      return renderStudentElement();
    } else if(typeof isTeacher !== 'undefined' && isTeacher) {
      return renderTeacherElement();
    }
  }
  const renderTeacherElement = () => (
    <TouchableOpacity
      onPress={handleStudentStatisticsScreen}
      style={styles.button}
    >
      <Text style={styles.buttonText}>Statistics page</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('../images/logo3.png')}
      />
      <Text style={styles.someText}>Hello, {displayName}!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleProfileScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Profile page</Text>
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
              <Text style={styles.modalText}>Available tasks and subjects</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleAdditionScreen}
                >
                <Text style={styles.buttonText}>Addition</Text>
                </TouchableOpacity>
                <Text style={styles.textFont}> </Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleSubtractionScreen}
                >
                <Text style={styles.buttonText}>Subtraction</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleMultiplicationScreen}
                >
                <Text style={styles.buttonText}>Multiplication</Text>
                </TouchableOpacity>
                <Text style={styles.textFont}> </Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleDivisionScreen}
                >
                <Text style={styles.buttonText}>Divison</Text>
                </TouchableOpacity>
              </View>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleTextTaskScreen}
                >
                <Text style={styles.buttonText}>Text tasks</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {
          checkIsTeacher()
        }

        <TouchableOpacity
          onPress={handleSignout}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
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
  },
  modalButton: {
    backgroundColor: 'blue',
    width: 130,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5
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
  tinyLogo: {
    width: 200,
    height: 200,
  },
  buttonOutlineText: {
    color: 'blue',
    fontWeight: '700',
    fontSize: 16,  
  },
})