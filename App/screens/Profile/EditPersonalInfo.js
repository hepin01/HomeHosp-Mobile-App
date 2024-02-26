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
  View,
  Keyboard,
  TextInput,
} from 'react-native';
import {
  commonStyles,
  HideKeyboard,
  getCalculated,
  COLORS,
} from '../../components/Common';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {SmallButton} from '../../components/SmallButton';
import images from '../../assets/images';
import KeyboardShift from '../../components/KeyboardShift';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {Checkmark} from '../../components/Checkmark';
import {validateEnteredCharacters} from '../../utiles/validator';
import {updateProvider, updatePatient} from '../../networking/APIMethods';
import {Messages} from '../../components/Messages';
import Base from '../Base/Base';
import {connect} from 'react-redux';
import {isProvider} from '../../utiles/common';

class EditPersonalInfo extends Base {
  constructor(props) {
    super(props);

    this.state = {
      firstName: (props.user && props.user.firstname) ?? '',
      lastName: (props.user && props.user.lastname) ?? '',
      about: (props.user && props.user.about) ?? '',
      dob:
        props.user.dob.length > 0
          ? moment(props.user.dob).format('DD/MM/YYYY')
          : 'Select Date',
      selectedDob: props.user.dob.length > 0 ? moment(props.user.dob) : '',
      isMale: props.user && props.user.gender == 'male' ? true : false,
      isDateTimePickerVisible: false,
    };
    this.fNameFld = this.fNameFld;
    this.lNameFld = this.lNameFld;
    this.aboutFld = this.aboutFld;
  }

  componentDidMount() {}

  dateBtnTapped = () => {
    this.setState({
      isDateTimePickerVisible: true,
    });
    Keyboard.dismiss();
  };

  _hideDateTimePicker = () =>
    this.setState({
      isDateTimePickerVisible: false,
    });

  _handleDatePicked = date => {
    this._hideDateTimePicker();
    this.setState({
      dob: moment(date.toString()).format('DD/MM/YYYY'),
      selectedDob: moment(date.toString()),
    });
  };

  saveBtnClicked() {
    const {firstName, lastName, about, dob} = this.state;
    const {user} = this.props;

    if (!firstName || firstName.length < 1) {
      this.displayErrorMsg(Messages.enterFirstName);
    } else if (!lastName || lastName.length < 1) {
      this.displayErrorMsg(Messages.enterLastName);
    } else if (isProvider() && (!about || about.length < 1)) {
      this.displayErrorMsg(Messages.enterAboutTxt);
    } else if (!dob || dob == 'Select Date') {
      this.displayErrorMsg(Messages.enterdob);
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
    const {firstName, lastName, about, selectedDob, isMale} = this.state;
    this.showLoader('');
    updateProvider(
      about,
      user?.city,
      user?.country,
      selectedDob,
      firstName,
      isMale ? 'Male' : 'Female',
      lastName,
      user?.providerSubType,
      user?.providerType,
      user?.state,
      user?.zipcode,
      user?.language,
      response => {
        this.dismissLoader();
        const userObj = this.setUser(response?.data);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Personal details has been updated');
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
    const {firstName, lastName, selectedDob, isMale} = this.state;
    this.showLoader('');
    updatePatient(
      user?.city,
      user?.country,
      selectedDob,
      firstName,
      isMale ? 'Male' : 'Female',
      lastName,
      user?.state,
      user?.zipcode,
      user?.language,
      response => {
        this.dismissLoader();
        const userObj = this.setUser(response?.data);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Personal details has been updated');
        this.props.navigation.pop();
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  render() {
    const {firstName, lastName, dob, about, isMale} = this.state;
    const {user} = this.props;
    return (
      <KeyboardShift
        keyboardDisplayTopSpacing={10}
        animDuringKeyboardDisplayIOS={true}>
        {() => (
          <HideKeyboard>
            <View style={commonStyles.container}>
              <View style={styles.subContainer}>
                <TextFieldComponent
                  ref={input => {
                    this.fNameFld = input;
                  }}
                  style={{marginTop: 25}}
                  value={firstName}
                  placeholder={'First Name'}
                  returnKeyType="next"
                  onChangeText={text => {
                    this.setState({firstName: text});
                  }}
                  textContentType="name"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={30}
                  blurOnSubmit={false}
                />

                <TextFieldComponent
                  ref={input => {
                    this.lNameFld = input;
                  }}
                  style={{marginTop: 40}}
                  value={lastName}
                  placeholder={'Last Name'}
                  returnKeyType="next"
                  onChangeText={text => {
                    this.setState({lastName: text});
                  }}
                  textContentType="familyName"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={30}
                  blurOnSubmit={false}
                />

                <View style={styles.rowView}>
                  <Checkmark
                    style={{marginLeft: 0}}
                    isChecked={isMale}
                    title={'Male'}
                    checkmarkAction={() => {
                      this.setState({isMale: true});
                    }}
                  />
                  <Checkmark
                    style={{marginLeft: 20}}
                    isChecked={!isMale}
                    title={'Female'}
                    checkmarkAction={() => {
                      this.setState({isMale: false});
                    }}
                  />
                </View>

                <Text style={[commonStyles.Regular12, styles.labelStyle]}>
                  Date of Birth
                </Text>
                <TouchableOpacity
                  style={styles.dobView}
                  onPress={() => this.dateBtnTapped()}>
                  <Text style={[commonStyles.Regular125, styles.dobText(dob)]}>
                    {dob}
                  </Text>
                  <Image
                    style={styles.calanderIcon}
                    source={images.calenadar}
                  />
                </TouchableOpacity>

                {isProvider() && (
                  <Text style={[commonStyles.Regular12, styles.labelStyle]}>
                    About
                  </Text>
                )}
                {isProvider() && (
                  <View style={styles.textFiledBgViewStyle}>
                    <TextInput
                      style={styles.textFieldcustom}
                      ref={input => {
                        this.aboutFld = input;
                      }}
                      onChangeText={text => {
                        this.setState({about: validateEnteredCharacters(text)});
                      }}
                      allowFontScaling={false}
                      onSubmitEditing={() => {}}
                      value={about}
                      keyboardType="default"
                      placeholderTextColor="#98a0ab"
                      returnKeyType="next"
                      autoCapitalize="sentences"
                      maxLength={220}
                      blurOnSubmit={false}
                      numberOfLines={4}
                      multiline={true}
                    />
                  </View>
                )}

                <SmallButton
                  style={styles.saveBtn}
                  buttonTitle={'Save'}
                  buttonAction={() => {
                    this.saveBtnClicked();
                  }}
                />

                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDateTimePicker}
                  mode="date"
                  maximumDate={moment().subtract(20, 'years').toDate()}
                  minimumDate={moment().subtract(90, 'years').toDate()}
                  confirmTextStyle={{
                    color: COLORS.BLUE,
                  }}
                  cancelTextStyle={{color: COLORS.BLUE}}
                  titleIOS="Select Date"
                  Medium16={{
                    color: COLORS.BLUE,
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

const STATE = state => ({user: state.user.user});
export default connect(STATE)(EditPersonalInfo);

const styles = StyleSheet.create({
  subContainer: {width: '100%', height: '100%'},
  rowView: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 45,
    alignItems: 'center',
    alignSelf: 'center',
  },
  labelStyle: {
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
    color: '#98a0ab',
  },
  calanderIcon: {width: 19, height: 19, alignSelf: 'center', marginRight: 10},
  dobView: {
    marginTop: 5,
    backgroundColor: 'transparent',
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    width: '90%',
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'center',
    height: getCalculated(39),
    flexDirection: 'row',
  },
  dobText: dob => ({
    paddingLeft: 10,
    fontSize: dob == 'Select Date' ? getCalculated(12) : getCalculated(15.5),
    color: dob == 'Select Date' ? '#666666' : '#242634',
    alignSelf: 'center',
  }),
  textFiledBgViewStyle: {
    height: getCalculated(88),
    width: '90%',
    alignSelf: 'center',
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    borderRadius: 6,
    marginTop: 7,
  },
  textFieldcustom: {
    fontSize: getCalculated(15.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    padding: 10,
  },
  saveBtn: {width: getCalculated(60), alignSelf: 'center', marginTop: 20},
});
