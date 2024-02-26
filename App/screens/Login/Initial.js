/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
  Keyboard,
} from 'react-native';
import images from '../../assets/images';
import {HideKeyboard, commonStyles, COLORS} from '../../components/Common';
import KeyboardShift from '../../components/KeyboardShift';
import {Messages} from '../../components/Messages';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {ButtonComponent} from '../../components/ButtonComponent';
import {connect} from 'react-redux';
import {MotiView} from '@motify/components';
import {emailValidator} from '../../utiles/validator';
import {getCurrentPlan, signIn} from '../../networking/APIMethods';
import Base from '../Base/Base';
import {isProvider} from '../../utiles/common';
import {webViewBaseurl} from '../../networking/Constats';

const _color = 'rgba(31,164,221,0.2)';
const _size = 120;

class Initial extends Base {
  constructor(props) {
    super(props);
    this.state = {
      showPwd: false,
      email: '',
      password: '',
      signUpUrl: webViewBaseurl + 'provider/signup;userType=provider',
    };
    this.emailFld = this.emailFld;
    this.pwdFld = this.pwdFld;

    this.logoTop = new Animated.Value(0);
    this.opacValue = new Animated.Value(0);
    this.loginView = new Animated.Value(300);
    this.loginViewOpac = new Animated.Value(0);
    this.logoRight = new Animated.Value(0);
    this.bgOpacity = new Animated.Value(1);
    this.circleOpac = new Animated.Value(0.1);
    this.circleLeft = new Animated.Value(0);
    this.hLeft = new Animated.Value(0);
  }

  componentDidMount() {
    this.animateLogo();
  }

  animateLogo() {
    Animated.parallel([
      Animated.timing(this.circleOpac, {
        toValue: 1,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 600,
      }),
    ]).start(() => {
      setTimeout(() => {
        this.animateHideView();
      }, 1000);
    });
  }

  animateHideView() {
    Animated.parallel([
      Animated.timing(this.circleLeft, {
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true,
        duration: 700,
      }),
      Animated.timing(this.hLeft, {
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
        duration: 700,
      }),
    ]).start(() => {
      setTimeout(() => {
        this.animateOmeHospLogo();
      }, 300);
    });
  }

  animateOmeHospLogo() {
    Animated.parallel([
      Animated.timing(this.opacValue, {
        toValue: 1,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 700,
      }),
    ]).start(() => {
      setTimeout(() => {
        this.animateLoginView();
      }, 3500);
    });
  }

  animateLoginView() {
    Animated.parallel([
      Animated.timing(this.opacValue, {
        toValue: 0,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 300,
      }),
      Animated.timing(this.logoTop, {
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true,
        duration: 600,
      }),
      Animated.timing(this.logoRight, {
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true,
        duration: 600,
      }),
      Animated.timing(this.bgOpacity, {
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
        duration: 600,
      }),
      Animated.timing(this.loginView, {
        toValue: 0,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 700,
      }),
      Animated.timing(this.loginViewOpac, {
        toValue: 1,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 800,
      }),
    ]).start(() => {});
  }

  forgotPassword() {
    this.setState({email: '', password: ''});
    this.props.navigation.navigate('ForgotPassword');
  }

  loginBtnClicked() {
    const {email, password} = this.state;

    if (!email || email.length < 1) {
      this.displayErrorMsg(Messages.enterEmail);
    } else if (!password || password.length < 1) {
      this.displayErrorMsg(Messages.enterPassword);
    } else if (email.length > 0) {
      this.validateEmail(email);
    }
  }

  validateEmail = text => {
    emailValidator(
      text,
      () => {
        this.displayErrorMsg(Messages.enterValidEmail);
      },
      () => {
        this.loginAction();
      },
    );
  };

  loginAction() {
    // this.showLoader("Logging in")
    const {email, password} = this.state;
    this.showLoader('Logging in...');
    //API call to login
    signIn(
      email,
      password,
      response => {
        this.dismissLoader();
        if (response.userType == 'patient') {
          const {consentFormChecked, miniSurveyFormChecked} = response;
          if (!consentFormChecked || !miniSurveyFormChecked) {
            this.displayErrorMsg(
              'Oops! Please complete the signup process by log in to the website.',
            );
          } else {
            this.continueLogin(response);
          }
        } else {
          this.continueLogin(response);
        }
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  continueLogin(response) {
    const userObj = this.setUser(response);
    this.props.dispatch({
      type: 'SET_USER',
      payload: userObj,
    });
    this.props.dispatch({
      type: 'SET_ACCESSTOKEN',
      payload: {accessToken: response?.accessToken},
    });
    this.props.dispatch({
      type: 'SET_LOGIN',
    });
  }

  signUpAction() {
    const {signUpUrl} = this.state;
    // Linking.canOpenURL(signUpUrl).then(supported => {
    // if (supported) {
    Linking.openURL(signUpUrl);
    // } else {
    //console.log("Don't know how to open URI: " + signUpUrl);
    // }
    // });
  }

  render() {
    const {email, password, showPwd} = this.state;
    return (
      <KeyboardShift
        keyboardDisplayTopSpacing={10}
        animDuringKeyboardDisplayIOS={true}>
        {() => (
          <HideKeyboard>
            <View style={commonStyles.container}>
              <Animated.Image
                style={[styles.bgImageView, {opacity: this.bgOpacity}]}
                source={images.bgicons}></Animated.Image>

              <View style={styles.bgView}>
                <Animated.View
                  style={[
                    styles.center,
                    {
                      transform: [
                        {
                          translateX: this.circleLeft.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -90],
                          }),
                        },
                        {
                          translateX: this.logoRight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 90],
                          }),
                        },
                      ],
                    },
                  ]}>
                  {[...Array(10).keys()].map(index => {
                    return (
                      <MotiView
                        from={{opacity: 0.5, scale: 1}}
                        animate={{opacity: 0, scale: 12}}
                        transition={{
                          type: 'timing',
                          duration: '5000',
                          useNativeDriver: true,
                          delay: index * 500,
                          repeatReverse: false,
                          // loop: true,
                        }}
                        key={index}
                        style={[StyleSheet.absoluteFillObject, styles.dot]}
                      />
                    );
                  })}

                  <Animated.Image
                    style={[
                      styles.hhlogo,
                      {
                        opacity: this.circleOpac,
                        transform: [
                          {
                            translateY: this.logoTop.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -220],
                            }),
                          },
                        ],
                      },
                    ]}
                    source={images.logopart}
                  />
                  <Animated.Image
                    style={[styles.hLogoPart, {opacity: this.opacValue}]}
                    source={images.hLogo}
                  />
                </Animated.View>

                <Animated.View
                  style={{
                    width: '100%',
                    height: 300,
                    opacity: this.loginViewOpac,
                    position: 'absolute',
                    transform: [
                      {
                        translateX: this.loginView.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  }}>
                  <Text style={commonStyles.Bold20}>
                    Sign in to your account
                  </Text>
                  <View>
                    <TextFieldComponent
                      ref={input => {
                        this.emailFld = input;
                      }}
                      style={{marginTop: 10}}
                      value={email}
                      placeholder={'Email ID'}
                      returnKeyType="next"
                      onChangeText={text => {
                        this.setState({email: text});
                      }}
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      onSubmitEditing={() => {
                        this.pwdFld.focus();
                      }}
                      autoCapitalize="none"
                      maxLength={256}
                      blurOnSubmit={false}
                    />

                    <View style={{height: 80, marginTop: 40}}>
                      <TextFieldComponent
                        ref={input => {
                          this.pwdFld = input;
                        }}
                        style={{}}
                        value={password}
                        placeholder={'Password'}
                        returnKeyType="next"
                        secureTextEntry={!showPwd}
                        onChangeText={text => {
                          this.setState({password: text});
                        }}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
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
                  </View>

                  <TouchableOpacity
                    style={{width: 180, alignSelf: 'flex-end'}}
                    onPress={() => this.forgotPassword()}>
                    <Text
                      style={[
                        commonStyles.blueButton,
                        {marginRight: 20, marginTop: 10},
                      ]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <ButtonComponent
                    style={{marginTop: 20}}
                    buttonTitle={'Sign In'}
                    buttonAction={() => {
                      this.loginBtnClicked();
                    }}
                  />

                  <View style={styles.OrView}>
                    <Text
                      style={[
                        commonStyles.blueButton,
                        {color: COLORS.DARK_GRAY},
                      ]}>
                      New to HomeHosp?
                    </Text>
                    <TouchableOpacity onPress={() => this.signUpAction()}>
                      <Text style={commonStyles.blueButton}>
                        {' '}
                        Take me to Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
              {this.progressLoader()}
            </View>
          </HideKeyboard>
        )}
      </KeyboardShift>
    );
  }
}

const STATE = state => {
  return {
    user: state.user.user,
  };
};
export default connect(STATE)(Initial);

const styles = StyleSheet.create({
  OrView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
    width: '100%',
    flexWrap: 'wrap',
  },
  dot: {
    width: _size,
    height: _size,
    borderRadius: _size,
    backgroundColor: _color,
    alignSelf: 'center',
  },
  bgView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bgImageView: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  hhlogo: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  hLogoPart: {
    width: 170,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    top: 50,
    left: 88,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: _size,
    height: _size,
  },
  eyeBtn: {
    position: 'absolute',
    top: 35,
    right: 30,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  eyeImage: {
    width: 20,
    height: 14,
    resizeMode: 'cover',
  },
});
