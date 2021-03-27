/**
 * SignupScreen: Handles user authentication of new users.
 */
import React, { Component } from 'react';
import {Text, View, TextInput, Alert, ActivityIndicator, TouchableOpacity, Image} from 'react-native';
import firebase from '../../database/Firebase';
import stylesheet from '../../styles/stylesheet.js'

export default class SignupScreen extends Component {
  
  constructor() {
    super();
    this.state = { 
      password: '',
      isLoading: false,
      displayName: '',
      email: '', 
    }
  }

  // Take each input from each field and store
  // it in the appropriate placeholder.
  onTextInput = (inputText, prop) => {
    const state = this.state;
    state[prop] = inputText;
    this.setState(state);
  }

  // Handles user authentication after user has entered details for every textbox. 
  // Communicates with firebase to create account and navigates to sign-in screen.
  onSignUpClick = () => {
    // Validate input
    if(this.state.email === '' || this.state.password === '' || this.state.displayName === '') {
      Alert.alert('Enter details to sign up!')
    } 
    else if(this.state.password.length < 8 || !(/\d/.test(this.state.password))){
      Alert.alert('Password must be at least 8 characters and contain a number')
    }
    else {
      this.setState({ isLoading: true })
      // Communicate with firebase
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({ displayName: this.state.displayName })
        firebase.auth().signOut() 
        console.log('User registered successfully!')
        this.setState({ email: '', isLoading: false, password: '', displayName: '' })
        // If successful...
        this.props.navigation.replace('SignIn')
        Alert.alert('Sign Up Successful!') })
      .catch(error =>{
        this.setState({ email: '', isLoading: false, password: '', displayName: '' })
        this.props.navigation.replace('SignUp')
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
    // otherwise, allow user to sign up   
    return (
    <View style={stylesheet.outerContainer}>
      {/* Top Icon display */}
      <View style={stylesheet.topContainer}>
        <Image source={require('../../assets/recycle-leaf.png')} style={stylesheet.imageIcon}/>
      </View>
      {/* UI for input fields */}
      <View style={stylesheet.greyContainer}>
        <TextInput
          testID="signUp.NameInput"
          style={stylesheet.inputStyle}
          placeholder="Name"
          placeholderTextColor= '#fff'
          value={this.state.displayName}
          onChangeText={(val) => this.onTextInput(val, 'displayName')}
        />  
        <TextInput
          testID="signUp.EmailInput"
          style={stylesheet.inputStyle}
          placeholder="Email"
          placeholderTextColor= '#fff'
          value={this.state.email}
          onChangeText={(val) => this.onTextInput(val, 'email')}
        />
        <TextInput
          testID="signUp.PasswordInput"
          style={stylesheet.inputStyle}
          placeholder="Password"
          placeholderTextColor= '#fff'
          value={this.state.password}
          onChangeText={(val) => this.onTextInput(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />  
        {/* Navigation options: sign up and sign in */}
        <TouchableOpacity testID="signUp.Button" onPress={() => this.onSignUpClick()} style={stylesheet.appButtonContainer}>
          <Text style={ stylesheet.button } onPress={() => this.onSignUpClick()}>Sign Up</Text>
        </TouchableOpacity>
        <Text testID ="signUp.signInLink" style={stylesheet.loginText} onPress={() => this.props.navigation.replace('SignIn')}>
          Already Registered? Click here to sign in
        </Text>  
      </View>
    </View>
    );
  }

}