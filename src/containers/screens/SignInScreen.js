/**
 * SigninScreen: Handles user authentication of existing users.
 */
import React, { Component } from 'react';
import {Text, View, TextInput, Alert, ActivityIndicator, TouchableOpacity, Image, key } from 'react-native';
import firebase from '../../database/Firebase';
import stylesheet from '../../styles/stylesheet.js'

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
      .then(() => {
        console.log('sign in successful')
        this.setState({ email: '', password: '', isLoading: false })
        this.props.navigation.replace('Profile') // navigate to user's profile
      })
      .catch(error => 
        {
          this.setState({ email: '', password: '', isLoading: false })
          this.props.navigation.replace('SignIn')
          Alert.alert(error.message)
        }
      )
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
        <View style={stylesheet.outerContainer}>
          {/* Top Icon */}
          <View style={stylesheet.topContainer}>
            <Image source={require('../../assets/recycle-leaf.png')} style={stylesheet.imageIcon}/>
          </View>
          {/* Input fields */}
          <View style={stylesheet.greyContainer}>
            <TextInput
              testID="signIn.EmailInput"
              style={stylesheet.inputStyle}
              placeholder="Email"
              placeholderTextColor= '#fff'
              value={this.state.email}
              onChangeText={(val) => this.onTextInput(val, 'email')}
            />
            <TextInput
              testID="signIn.PasswordInput"
              style={stylesheet.inputStyle}
              placeholder="Password"
              placeholderTextColor= '#fff'
              value={this.state.password}
              onChangeText={(val) => this.onTextInput(val, 'password')}
              maxLength={15}
              secureTextEntry={true}
            />
            {/* navigation options: sign in, sign up or reset password */}
            <TouchableOpacity testID="signIn.Button"onPress={() => this.onSignInClick()} style={stylesheet.appButtonContainer}>
              <Text style={ stylesheet.button } onPress={() => this.onSignInClick()}>Sign In</Text>
            </TouchableOpacity>
            <Text testID="signIn.signUpLink" style={stylesheet.loginText} onPress={() => this.props.navigation.replace('SignUp')}>
                Don't have an account? Click here to sign up
            </Text>
            <Text testID="signIn.forgotPasswordLink" style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('ResetPassword')}>
                Forgot your password? Reset here
            </Text>                          
          </View>
      </View>
    );
  }
}