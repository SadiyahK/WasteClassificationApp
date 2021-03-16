import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import firebase from '../database/firebase';
import stylesheet from '../styles/stylesheet.js'


export default class SigninScreen extends Component {
  
  constructor() {
    super();
    this.state = { 
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

  userLogin = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to sign in!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        console.log(res)
        console.log('User signed in successfully!')
        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Profile')
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
            <ImageBackground
            style={stylesheet.imageContainer}
            source={require('../assets/recycle.jpg')}>
            <View style={stylesheet.container}>  
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
                <TouchableOpacity onPress={() => this.userLogin()} style={stylesheet.appButtonContainer}>
                    <Text style={ stylesheet.button } onPress={() => this.userLogin()}>Sign In</Text>
                </TouchableOpacity>
                <Text style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('Signup')}>
                    Don't have an account? Click here to sign up
                </Text>
                <Text style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('ResetPassword')}>
                    Forgot your password? Reset here
                </Text>                           
                </View>
            </ImageBackground>                       
      </View>
    );
  }
}