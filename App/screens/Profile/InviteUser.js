/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Checkmark} from '../../components/Checkmark';
import {commonStyles} from '../../components/Common';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {SmallButton} from '../../components/SmallButton';
import {userInvite} from '../../networking/APIMethods';
import {emailValidator} from '../../utiles/validator';
import {Messages} from '../../components/Messages';
import Base from '../Base/Base';

class InviteUser extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isProvider: false,
      email: '',
    };
    this.emailFld = this.emailFld;
  }

  componentDidMount() {}

  inviteBtnClicked() {
    const {email} = this.state;
    if (!email || email.length < 1) {
      this.displayErrorMsg(Messages.enterEmail);
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
        this.inviteUser();
      },
    );
  };

  inviteUser() {
    const {email, isProvider} = this.state;
    this.setState({email: ''});
    this.showLoader('');
    userInvite(
      email,
      isProvider ? 'provider' : 'patient',
      response => {
        this.dismissLoader();
        this.displayMsg(response?.message);
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  render() {
    const {isProvider, email} = this.state;
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.fpView}>
          <Text style={[commonStyles.Regular135, styles.titleStyle]}>
            {'Please choose user type you want to onboard on Homehosp'}
          </Text>
          <View style={styles.rowView}>
            <Checkmark
              style={{marginLeft: 0}}
              isChecked={isProvider}
              title={'Provider'}
              checkmarkAction={() => {
                this.setState({isProvider: true});
              }}
            />
            <Checkmark
              style={{marginLeft: 20}}
              isChecked={!isProvider}
              title={'Patient'}
              checkmarkAction={() => {
                this.setState({isProvider: false});
              }}
            />
          </View>

          <TextFieldComponent
            ref={input => {
              this.emailFld = input;
            }}
            style={{marginTop: 25}}
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
          <SmallButton
            style={{marginTop: 50, alignSelf: 'center'}}
            buttonTitle={'Invite'}
            buttonAction={() => {
              this.inviteBtnClicked();
            }}
          />
        </View>
        {this.progressLoader()}
      </View>
    );
  }
}

export default InviteUser;

const styles = StyleSheet.create({
  titleStyle: {textAlign: 'center', marginTop: 20},
  rowView: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 25,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
