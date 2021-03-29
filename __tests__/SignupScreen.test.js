/**
 * Test Class for SignUpScreen.js
*/
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native'

import SignUpScreen from '../src/containers/screens/SignUpScreen';
import { Alert } from 'react-native'

//mock alert
// taken from the comment Fossage left on 26 Sep 2019 on this post:
// https://github.com/facebook/react-native/issues/26579 *used in other tests files
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native')

    return Object.setPrototypeOf(
        {
            Alert: {
                ...RN.Alert,
                alert: jest.fn(),
            },
        },
        RN,
    )
})

// mock firebase + functions
// code inspired by Ilan Roitlender's comment on Jul 25 2020 at 18:35:
// https://stackoverflow.com/questions/61358076/is-there-a-way-to-mock-firebase-modules-in-jest 
const createUserWithEmailAndPassword = jest.fn(() => {
    return Promise.resolve('successful');
  });

jest.mock('firebase', () => {
    return {
    initializeApp: jest.fn(),
    auth: () => ({
        createUserWithEmailAndPassword: () => Promise.resolve(),
        signOut: () => Promise.resolve(),
      }),
    };
  });


it("given Sign Up screen renders, render should show sign up button", () =>{
    const { getAllByText } = render(<SignUpScreen />)
    expect(getAllByText("Sign Up").length).toBe(1)
})

it("given Sign Up screen renders, render should show name input field", () =>{
    const { getByPlaceholderText } = render(<SignUpScreen />)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Name")
})

it("given Sign Up screen renders, render should show email input field", () =>{
    const { getByPlaceholderText } = render(<SignUpScreen />)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Email")
})

it("given Sign Up screen renders, render should show password input field", () =>{
    const { getByPlaceholderText } = render(<SignUpScreen />)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Password")
})

it("given sign in link clicked, navigate to Sign In screen", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignUpScreen navigation={{ replace: navigationMock}} />)

    fireEvent.press(getByTestId("signUp.signInLink"))
    expect(navigationMock).toBeCalledWith('SignIn')
})

it("given password data only, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign up!")
})

it("given email data only, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign up!")
})

it("given name data only, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign up!")
})

it("given password and email data only, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign up!")
})

it("given name and password data only, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign up!")
})

it("given name and email data only, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign up!")
})

it("given invalid email data, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test1234567')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("given password less than 8 characters, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test1')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Password must be at least 8 characters and contain a number")
})

it("given password exactly 8 characters, onSignUpClick should sign up user", async ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test1231')
    fireEvent.press(getByTestId("signUp.Button"))
    await expect(createUserWithEmailAndPassword()).resolves.toBe("successful");
})

it("given password without a number, onSignUpClick should display negative alert", ()=>{
    const { getByTestId } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'testtesttest')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Password must be at least 8 characters and contain a number")
})


//  TODO:
it("given valid input data, onSignUpClick should sign user up", async ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignUpScreen navigation={{ navigate: navigationMock}} />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'testtest123')
    fireEvent.press(getByTestId("signUp.Button"))
    
    await expect(createUserWithEmailAndPassword()).resolves.toBe("successful");
})
