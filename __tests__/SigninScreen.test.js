import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'

import SigninScreen from '../screens/SigninScreen';
import { Alert } from 'react-native'

//mock alert
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

//mock firebase
jest.mock('firebase', () => {
    return {
    initializeApp: jest.fn(),
    auth: () => ({
        signInWithEmailAndPassword: () => Promise.resolve(),
      }),
    };
  });

it("renders default elements", () =>{
    const { getAllByText, getByPlaceholderText } = render(<SigninScreen />)

    expect(getAllByText("Sign In").length).toBe(1)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Email")
    getByPlaceholderText("Password")
})

it("shows invalid input message", ()=>{
    const { getByTestId, getByText } = render(<SigninScreen />)

    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only password input", ()=>{
    const { getByTestId, getByText } = render(<SigninScreen />)

    fireEvent.changeText(getByTestId("signIn.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only email input", ()=>{
    const { getByTestId, getByText } = render(<SigninScreen />)

    fireEvent.changeText(getByTestId("signIn.EmailInput"), 'test123@hotmail.com')
    fireEvent.press(getByTestId("signIn.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("handles valid input", async () => {

    const navigationMock = jest.fn()

    const { getByTestId, getByText } = render(<SigninScreen navigation={{ navigate: navigationMock}} />)
    fireEvent.changeText(getByTestId("signIn.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signIn.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signIn.Button"))

    await act(() => new Promise((resolve) => setImmediate(resolve)))
    expect(navigationMock).toBeCalledWith('Profile')
})

it("navigate to signup", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SigninScreen navigation={{ navigate: navigationMock}} />)

    fireEvent.press(getByTestId("signIn.signUpLink"))
    expect(navigationMock).toBeCalledWith('Signup')
})

it("navigate to reset password", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SigninScreen navigation={{ navigate: navigationMock}} />)

    fireEvent.press(getByTestId("signIn.forgotPasswordLink"))
    expect(navigationMock).toBeCalledWith('ResetPassword')
})

//should I check that it updates the state when a value is input
// check that when invalid data is given, an alert appears ?