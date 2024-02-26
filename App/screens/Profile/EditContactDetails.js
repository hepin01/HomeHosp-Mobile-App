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
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Modal,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import {commonStyles, getCalculated, COLORS} from '../../components/Common';
import {SmallButton} from '../../components/SmallButton';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import images from '../../assets/images';
import {
  updateProvider,
  changeEmail,
  changePhoneNumber,
  verifyOtpForEmailChange,
  getStates,
  getCity,
  updatePatient,
} from '../../networking/APIMethods';
import {Messages} from '../../components/Messages';
import Base from '../Base/Base';
import {connect} from 'react-redux';
import {
  emailValidator,
  validateEnteredCharacters,
  validateName,
  validatePhone,
} from '../../utiles/validator';
import SelectDropdown from 'react-native-select-dropdown';
import {SelectiveDropdown} from '../../components/SelectiveDropdown';

class EditContactDetails extends Base {
  constructor(props) {
    super(props);
    const {user} = props;
    console.log(user)
    this.state = {
      email: user.email ?? '',
      phone: user.contactnumber ?? '',
      city: user.city ?? 'Select',
      stateName: user.state ?? 'Select',
      postal: user.zipcode ?? '',
      country: user.country ?? 'Select',
      otp: '',
      modalVisible: false,
      isEmailRequest: false,
      isPasswordEntered: false,
      password: '',
      showPwd: false,
      updateEmailBtnEnable: false,
      updatePhBtnEnable: false,
      countryList: ['USA'],
      stateList: [],
      cityList: [],
      selectedState: {},
      allStateArray: [], //saves all state list for future use
      allCityArray: [], //saves all state list for future use
    };
    this.emailFld = this.emailFld;
    this.phoneFld = this.phoneFld;
    this.zipFld = this.zipFld;
    this.otpFld = this.otpFld;
    this.pwdFld = this.pwdFld;
  }

  componentDidMount() {
    this.getStatesList();
  }

  getStatesList() {
    const {user} = this.props;
    getStates(
      response => {
        console.log(response);
        this.setState({allStateArray: response});
        var states = [];
        response.map((item, index) => {
          states = [...states, item?.state_name];
          if (item?.state_name == user.state) {
            this.getCityList(item?._id);
          }
        });

        this.setState({stateList: states});
      },
      error => {},
    );
  }

  getCityList(stateId) {
    // this.showLoader('');
    getCity(
      stateId,
      response => {
        // this.dismissLoader();
        this.setState({allCityArray: response});
        var cities = [];
        response.map((item, index) => (cities = [...cities, item?.city_name]));
        this.setState({cityList: cities});
      },
      error => {
        // this.dismissLoader();
      },
    );
  }

  changeEmailAction() {
    const {email} = this.state;
    if (!email || email.length < 1) {
      this.displayErrorMsg(Messages.enterEmail);
    } else if (email.length > 0) {
      this.validateEmail(email);
    }
  }

  changePhoneNumAction() {
    const {phone} = this.state;
    if (!phone || phone.length < 1) {
      this.displayErrorMsg(Messages.enterPhone);
    } else if (phone.length < 10) {
      this.displayErrorMsg(Messages.enterValidPhone);
    } else {
      this.setState({
        isEmailRequest: false,
        modalVisible: true,
        isPasswordEntered: false,
      });
    }
  }

  saveBtnClicked() {
    const {city, stateName, postal, country} = this.state;
    const {user} = this.props;
    if (!city || city.length < 1) {
      this.displayErrorMsg(Messages.selectCity);
    } else if (!stateName || stateName.length < 1) {
      this.displayErrorMsg(Messages.selectState);
    } else if (!postal || postal.length < 1) {
      this.displayErrorMsg(Messages.enterpostal);
    } else if (!country || country.length < 1) {
      this.displayErrorMsg(Messages.entercountry);
    } else {
      if (user.userType == 'patient') {
        this.updatePatientInfo();
      } else {
        this.updateProviderInfo();
      }
    }
  }

  updateProviderInfo() {
    const {user} = this.props;
    const {city, stateName, postal, country} = this.state;
    this.showLoader('');
    updateProvider(
      user?.about,
      city,
      country,
      user?.dob,
      user?.firstname,
      user?.gender,
      user?.lastname,
      user?.providerSubType,
      user?.providerType,
      stateName,
      postal,
      user?.language,
      response => {
        this.dismissLoader();
        console.log(response);
        const userObj = this.setUser(response?.data);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Contact details has been updated');
        this.props.navigation.pop();
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  updatePatientInfo() {
    const {user} = this.props;
    const {city, stateName, postal, country} = this.state;
    this.showLoader('');
    updatePatient(
      city,
      country,
      user?.dob,
      user?.firstname,
      user?.gender,
      user?.lastname,
      stateName,
      postal,
      user?.language,
      response => {
        this.dismissLoader();
        console.log(response);
        const userObj = this.setUser(response?.data);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Contact details has been updated');
        this.props.navigation.pop();
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  /*****************************************************************************/
  sendEmailOTP() {
    const {email, password} = this.state;
    if (!password || password.length < 1) {
      this.displayErrorMsg(Messages.enterPassword);
    } else {
      this.updateEmail();
    }
  }

  validateEmail = text => {
    emailValidator(
      text,
      () => {
        this.displayErrorMsg(Messages.enterValidEmail);
      },
      () => {
        this.setState({
          isEmailRequest: true,
          modalVisible: true,
          isPasswordEntered: false,
        });
      },
    );
  };

  updateEmail() {
    const {email, password} = this.state;
    changeEmail(
      email,
      password,
      response => {
        console.log(response);
        this.setState({isPasswordEntered: true});
        this.displayMsg(response?.message);
      },
      error => {
        this.displayErrorMsg(error);
      },
    );
  }

  validateEmailOTP() {
    const {email, otp} = this.state;
    if (!otp || otp.length < 1) {
      this.displayErrorMsg(Messages.enterOtp);
    } else {
      verifyOtpForEmailChange(
        email,
        otp,
        response => {
          console.log(response);
          this.setState({modalVisible: false});
          this.displayMsg(response?.message);
          this.props.dispatch({
            type: 'SET_EMAIL',
            payload: {email: email},
          });
        },
        error => {
          this.displayErrorMsg(error);
        },
      );
    }
  }

  /*****************************************************************************/

  updatePhoneNumber() {
    const {phone, password} = this.state;
    if (!password || password.length < 1) {
      this.displayErrorMsg(Messages.enterPassword);
    } else {
      changePhoneNumber(
        phone,
        password,
        response => {
          this.setState({modalVisible: false});
          this.props.dispatch({
            type: 'SET_PHONE',
            payload: {contactnumber: phone},
          });
          this.displayMsg(response?.message);
        },
        error => {
          this.displayErrorMsg(error);
        },
      );
    }
  }

  render() {
    const {
      email,
      phone,
      city,
      stateName,
      country,
      postal,
      updateEmailBtnEnable,
      updatePhBtnEnable,
      stateList,
      cityList,
      allStateArray,
      countryList,
      allCityArray,
    } = this.state;
    return (
      <View style={commonStyles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{width: '100%'}}
          contentContainerStyle={{width: '100%', paddingBottom: 50}}>
          <View style={styles.subContainer}>
            <View
              style={[
                commonStyles.shadow,
                commonStyles.shadowCard,
                {alignSelf: 'center', width: '95%'},
              ]}>
              <TextFieldComponent
                ref={input => {
                  this.emailFld = input;
                }}
                style={{width: '100%', alignSelf: 'center'}}
                value={email}
                placeholder={'Email ID'}
                returnKeyType="next"
                onChangeText={text => {
                  this.setState({email: text});
                  if (text.length > 0) {
                    this.setState({updateEmailBtnEnable: true});
                  } else {
                    this.setState({updateEmailBtnEnable: false});
                  }
                }}
                textContentType="emailAddress"
                keyboardType="email-address"
                onSubmitEditing={() => {}}
                autoCapitalize="none"
                maxLength={225}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                onPress={() => this.changeEmailAction()}
                disabled={!updateEmailBtnEnable}>
                <Text
                  style={[
                    commonStyles.blueButton,
                    styles.blueBtn,
                    {
                      color: updateEmailBtnEnable
                        ? COLORS.BLUE
                        : COLORS.LIGHT_GRAY,
                    },
                  ]}>
                  Update Email ID
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={[styles.underLine, commonStyles.shadow]}></View> */}
            <View
              style={[
                commonStyles.shadow,
                commonStyles.shadowCard,
                {alignSelf: 'center', width: '95%', marginTop: 0},
              ]}>
              <Text style={[commonStyles.Regular12, styles.labelStylePhone]}>
                Phone Number
              </Text>
              <View style={styles.rowView}>
                <Text style={styles.countryCode}>+1</Text>
                <TextInput
                  style={[
                    styles.countryCode,
                    {width: '77%', textAlign: 'left', paddingLeft: 10},
                  ]}
                  allowFontScaling={false}
                  value={phone}
                  returnKeyType="next"
                  ref={input => {
                    this.phoneNumFld = input;
                  }}
                  onChangeText={text => {
                    this.setState({
                      phone: validatePhone(validateEnteredCharacters(text)),
                    });
                    if (text.length > 0) {
                      this.setState({updatePhBtnEnable: true});
                    } else {
                      this.setState({updatePhBtnEnable: false});
                    }
                  }}
                  textContentType="telephoneNumber"
                  dataDetectorTypes="phoneNumber"
                  keyboardType="phone-pad"
                  onSubmitEditing={() => {}}
                  autoCapitalize="none"
                  onFocus={() => {}}
                  onBlur={() => {}}
                  maxLength={10}
                  blurOnSubmit={true}
                />
              </View>

              <TouchableOpacity
                onPress={() => this.changePhoneNumAction()}
                disabled={!updatePhBtnEnable}>
                <Text
                  style={[
                    commonStyles.blueButton,
                    styles.blueBtn,
                    {
                      marginTop: 7,
                      color: updatePhBtnEnable
                        ? COLORS.BLUE
                        : COLORS.LIGHT_GRAY,
                    },
                  ]}>
                  Update Phone Number
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={[styles.underLine, commonStyles.shadow]}></View> */}

            <Text style={[commonStyles.Regular12, styles.labelStyle]}>
              Country
            </Text>
            <View style={styles.dropdownView}>
              <SelectiveDropdown
                list={countryList}
                value={country}
                onSelect={(selectedItem, index) =>
                  this.setState({country: selectedItem})
                }
              />
            </View>

            <Text style={[commonStyles.Regular12, styles.labelStyle]}>
              State
            </Text>
            <View style={styles.dropdownView}>
              <SelectiveDropdown
                list={stateList}
                value={stateName}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    stateName: selectedItem,
                    city: 'Select',
                    postal: '',
                  });
                  this.getCityList(allStateArray?.[index]?._id);
                }}
              />
            </View>

            <Text style={[commonStyles.Regular12, styles.labelStyle]}>
              City
            </Text>
            <View style={styles.dropdownView}>
              <SelectiveDropdown
                list={cityList}
                value={city}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    city: selectedItem,
                    postal: allCityArray?.[index]?.zip_code,
                  });
                }}
              />
            </View>

            <TextFieldComponent
              normalColor={true}
              ref={input => {
                this.zipFld = input;
              }}
              style={{marginTop: 10}}
              value={postal}
              placeholder={'Zip'}
              returnKeyType="next"
              onChangeText={text => {
                this.setState({postal: validatePhone(text)});
              }}
              keyboardType="phone-pad"
              onSubmitEditing={() => {}}
              autoCapitalize="none"
              maxLength={5}
              blurOnSubmit={false}
            />

            {this.displayModal()}

            <SmallButton
              style={styles.saveBtn}
              buttonTitle={'Save'}
              buttonAction={() => {
                this.saveBtnClicked();
              }}
            />
          </View>
          {this.progressLoader()}
        </KeyboardAwareScrollView>
        {this.progressLoader()}
      </View>
    );
  }

  displayModal() {
    const {
      modalVisible,
      otp,
      isEmailRequest,
      isPasswordEntered,
      password,
      showPwd,
    } = this.state;
    return (
      <Modal
        style={{}}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          this.setState({modalVisible: false});
        }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{width: '100%'}}
          contentContainerStyle={commonStyles.modalBackground}>
          <View style={{width: '100%', height: '100%'}}>
            <View style={commonStyles.modalBgView}>
              <View
                style={[
                  commonStyles.modalMainView,
                  commonStyles.shadow,
                  {padding: 20},
                ]}>
                {!isPasswordEntered && (
                  <View style={{}}>
                    <Text style={commonStyles.Bold18}>Enter Password</Text>

                    <View style={{marginTop: 10}}>
                      <TextFieldComponent
                        ref={input => {
                          this.pwdFld = input;
                        }}
                        style={{width: '100%', alignSelf: 'center'}}
                        value={password}
                        placeholder={'Password'}
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

                    <SmallButton
                      style={styles.verifyOTP}
                      buttonTitle={
                        isEmailRequest
                          ? 'Send OTP on Email'
                          : 'Update Phone Number'
                      }
                      buttonAction={() => {
                        isEmailRequest
                          ? this.sendEmailOTP()
                          : this.updatePhoneNumber();
                      }}
                    />
                  </View>
                )}

                {isEmailRequest && isPasswordEntered && (
                  <View>
                    <Text style={commonStyles.Bold18}>Verify OTP</Text>

                    <TextFieldComponent
                      normalColor={true}
                      ref={input => {
                        this.otpFld = input;
                      }}
                      style={{
                        marginTop: 15,
                        width: '100%',
                        alignSelf: 'center',
                      }}
                      value={otp}
                      placeholder={'Enter OTP'}
                      returnKeyType="next"
                      onChangeText={text => {
                        this.setState({otp: text});
                      }}
                      keyboardType="phone-pad"
                      onSubmitEditing={() => {}}
                      autoCapitalize="none"
                      maxLength={6}
                      blurOnSubmit={false}
                    />

                    <SmallButton
                      style={styles.verifyOTP}
                      buttonTitle={'Update Email'}
                      buttonAction={() => {
                        this.validateEmailOTP();
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        this.updateEmail();
                        this.setState({otp: ''});
                      }}>
                      <Text
                        style={[
                          commonStyles.blueButton,
                          {marginTop: 7, alignSelf: 'center'},
                        ]}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible: false});
                  }}
                  style={styles.closeBtn}>
                  <Image style={styles.closeImage} source={images.close} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}

const STATE = state => ({user: state.user.user});
export default connect(STATE)(EditContactDetails);

const styles = StyleSheet.create({
  subContainer: {width: '100%', height: '100%'},
  rowView: {
    flexDirection: 'row',
    height: Platform.OS == 'ios' ? getCalculated(40) : getCalculated(42),
    width: '90%',
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  countryCode: {
    width: getCalculated(55),
    height: getCalculated(37),
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    paddingVertical: getCalculated(10),
    textAlign: 'center',
    borderRadius: 5,
    fontSize: getCalculated(15.5),
    marginTop: 0,
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  labelStyle: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.LIGHT_GRAY,
  },
  labelStylePhone: {
    width: '100%',
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.LIGHT_GRAY,
  },
  blueBtn: {marginTop: 35},
  verifyOTP: {width: 'auto', alignSelf: 'center', marginTop: 50},
  saveBtn: {width: getCalculated(60), alignSelf: 'center', marginTop: 50},
  otpContainer: {
    alignSelf: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  otpTxtInput: {
    alignSelf: 'center',
    borderWidth: 1.3,
    borderRadius: 6,
    borderBottomWidth: 1,
    width: '14%',
    height: 50,
  },
  closeBtn: {position: 'absolute', right: 20, top: 20},
  closeImage: {resizeMode: 'contain', width: 15, height: 15},
  eyeBtn: {position: 'absolute', top: 42, right: 20},
  eyeImage: {
    width: 20,
    height: 14,
    resizeMode: 'cover',
  },
  underLine: {
    width: '100%',
    height: 0.7,
    backgroundColor: COLORS.SUPER_LIGHT_GRAY,
    marginVertical: Platform.OS == 'android' ? 12 : 15,
    alignSelf: 'center',
  },
  dropdownView: {
    marginTop: 5,
    alignSelf: 'center',
    width: '90%',
  },
  rowTxtStyle: {textAlign: 'left', alignSelf: 'center'},
  btnTxtStyle: hasLenght => ({
    textAlign: 'left',
    marginLeft: 0,
    height: '60%',
    color: hasLenght ? COLORS.DARK_GRAY : COLORS.LIGHT_GRAY,
  }),
  ddBtnStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'center',
  },
  ddStyle: {width: '90%', borderRadius: 6, marginTop: -4},
});
