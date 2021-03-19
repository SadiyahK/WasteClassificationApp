import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity , ImageBackground, Image} from 'react-native';
import firebase from '../database/firebase';
import stylesheet from '../styles/stylesheet.js'

export default class SignupScreen extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    if(this.state.email === '' || this.state.password === '' || this.state.displayName === '') {
      Alert.alert('Enter details to signup!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName
        })
        firebase.auth().signOut() 
        console.log('User registered successfully!')
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Signin')
        Alert.alert('Sign Up Successful!')
      })
      .catch(error => this.setState({ errorMessage: error.message }))      
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={stylesheet.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
    <View>
    <View style={stylesheet.topContainer}>
      <Image source={require('../assets/p-trans.png')} style={stylesheet.imageIcon}/>
    </View>
        <View style={stylesheet.container}>
            <TextInput
                style={stylesheet.inputStyle}
                placeholder="Name"
                placeholderTextColor= '#fff'
                value={this.state.displayName}
                onChangeText={(val) => this.updateInputVal(val, 'displayName')}
            />      
            <TextInput
                style={stylesheet.inputStyle}
                placeholder="Email"
                placeholderTextColor= '#fff'
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, 'email')}
            />
            <TextInput
                style={stylesheet.inputStyle}
                placeholder="Password"
                placeholderTextColor= '#fff'
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={true}
            />   
            <TouchableOpacity onPress={() => this.registerUser()} style={stylesheet.appButtonContainer}>
                <Text style={ stylesheet.button } onPress={() => this.registerUser()}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('Signin')}>
                Already Registered? Click here to sign in
            </Text>  
        </View>
      </View>
    );
  }
}