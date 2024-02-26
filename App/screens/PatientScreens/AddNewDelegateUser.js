import React from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {Checkmark} from '../../components/Checkmark';
import {commonStyles, COLORS, getCalculated} from '../../components/Common';
import {SmallButton} from '../../components/SmallButton';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {validateEnteredCharacters, validatePhone} from '../../utiles/validator';
import Base from '../Base/Base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  displayErrorMsg,
  getCurrentTimezone,
  getWebViewUrl,
  userId,
} from '../../utiles/common';
import {addNewDelegateUser, checkEmail} from '../../networking/APIMethods';
import {AlertModal} from '../../components/AlertModal';
import images from '../../assets/images';

class AddNewDelegateUser extends Base {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      relation: 0, //0 = Family, 1=Friend, 2=Other,
      phone: '',
      showSuccess: false,
    };
  }

  componentDidMount() {}

  addNewDelegateUser = () => {
    this.checkIfEmailExists()
      .then(response => {
        const {
          firstName,
          lastName,
          email,
          relation, //0 = Family, 1=Friend, 2=Other,
          phone,
        } = this.state;
        let isValid = true;
        const relationWithMember =
          relation == 0
            ? 'Family'
            : relation == 1
            ? 'Friend'
            : relation == 2
            ? 'Other'
            : 'NA';
        if (firstName.trim().length == 0) {
          isValid = false;
          displayErrorMsg("Oops! Your first name can't be blank.");
        } else if (!this.validateForAlphabets(firstName.trim())) {
          isValid = false;
          displayErrorMsg(
            "Oops! Your first name can't contain numbers or special characters.",
          );
        } else if (lastName.trim().length == 0) {
          isValid = false;
          displayErrorMsg("Oops! Your last name can't be blank.");
        } else if (!this.validateForAlphabets(lastName.trim())) {
          isValid = false;
          displayErrorMsg(
            "Oops! Your last name can't contain numbers or special characters.",
          );
        } else if (!this.emailValidator()) {
          isValid = false;
          displayErrorMsg('Oops! The email address seems to be incorrect');
        } else if (response) {
          isValid = false;
          displayErrorMsg(
            'Oops! This email address is already registered on the platform. Please use another.',
          );
        } else if (!this.checkMobileNumber(phone)) {
          isValid = false;
        }

        if (isValid) {
          this.showLoader('');
          const payload = {
            email: email,
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            invitedBy: userId(), //0 = Family, 1=Friend, 2=Other,
            relationWithDelegatedUser: relationWithMember,
            contactnumber: phone,
          };
          addNewDelegateUser(
            payload,
            response => {
              this.setState({showSuccess: true});
              this.dismissLoader();
            },
            error => {
              this.dismissLoader();
              displayErrorMsg(error);
            },
          );
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  renderAlertBody = () => {
    return (
      <View style={styles.alertContainer}>
        <Image style={styles.alertImg} source={images.successwithcircle} />
        <Text style={[commonStyles.Medium16, {margin: 15}]}>{'Success'}</Text>
        <Text style={commonStyles.Regular135}>
          {'Invitation has been sent successfully!'}
        </Text>
      </View>
    );
  };

  checkIfEmailExists = () => {
    return new Promise((resolve, reject) => {
      const payload = {
        query: {email: this.state.email, userType: {$ne: 'patient'}},
        select: {email: 1},
      };
      checkEmail(
        payload,
        response => {
          resolve(response);
        },
        error => {
          reject(false);
          console.log(error);
        },
      );
    });
  };

  emailValidator = () => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(this.state.email).toLowerCase());
  };

  checkMobileNumber = () => {
    this.showLoader('');
    const {phone} = this.state;
    if (phone?.length == 0) {
      displayErrorMsg('Oops! Please enter a mobile number here');
    } else if (!phone || phone.length < 1) {
      this.dismissLoader();
      displayErrorMsg('Oops! Please enter a valid mobile number');
      return false;
    } else if (phone.length < 10) {
      this.dismissLoader();
      displayErrorMsg('Oops! Please enter a valid mobile number');
      return false;
    }
    return true;
  };

  validateForAlphabets = str => {
    const regex = /^[A-Za-z ]+$/;
    return regex.test(str);
  };

  render() {
    const {firstName, lastName, relation, email, phone, showSuccess} =
      this.state;
    const disableSave =
      firstName.length == 0 ||
      lastName.length == 0 ||
      email.length == 0 ||
      phone.length == 0;
    return (
      <View style={commonStyles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{width: '100%'}}
          contentContainerStyle={styles.subContainer}>
          <TextFieldComponent
            style={{marginTop: 10}}
            value={firstName}
            placeholder={'First Name'}
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
            style={{marginTop: 40}}
            value={lastName}
            placeholder={'Last Name'}
            onChangeText={text => {
              this.setState({lastName: text});
            }}
            textContentType="familyName"
            onSubmitEditing={() => {}}
            autoCapitalize="words"
            maxLength={30}
            blurOnSubmit={false}
          />
          <Text style={[commonStyles.Medium135, styles.labelStyle]}>
            {'Relation with you*'}
          </Text>
          <View style={styles.rowView}>
            <Checkmark
              style={styles.checkMark}
              isChecked={relation == 0}
              title={'Family'}
              checkmarkAction={() => {
                this.setState({relation: 0});
              }}
            />
            <Checkmark
              style={styles.checkMark}
              isChecked={relation == 1}
              title={'Friend'}
              checkmarkAction={() => {
                this.setState({relation: 1});
              }}
            />
            <Checkmark
              style={styles.checkMark}
              isChecked={relation == 2}
              title={'Other'}
              checkmarkAction={() => {
                this.setState({relation: 2});
              }}
            />
          </View>
          <TextFieldComponent
            style={{marginTop: 10}}
            value={email}
            placeholder={'Email ID'}
            returnKeyType="next"
            onChangeText={text => {
              this.setState({email: text});
            }}
            textContentType="emailAddress"
            keyboardType="email-address"
            onSubmitEditing={() => {}}
            autoCapitalize="none"
            maxLength={225}
            blurOnSubmit={false}
          />

          <Text style={[commonStyles.Regular12, styles.labelStylePhone]}>
            Phone Number
          </Text>
          <View style={styles.phoneView}>
            <Text style={styles.countryCode}>+1</Text>
            <TextInput
              style={[styles.countryCode, styles.phoneTxtInput]}
              value={phone}
              allowFontScaling={false}
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
          {/* {isMobileValid && phone.length > 0 ? (
            <View style={styles.errorMessageContainer}>
              <Text style={commonStyles.Regular11Red}>
                Oops! Please enter a mobile number here
              </Text>
            </View>
          ) : null} */}
          <View style={styles.rowBtnView}>
            <SmallButton
              style={styles.saveBtn(disableSave)}
              buttonTitle={'Save'}
              buttonAction={() => {
                this.addNewDelegateUser();
              }}
              disabled={disableSave}
            />
            <SmallButton
              style={styles.resetBtn}
              buttonTitle={'Cancel'}
              buttonAction={() => {
                this.props.navigation.pop();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <AlertModal
          modalVisible={showSuccess}
          renderItem={this.renderAlertBody()}
          leftButtonAction={() =>
            this.setState(
              {
                firstName: '',
                lastName: '',
                email: '',
                relation: 0,
                phone: '',
                showSuccess: false,
              },
              () => {
                const {
                  navigation,
                  route: {params},
                } = this.props;
                if (!!params?.fetchDelegateUsers) params?.fetchDelegateUsers();
                navigation.pop();
              },
            )
          }
        />
        {this.progressLoader()}
      </View>
    );
  }
}

export default AddNewDelegateUser;

const styles = StyleSheet.create({
  subContainer: {width: '100%'},
  rowView: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 15,
    // alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-start',
  },
  labelStyle: {width: '90%', marginTop: 40, alignSelf: 'center'},
  checkMark: {marginRight: 20},
  phoneView: {
    flexDirection: 'row',
    height: getCalculated(45),
    width: '90%',
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  countryCode: {
    width: getCalculated(55),
    height: getCalculated(40),
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
  labelStylePhone: {
    width: '90%',
    marginTop: 40,
    alignSelf: 'center',
    color: COLORS.LIGHT_GRAY,
  },
  phoneTxtInput: {
    width: '77%',
    textAlign: 'left',
    paddingLeft: 10,
    height: getCalculated(40),
  },
  rowBtnView: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  saveBtn: disbale => ({
    width: getCalculated(70),
    alignSelf: 'center',
    marginHorizontal: 10,
    backgroundColor: disbale ? COLORS.LIGHTER_GREY : COLORS.BLUE,
  }),
  resetBtn: {
    width: getCalculated(70),
    alignSelf: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    marginHorizontal: 10,
  },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCalculated(15),
  },
  alertImg: {
    resizeMode: 'contain',
    resizeMethod: 'resize',
    height: getCalculated(60),
    width: getCalculated(60),
  },
  errorMessageContainer: {
    marginVertical: getCalculated(5),
    width: '90%',
    marginTop: 5,
    paddingHorizontal: 15,
    // alignItems: 'center',
  },
});
