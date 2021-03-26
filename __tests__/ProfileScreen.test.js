import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'

import ProfileScreen from '../src/containers/screens/ProfileScreen';

//mock firebase
jest.mock('firebase', () => {
    return {
    initializeApp: jest.fn(),
    auth: () => ({
        signInWithEmailAndPassword: () => Promise.resolve(),
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
    const { getAllByText, getByPlaceholderText } = render(<ProfileScreen />)

    expect(getAllByText("Sign Out").length).toBe(1)
    expect(getAllByText("Name: testDisplayName").length).toBe(1)
    expect(getAllByText("Email: test@test.com").length).toBe(1)
    expect(getAllByText("Password: **********").length).toBe(1)
})

it("navigate to reset password", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<ProfileScreen navigation={{ navigate: navigationMock}} />)

    fireEvent.press(getByTestId("profile.forgotPasswordLink"))
    expect(navigationMock).toBeCalledWith('ResetPassword')
})

it("Navigate to SignIn", async ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<ProfileScreen navigation={{ replace: navigationMock}} />)

    fireEvent.press(getByTestId("profile.signOutButton"))

    await act(() => new Promise((resolve) => setImmediate(resolve)))
    expect(navigationMock).toBeCalledWith('SignIn')
})