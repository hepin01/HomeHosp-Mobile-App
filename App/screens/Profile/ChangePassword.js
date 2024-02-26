/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import images from '../../assets/images';
import {commonStyles, HideKeyboard, COLORS} from '../../components/Common';
import KeyboardShift from '../../components/KeyboardShift';
import {Messages} from '../../components/Messages';
import {SmallButton} from '../../components/SmallButton';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {changePassword} from '../../networking/APIMethods';
import {checkPwd} from '../../utiles/validator';
import Base from '../Base/Base';

class ChangePassword extends Base {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      showOldPwd: false,
      showPwd: false,
      showConfirmPwd: false,
    };
    this.oldPwdFld = this.oldPwdFld;
    this.pwdFld = this.pwdFld;
    this.confirmPwdFld = this.confirmPwdFld;
  }

  componentDidMount() {}

  saveBtnClicked() {
    const {oldPassword, confirmPassword, password} = this.state;

    if (!oldPassword || oldPassword.length < 1) {
      this.displayErrorMsg(Messages.enterOldPassword);
    } else if (!password || password.length < 1) {
      this.displayErrorMsg(Messages.enterPassword);
    } else if (!confirmPassword || confirmPassword.length < 1) {
      this.displayErrorMsg(Messages.confirmPassword);
    } else if (password != confirmPassword) {
      this.displayErrorMsg(Messages.passwordDoesntMatch);
    } else {
      this.validatePassword(password);
    }
  }

  validatePassword = text => {
    checkPwd(
      text,
      () => {
        this.displayErrorMsg(Messages.enterValidPassword);
      },
      () => {
        this.changePasswordAction();
      },
    );
  };

  changePasswordAction() {
    this.showLoader('');
    const {oldPassword, confirmPassword} = this.state;

    //API call to reset password
    changePassword(
      oldPassword,
      confirmPassword,
      response => {
        console.log(response);
        this.dismissLoader();
        this.setState({oldPassword: '', confirmPassword: '', password: ''});
        this.displayMsg(response?.message);
      },
      error => {
        this.displayErrorMsg(error);
        this.dismissLoader();
      },
    );
  }

  render() {
    const {
      oldPassword,
      password,
      confirmPassword,
      showConfirmPwd,
      showPwd,
      showOldPwd,
    } = this.state;
    return (
      <KeyboardShift
        keyboardDisplayTopSpacing={10}
        animDuringKeyboardDisplayIOS={true}>
        {() => (
          <HideKeyboard>
            <View style={commonStyles.container}>
              <View style={commonStyles.fpView}>
                <View style={{height: 80}}>
                  <TextFieldComponent
                    ref={input => {
                      this.oldPwdFld = input;
                    }}
                    style={{}}
                    value={oldPassword}
                    placeholder={'Old Password'}
                    returnKeyType="next"
                    secureTextEntry={!showOldPwd}
                    onChangeText={text => {
                      this.setState({oldPassword: text});
                    }}
                    onSubmitEditing={() => {}}
                    autoCapitalize="none"
                    maxLength={16}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => {
                      this.setState({showOldPwd: !showOldPwd});
                    }}>
                    <Image
                      style={styles.eyeImage}
                      source={showOldPwd ? images.show : images.hide}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{height: 80, marginTop: 5}}>
                  <TextFieldComponent
                    ref={input => {
                      this.pwdFld = input;
                    }}
                    style={{}}
                    value={password}
                    placeholder={'New Password'}
                    returnKeyType="next"
                    secureTextEntry={!showPwd}
                    onChangeText={text => {
                      this.setState({password: text});
                    }}
                    onSubmitEditing={() => {}}
                    autoCapitalize="none"
                    maxLength={16}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => {
                      this.setState({showPwd: !showPwd});
                    }}>
                    <Image
                      style={styles.eyeImage}
                      source={showPwd ? images.show : images.hide}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{height: 80, marginTop: 5}}>
                  <TextFieldComponent
                    ref={input => {
                      this.confirmPwdFld = input;
                    }}
                    value={confirmPassword}
                    placeholder={'Confirm New Password'}
                    returnKeyType="next"
                    secureTextEntry={!showConfirmPwd}
                    onChangeText={text => {
                      this.setState({confirmPassword: text});
                    }}
                    onSubmitEditing={() => {}}
                    autoCapitalize="none"
                    maxLength={16}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => {
                      this.setState({showConfirmPwd: !showConfirmPwd});
                    }}>
                    <Image
                      style={styles.eyeImage}
                      source={showConfirmPwd ? images.show : images.hide}
                    />
                  </TouchableOpacity>
                </View>
                <SmallButton
                  style={{marginTop: 18, alignSelf: 'center'}}
                  buttonTitle={'Save Password'}
                  buttonAction={() => {
                    this.saveBtnClicked();
                  }}
                />
              </View>
              {this.progressLoader()}
            </View>
          </HideKeyboard>
        )}
      </KeyboardShift>
    );
  }
}

export default ChangePassword;

const styles = StyleSheet.create({
  OrView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
    width: '100%',
    flexWrap: 'wrap',
  },
  eyeBtn: {position: 'absolute', top: 40, right: 30},
  eyeImage: {
    width: 20,
    height: 14,
    resizeMode: 'cover',
  },
});
