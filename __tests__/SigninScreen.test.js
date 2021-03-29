/**
 * Test Class for SignInScreen.js
*/
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'

import SignInScreen from '../src/containers/screens/SignInScreen';
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

// mock firebase
// code inspired by Ilan Roitlender's comment on Jul 25 2020 at 18:35:
// https://stackoverflow.com/questions/61358076/is-there-a-way-to-mock-firebase-modules-in-jest 
jest.mock('firebase', () => {
    return {
    initializeApp: jest.fn(),
    auth: () => ({
        signInWithEmailAndPassword: () => Promise.resolve(),
      }),
    };
  });


it("given Sign In screen renders, render should show sign in button", () =>{
    const { getAllByText } = render(<SignInScreen />)

    expect(getAllByText("Sign In").length).toBe(1)
})

it("given Sign In screen renders, render should show empty email input field", () =>{
    const { getByPlaceholderText } = render(<SignInScreen />)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Email")
})

it("given Sign In screen renders, render should show empty password input field", () =>{
    const { getAllByText, getByPlaceholderText } = render(<SignInScreen />)

    expect(getAllByText("Sign In").length).toBe(1)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Password")
})

it("given no input data, onSignInClick should return an alert box", ()=>{
    const { getByTestId } = render(<SignInScreen />)

    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign in!")
})

it("given only email as input data, onSignInClick should return an alert box", ()=>{
    const { getByTestId } = render(<SignInScreen />)

    fireEvent.changeText(getByTestId("signIn.EmailInput"), 'test123@hotmail.com')
    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign in!")
})

it("given only password as input data, onSignInClick should return an alert box", ()=>{
    const { getByTestId } = render(<SignInScreen />)

    fireEvent.changeText(getByTestId("signIn.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalledWith("Enter details to sign in!")
})

it("given valid email and password, onSignInClick should sign user in", async () => {
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignInScreen navigation={{ replace: navigationMock}} />)

    fireEvent.changeText(getByTestId("signIn.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signIn.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signIn.Button"))

    await act(() => new Promise((resolve) => setImmediate(resolve)))
    expect(navigationMock).toBeCalledWith('Profile')
})

it("given invalid account data, onSignInClick should display alert", async () => {
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignInScreen navigation={{ replace: navigationMock}} />)

    fireEvent.changeText(getByTestId("signIn.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signIn.PasswordInput"), 'testjhkjgj123')
    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("navigate to signup", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignInScreen navigation={{ replace: navigationMock}} />)

    fireEvent.press(getByTestId("signIn.signUpLink"))
    expect(navigationMock).toBeCalledWith('SignUp')
})

it("given reset password link clicked, should navigate to Reset Password screen", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignInScreen navigation={{ navigate: navigationMock}} />)

    fireEvent.press(getByTestId("signIn.forgotPasswordLink"))
    expect(navigationMock).toBeCalledWith('ResetPassword')
})