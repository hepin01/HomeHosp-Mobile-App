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
import Base from '../Base/Base';
import OTPTextView from 'react-native-otp-textinput';
import { Messages } from '../../components/Messages';
import { forgotpassword, verifyOTP } from '../../networking/APIMethods';


class OTP extends Base {
    constructor(props) {
        super(props);
        this.state = {
            email: props?.route?.params?.email,
            otp: ''
        }
    }

    componentDidMount() {
    }

    resendOTPClicked() {
        const { email } = this.state;
        this.setState({otp: ""})
        forgotpassword(email, (response) => {
            //console.log(response)
            this.displayMsg(response?.message)
        },
            (error) => {
                this.displayErrorMsg(error)
                // this.dismissLoader()
            },
        )
    }

    submitBtnClicked() {
        const { otp, email } = this.state;
        if (!otp || otp.length < 6) {
            this.displayErrorMsg(Messages.enterOtp);
        } else {
            verifyOTP(email, otp, (response) => {
                //console.log(response)
                //this.displayMsg(response?.message)
                this.props.navigation.navigate("ResetPassword", { "email": email })
            },
                (error) => {
                    this.displayErrorMsg(error)
                    // this.dismissLoader()
                },
            )
        }
    }

    signInAction() {
        this.props.navigation.popToTop()
    }

    render() {
        const { otp } = this.state;
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
                                <Text style={commonStyles.detailsText}>{"Please enter the OTP sent to your\nregistered email ID"}</Text>

                                <OTPTextView
                                    handleTextChange={(e) => { this.setState({ otp: e }) }}
                                    containerStyle={styles.otpContainer}
                                    textInputStyle={styles.otpTxtInput}
                                    inputCount={6}
                                    tintColor={COLORS.BLUE}
                                    offTintColor={COLORS.LIGHT_GRAY}
                                />

                                <TouchableOpacity onPress={() => this.resendOTPClicked()}>
                                    <Text style={[commonStyles.blueButton, { alignSelf: 'center' }]}>Resend OTP</Text>
                                </TouchableOpacity>

                                <ButtonComponent style={{ marginTop: 20 }} buttonTitle={'Submit'} buttonAction={() => { this.submitBtnClicked() }} />

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


export default OTP;

const styles = StyleSheet.create({
    OrView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 20,
        width: '100%',
        flexWrap: 'wrap'
    },
    otpContainer: { alignSelf: 'center', margin: 20, justifyContent: 'center' },
    otpTxtInput: { alignSelf: 'center', borderWidth: 1.3, borderRadius: 6, borderBottomWidth: 1, width: '14%', height: 50 }
});
