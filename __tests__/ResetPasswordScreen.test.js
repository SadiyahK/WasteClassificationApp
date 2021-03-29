/**
 * Test Class for ResetPasswordScreen.js
*/
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'

import ResetPasswordScreen from '../src/containers/screens/ResetPasswordScreen';
import { Alert } from 'react-native'

//mock alert
// taken from the comment Fossage left on 26 Sep 2019 on this post:
// https://github.com/facebook/react-native/issues/26579 
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
        sendPasswordResetEmail: () => Promise.resolve(),
        currentUser: {
            displayName: 'testDisplayName',
            email: 'test@test.com',
            uid: '1234567'
          },
          signOut: () => Promise.resolve(),
      }),
    };
  });


it("given Reset Password Screen renders, render should show reset password button", () =>{
    const { getAllByText } = render(<ResetPasswordScreen />)
    expect(getAllByText("Reset Password").length).toBe(1)
})

it("given Reset Password Screen renders, render should show email text field", () =>{
    const { getByPlaceholderText } = render(<ResetPasswordScreen />)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Email")
})

it("given reset password button clicked with valid email, onResetPasswordClick displays positive alert", async () => {

    const { getByTestId, getByText } = render(<ResetPasswordScreen />)
    fireEvent.changeText(getByTestId("reset.EmailInput"), 'test123@hotmail.com')
    fireEvent.press(getByTestId("reset.Button"))

    await act(() => new Promise((resolve) => setImmediate(resolve)))
    expect(Alert.alert).toHaveBeenCalledWith("Password reset email has been sent. Please check your spam box.")
})

it("given reset password button clicked with invalid email, onResetPasswordClick displays negative alert", async () => {

    const { getByTestId, getByText } = render(<ResetPasswordScreen />)
    fireEvent.press(getByTestId("reset.Button"))

    await act(() => new Promise((resolve) => setImmediate(resolve)))
    expect(Alert.alert).toHaveBeenCalledWith("Please enter an email address to send the reset password email to.")
})