import React, { Text } from 'react';
import { render, fireEvent } from '@testing-library/react-native'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ClassifierScreen from '../screens/ClassifierScreen';
import { Alert } from 'react-native'
import { shallow } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

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

it("renders default elements", () =>{
    const { getAllByText } = render(<ClassifierScreen />)

    expect(getAllByText("Reset").length).toBe(1)
    expect(getAllByText("Once the model has loaded tap the green box to take a picture to classify!").length).toBe(1)
    expect(getAllByText("Waiting for Model to Load").length).toBe(1)
})

it("alert appears when model is not ready", () =>{
    const { getAllByText, getByTestId } = render(<ClassifierScreen />)
    fireEvent.press(getByTestId("classifier.CameraDisplay"))
    expect(Alert.alert).toHaveBeenCalled()
})


const timeout = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

  
  const initialState = {
    isTfReady: true,
    isModelReady: true,
    predictions: "0.002",
    image: null,
    results: null,
  };

  describe("Classifier", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ClassifierScreen  />);
        wrapper.setState({ ...initialState });
    });

    afterAll(() => {
        wrapper.unmount();
     });

     it("check text changes once model has loaded", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
    })
    
    it("check predictions are displayed once the state is updated", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Most Likely:</Text>))
        expect(wrapper.containsMatchingElement(<Text>Probability:</Text>))
    })

    it("check reset button clears predictions and image", async () =>{
        wrapper.find('Text').at(3).simulate('click');
        expect(wrapper.containsMatchingElement(<Text>Predictions:   </Text>))
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
    })

    it("check reset button clears predictions and image", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
        wrapper.find('Text').at(1).simulate('click');
        expect(!wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
    })
  })

// check if i tap then the camera opens... kinda done
// check camera permissions? hmm how?


