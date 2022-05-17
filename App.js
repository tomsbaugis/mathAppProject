import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdditionScreen from './screens/AdditionScreen';
import ProfileScreen from './screens/ProfileScreen';
import UpdateProfileScreen from './screens/UpdateProfileScreen';
import AdditionStatisticsScreen from './screens/AdditionStatisticsScreen';
import TextTaskScreen from './screens/TextTaskScreen';
import StudentStatisticsScreen from './screens/StudentStatisticsScreen';
import SubtractionScreen from './screens/SubractionScreen';
import MultiplicationScreen from './screens/MultiplicationScreen';
import DivisionScreen from './screens/DivisionScreen';
import SubtractionStatisticsScreen from './screens/SubtractionStatisticsScreen';
import MultiplicationStatisticsScreen from './screens/MultiplicationStatisticsScreen';
import DivisionStatisticsScreen from './screens/DivisionStatisticsScreen';
import TextTaskStatisticsScreen from './screens/TextTaskStatisticsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Addition" component={AdditionScreen} />
        <Stack.Screen name="Subtraction" component={SubtractionScreen} />
        <Stack.Screen name="Multiplication" component={MultiplicationScreen} />
        <Stack.Screen name="Division" component={DivisionScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Update Profile" component={UpdateProfileScreen} />
        <Stack.Screen name="Addition Statistics" component={AdditionStatisticsScreen} />
        <Stack.Screen name="Subtraction Statistics" component={SubtractionStatisticsScreen} />
        <Stack.Screen name="Multiplication Statistics" component={MultiplicationStatisticsScreen} />
        <Stack.Screen name="Division Statistics" component={DivisionStatisticsScreen} />
        <Stack.Screen name="Text Task Statistics" component={TextTaskStatisticsScreen} />
        <Stack.Screen name="Text Tasks" component={TextTaskScreen} />
        <Stack.Screen name="Student Statistics" component={StudentStatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
