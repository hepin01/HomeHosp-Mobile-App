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
import { resetPassword } from '../../networking/APIMethods';
import { checkPwd } from '../../utiles/validator';
class ResetPassword extends Base {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            showPwd: false,
            showConfirmPwd: false,
            email: props?.route?.params?.email,
        }
        this.pwdFld = this.pwdFld;
        this.confirmPwdFld = this.confirmPwdFld;
    }

    componentDidMount() {
    }

    submitBtnClicked() {
        const {password, confirmPassword } = this.state;

        if (!password || password.length < 1) {
            this.displayErrorMsg(Messages.enterPassword);
        } else if (!confirmPassword || confirmPassword.length < 1) {
            this.displayErrorMsg(Messages.confirmPassword);
        } else if (password != confirmPassword) {
            this.displayErrorMsg(Messages.passwordDoesntMatch);
        } else {
            this.validatePassword(confirmPassword)
        }
    }

    validatePassword = (text) => {
        checkPwd(text, () => {
            this.displayErrorMsg(Messages.enterValidPassword)
        }, () => {
            this.restPasswordAction()
        })
    }

    signInAction() {
        this.props.navigation.popToTop()
    }


    restPasswordAction() {
        // this.showLoader("Logging in")
        const { email, confirmPassword } = this.state;

        //API call to reset password
        resetPassword(email, confirmPassword, (response) => {
            console.log(response)
            this.displayMsg(response?.message)
            this.props.navigation.popToTop()
        },
            (error) => {
                this.displayErrorMsg(error)
                // this.dismissLoader()
            },
        )
    }

    render() {
        const { password, confirmPassword, showConfirmPwd, showPwd } = this.state;
        return (
            <KeyboardShift keyboardDisplayTopSpacing={10}
                animDuringKeyboardDisplayIOS={true}>
                {() => (
                    <HideKeyboard>
                        <View style={commonStyles.container}>
                            <Image
                                style={commonStyles.forgotPasswordImage}
                                source={images.resetpass}
                            />
                            <View style={commonStyles.fpView}>
                                <Text style={commonStyles.Bold20}>Reset Password</Text>

                                <View style={{ height: 80, marginTop: 20 }}>
                                    <TextFieldComponent
                                        ref={(input) => { this.pwdFld = input; }}
                                        style={{}}
                                        value={password}
                                        placeholder={"Enter New Password"}
                                        returnKeyType='next'
                                        secureTextEntry={!showPwd}
                                        onChangeText={(text) => { this.setState({ password: text }) }}
                                        onSubmitEditing={() => { }}
                                        autoCapitalize='none'
                                        maxLength={16}
                                        blurOnSubmit={false}
                                    />
                                    <TouchableOpacity style={styles.eyeBtn} onPress={() => {
                                        this.setState({ showPwd: !showPwd })
                                    }}>
                                        <Image
                                            style={styles.eyeImage}
                                            source={showPwd ? images.show : images.hide}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ height: 80, marginTop: 5 }}>
                                    <TextFieldComponent
                                        ref={(input) => { this.confirmPwdFld = input; }}
                                        value={confirmPassword}
                                        placeholder={"Confirm New Password"}
                                        returnKeyType='next'
                                        secureTextEntry={!showConfirmPwd}
                                        onChangeText={(text) => { this.setState({ confirmPassword: text }) }}
                                        onSubmitEditing={() => { }}
                                        autoCapitalize='none'
                                        maxLength={16}
                                        blurOnSubmit={false}
                                    />
                                    <TouchableOpacity style={styles.eyeBtn} onPress={() => {
                                        this.setState({ showConfirmPwd: !showConfirmPwd })
                                    }}>
                                        <Image
                                            style={styles.eyeImage}
                                            source={showConfirmPwd ? images.show : images.hide}
                                        />
                                    </TouchableOpacity>
                                </View>



                                <ButtonComponent style={{ marginTop: 18 }} buttonTitle={'Reset Password'} buttonAction={() => { this.submitBtnClicked() }} />

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


export default ResetPassword;

const styles = StyleSheet.create({
    OrView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 20,
        width: '100%',
        flexWrap: 'wrap'
    },
    eyeBtn: { position: 'absolute', top: 40, right: 30 },
    eyeImage: {
        width: 20,
        height: 14,
        resizeMode: 'cover'
    }
});
