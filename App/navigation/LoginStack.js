import React from 'react';
import {
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Initial from '../screens/Login/Initial';
import ForgotPassword from '../screens/Login/ForgotPassword';
import OTP from '../screens/Login/OTP';
import ResetPassword from '../screens/Login/ResetPassword';
import { COLORS } from '../components/Common'

import NavBarButtonComponent from "../components/NavBarButtonComponent"
import images from '../assets/images'

const LoginNav = createStackNavigator();

const screenOptionStyle = {
    Bold20: {
        backgroundColor: COLORS.BLUE,
    },
    headerTintColor: COLORS.WHITE,
    headerBackTitle: "Back",
    headerStyle: {
        backgroundColor: COLORS.BLUE,
    },
};

const LoginStack = (props) => {
    return (
        <LoginNav.Navigator screenOptions={screenOptionStyle} >
            <LoginNav.Screen name="Login" component={Initial}
                options={({ navigation }) => ({
                    headerMode: 'none'
                })}
            />
            <LoginNav.Screen name="ForgotPassword" component={ForgotPassword}
                options={({ navigation }) => ({
                    title: 'Forgot Password',
                    headerLeft: (props) => (
                        <NavBarButtonComponent buttonImage={images.back}
                            onPress={() => { navigation.pop() }} />
                    )
                })}
            />
            <LoginNav.Screen name="OTP" component={OTP}
                options={({ navigation }) => ({
                    title: 'Forgot Password',
                    headerLeft: (props) => (
                        <NavBarButtonComponent buttonImage={images.back}
                            onPress={() => { navigation.pop() }} />
                    )
                })}
            />
            <LoginNav.Screen name="ResetPassword" component={ResetPassword}
                options={({ navigation }) => ({
                    title: 'Reset Password',
                    headerLeft: (props) => (
                        <NavBarButtonComponent buttonImage={images.back}
                            onPress={() => { navigation.pop() }} />
                    )
                })}
            />

        </LoginNav.Navigator>
    );
};

export { LoginStack };