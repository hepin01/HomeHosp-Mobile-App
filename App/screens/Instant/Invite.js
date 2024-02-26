import React, {useState} from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import images from '../../assets/images';
import {AlertModal} from '../../components/AlertModal';

import {commonStyles, COLORS, getCalculated} from '../../components/Common';
import {Loader} from '../../components/Loader';
import {SmallButton} from '../../components/SmallButton';
import {postInvitePatientInstant} from '../../networking/APIMethods';
import {displayErrorMsg} from '../../utiles/common';
import {emailValidator} from '../../utiles/validator';

const Invite = ({navigation: {pop}}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function validateEmail() {
    emailValidator(
      email,
      () => {
        displayErrorMsg('Oops! Please enter a valid email id');
      },
      () => sendInvite(),
    );
  }
  function sendInvite() {
    setLoading(true);
    const payload = {
      email: email?.toLowerCase(),
    };
    postInvitePatientInstant(
      payload,
      response => {
        setLoading(false);
        setShowSuccess(true);
      },
      error => {
        setLoading(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  function renderAlert() {
    return (
      <View style={styles.alertContainer}>
        <Image style={styles.alertImg} source={images.illustrationthumb} />
        <Text style={[commonStyles.Bold20, {margin: 15}]}>{'Great'}</Text>
        <Text style={[commonStyles.Regular135, {textAlign: 'center'}]}>
          Invitation for Instant Consultation has been sent successfully!
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      contentContainerStyle={{width: '100%'}}>
      <Loader modalVisible={loading} />
      <View style={{alignItems: 'center'}}>
        <Text style={styles.txtTile}>Patient not on platform ?</Text>
        <Text style={styles.txtDesc}>
          {
            ' No worries.\nWe will send an email invitation for patient to sign up.Once the patient is onboarded successfully , we will inform you & again you will be able to send the invite for the Instant consultation.'
          }
        </Text>
        <View
          style={{flexDirection: 'row', width: '100%', alignItems: 'flex-end'}}>
          <Text style={styles.labelEmailId}>Email ID</Text>
          <Image style={styles.img} source={images.illustrationInvite} />
        </View>
      </View>
      <TextInput
        value={email}
        keyboardType={'email-address'}
        onChangeText={text => setEmail(text)}
        style={styles.emailInput}
      />
      <SmallButton
        buttonTextStyle={{color: COLORS.BLUE}}
        style={styles.btnInvite}
        buttonTitle={'Invite'}
        buttonAction={() => validateEmail()}
      />
      <AlertModal
        modalVisible={showSuccess}
        leftButtonStyle={commonStyles.RegularWhite13}
        leftButtonTitle={'Done'}
        renderItem={renderAlert()}
        leftButtonAction={() => {
          pop();
          setShowSuccess(false);
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: COLORS.BLUE,
  },
  txtTile: {
    ...commonStyles.Bold17White,
    marginTop: getCalculated(15),
    marginBottom: getCalculated(8),
  },
  txtDesc: {
    ...commonStyles.Regular11White,
    textAlign: 'center',
    marginBottom: getCalculated(17),
  },
  img: {
    width: getCalculated(200),
    height: getCalculated(200),
    alignSelf: 'center',
  },
  labelEmailId: {
    paddingBottom: 10,
    fontFamily: 'Roboto',
    fontSize: getCalculated(11),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#a2d7ef',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  emailInput: {
    width: '100%',
    height: getCalculated(50),
    borderRadius: 10.3,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#1fa4dd',
    padding: 13,
    ...commonStyles.Regular155,
  },
  btnInvite: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    // borderColor: COLORS.BLUE,
    // borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCalculated(15),
  },
  alertImg: {
    resizeMode: 'contain',
    // resizeMethod: '',
    height: getCalculated(134),
    width: getCalculated(134),
  },
});
