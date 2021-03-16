import React, { Component } from 'react';
import {View, StyleSheet, Text, StatusBar, Button, TextInput, Alert } from 'react-native';
import firebase from '../database/firebase';

export default class ResetPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
        };
    }

    onResetPasswordPress = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert("Password reset email has been sent.");
                this.setState({ email: ""})
            }, (error) => {
                Alert.alert(error.message);
            });
    }

    render() {
        return (
            <View style={{paddingTop:50, alignItems:"center"}}>
                <Text>Forgot Password</Text>
                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({email: text}) }}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Button title="Reset Password" onPress={this.onResetPasswordPress} />
                <Button title="Go Back" onPress={() => this.props.navigation.goBack(null)} /> 
                {/* onPress={() => this.props.navigation.navigate('Signin')} */}
            </View>
        );
    }
}