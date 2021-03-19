/**
 * SigninScreen: Handles user authentication of existing users.
 */
import React, { Component } from 'react';
import {Text, View, TextInput, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import firebase from '../database/firebase';
import stylesheet from '../styles/stylesheet.js'

export default class SigninScreen extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      isLoading: false,
      password: ''
    }
  }

  // Take each input from each field and store
  // it in the appropriate placeholder.
  onTextInput = (textInput, prop) => {
    const state = this.state;
    state[prop] = textInput;
    this.setState(state);
  }

  // Handles communication with Firebase to 
  // confirm user details and navigate to profile.
  onSignInClick = () => {
    if(this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter details to sign in!')
    } else {
      this.setState({ isLoading: true })
      //firebase communication
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        console.log('sign in successful')
        this.setState({ email: '', password: '', isLoading: false })
        this.props.navigation.navigate('Profile') // navigate to user's profile
      })
      .catch(error => Alert.alert('An error occurred. Please try again later.'))
    }
  }

  render() {
    // If authentication is in progress...
    if(this.state.isLoading){
      return(
        <View style={stylesheet.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    } 

    // Otherwise, show sign in
    return (
        <View>
          {/* Top Icon */}
          <View style={stylesheet.topContainer}>
            <Image source={require('../assets/p-trans.png')} style={stylesheet.imageIcon}/>
          </View>
          {/* Input fields */}
          <View style={stylesheet.container}>
            <TextInput
              style={stylesheet.inputStyle}
              placeholder="Email"
              placeholderTextColor= '#fff'
              value={this.state.email}
              onChangeText={(val) => this.onTextInput(val, 'email')}
            />
            <TextInput
              style={stylesheet.inputStyle}
              placeholder="Password"
              placeholderTextColor= '#fff'
              value={this.state.password}
              onChangeText={(val) => this.onTextInput(val, 'password')}
              maxLength={15}
              secureTextEntry={true}
            />
            {/* navigation options: sign in, sign up or reset password */}
            <TouchableOpacity onPress={() => this.onSignInClick()} style={stylesheet.appButtonContainer}>
              <Text style={ stylesheet.button } onPress={() => this.onSignInClick()}>Sign In</Text>
            </TouchableOpacity>
            <Text style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('Signup')}>
                Don't have an account? Click here to sign up
            </Text>
            <Text style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('ResetPassword')}>
                Forgot your password? Reset here
            </Text>                          
          </View>
      </View>
    );
  }
}