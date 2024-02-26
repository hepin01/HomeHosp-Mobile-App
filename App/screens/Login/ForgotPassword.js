/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import images from '../../assets/images';
import { ButtonComponent } from '../../components/ButtonComponent';
import { commonStyles, HideKeyboard, COLORS } from '../../components/Common';
import KeyboardShift from '../../components/KeyboardShift';
import { TextFieldComponent } from '../../components/TextFieldComponent';
import Base from '../Base/Base';
import { Messages } from '../../components/Messages';
import { emailValidator } from '../../utiles/validator';
import { forgotpassword } from '../../networking/APIMethods';


class ForgotPassword extends Base {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    componentDidMount() {
    }

    signInAction() {
        this.props.navigation.popToTop()
    }

    forgotPassBtnClicked() {
        const { email } = this.state;
        if (!email || email.length < 1) {
            this.displayErrorMsg(Messages.enterEmail);
        } else if (email.length > 0) {
            this.validateEmail(email)
        }
    }

    validateEmail = (text) => {
        emailValidator(text, () => {
            this.displayErrorMsg(Messages.enterValidEmail);
        }, () => {
            this.forgotPasswordAction()
        })
    }

    forgotPasswordAction() {
        // this.showLoader("Logging in")
        const { email } = this.state;

        //API call for forgotPassword
        forgotpassword(email, (response) => {
            //console.log(response)
            this.displayMsg(response?.message)
            this.props.navigation.navigate("OTP",{"email": email})
        },
            (error) => {
                this.displayErrorMsg(error)
                // this.dismissLoader()
            },
        )
    }

    render() {
        const { email } = this.state;
        return (
            <KeyboardShift keyboardDisplayTopSpacing={10}
                animDuringKeyboardDisplayIOS={true}>
                {() => (
                    <HideKeyboard>
                        <View style={commonStyles.container}>
                            <Image
                                style={commonStyles.forgotPasswordImage}
                                source={images.forgotpass}
                            />
                            <View style={commonStyles.fpView}>
                                <Text style={commonStyles.Bold20}>Forgot Password?</Text>
                                <Text style={commonStyles.detailsText}>{"Don't worry, It happens. Please enter the\naddress associated with your account."}</Text>

                                <TextFieldComponent
                                    ref={(input) => { this.emailFld = input; }}
                                    style={{ marginTop: 25 }}
                                    value={email}
                                    placeholder={"Email ID"}
                                    returnKeyType='next'
                                    onChangeText={(text) => { this.setState({ email: text }) }}
                                    textContentType='emailAddress'
                                    keyboardType='email-address'
                                    onSubmitEditing={() => { }}
                                    autoCapitalize='none'
                                    maxLength={225}
                                    blurOnSubmit={false}
                                />

                                <ButtonComponent style={{ marginTop: 60 }} buttonTitle={'Send OTP'} buttonAction={() => { this.forgotPassBtnClicked() }} />

                                <View style={styles.OrView}>
                                    <Text style={[commonStyles.blueButton, { color: COLORS.DARK_GRAY }]}>Back to</Text>
                                    <TouchableOpacity onPress={() => this.signInAction()}>
                                        <Text style={commonStyles.blueButton}> Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </HideKeyboard>
                )}

            </KeyboardShift>
        )
    }
};


export default ForgotPassword;

const styles = StyleSheet.create({
    OrView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 20,
        width: '100%',
        flexWrap: 'wrap'
    }
});
