import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'

import ResetPasswordScreen from '../src/containers/screens/ResetPasswordScreen';
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

it("renders default elements", () =>{
    const { getAllByText, getByPlaceholderText } = render(<ResetPasswordScreen />)

    expect(getAllByText("Reset Password").length).toBe(1)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Email")
})

it("handles valid input", async () => {

    const { getByTestId, getByText } = render(<ResetPasswordScreen />)
    fireEvent.changeText(getByTestId("reset.EmailInput"), 'test123@hotmail.com')
    fireEvent.press(getByTestId("reset.Button"))

    await act(() => new Promise((resolve) => setImmediate(resolve)))
    expect(Alert.alert).toHaveBeenCalled()
})

// it("check text changes", () =>{
//     const { getAllByText, getByTestId } = render(<ResetPasswordScreen />)

//     fireEvent.changeText(getByTestId("reset.EmailInput"), 'test123@hotmail.com')
//     expect(getAllByText("test123@hotmail.com").length).toBe(1)
// })


//what happens if they press reset without entering something?
// Should i check that if user inputs something then the text is updated?