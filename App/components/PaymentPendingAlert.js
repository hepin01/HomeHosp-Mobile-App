import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {webview} from '../networking/Constats';
import {getWebViewUrl} from '../utiles/common';
import {AlertModal} from './AlertModal';

const PaymentPendingAlert = ({visible = false, moreThanThree = false, setShowModal}) => {
  const navigation = useNavigation();
  const webviewUri = getWebViewUrl('profile/payment-info/');
  const message = moreThanThree
    ? 'You have payments pending for completed appointments. Please click on the "Pay" button to pay from the Payment section.\n\nNote: You can continue booking with 2 appointments pending for payments.'
    : 'You have payments pending for completed appointments. Please click on the "Pay" button to pay from the Payment section.';
  return (
    <AlertModal
      modalVisible={visible}
      title="Alert"
      message={message}
      leftButtonTitle="Pay"
      rightButtonTitle={"Close"}
      rightButtonAction={() => setShowModal(false)}
      leftButtonAction={() => {
        setShowModal(false);
        navigation.navigate(webview, {
          uri: webviewUri,
          title: 'Payment Information',
        });
      }}
    />
  );
};

export default PaymentPendingAlert;

const styles = StyleSheet.create({});
