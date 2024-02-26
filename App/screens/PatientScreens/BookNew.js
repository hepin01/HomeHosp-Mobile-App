/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import images from '../../assets/images';
import {ButtonComponent} from '../../components/ButtonComponent';
import {commonStyles, COLORS, getCalculated} from '../../components/Common';
import PaymentPendingAlert from '../../components/PaymentPendingAlert';
import {
  getCustomerCards,
  getUserProfile,
  getUserStripePayments,
} from '../../networking/APIMethods';
import {webview} from '../../networking/Constats';
import {getWebViewUrl, paymentPending, userId} from '../../utiles/common';
import Base from '../Base/Base';

class BookNew extends Base {
  constructor(props) {
    super(props);
    this.state = {
      insuranceAvailable: false,
      cardsAvailable: false,
      showNotice: false,
      moreThenThree: false,
    };
  }

  componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', () => {
      this.fetchStripePayments();
    });
  }

  fetchUserInfo(completion) {
    // this.showLoader('');
    getUserProfile(
      response => {
        const {
          user: {policyNumber = '', insuranceName = '', insuranceIdNumber = ''},
        } = response;
        // this.dismissLoader();
        this.setState(
          {
            insuranceAvailable:
              policyNumber.length &&
              insuranceName.length &&
              insuranceIdNumber.length,
          },
          () => {
            completion && completion();
          },
        );
      },
      error => {
        console.log(error);
        completion && completion();
        this.displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  }

  fetchStripePayments() {
    this.showLoader();
    getUserStripePayments(
      ({data}) => {
        this.dismissLoader();
        if (data.length !== 0) {
          this.setState({
            showNotice: true,
            moreThanThree: data.length == 3,
          });
        }
      },
      e => {
        console.log(e);
        this.dismissLoader();
      },
    );
  }

  getCustomersCards(completion) {
    // this.showLoader('');
    getCustomerCards(
      {userId: userId()},
      response => {
        this.dismissLoader();
        if (Array.isArray(response?.data)) {
          if (response?.data) {
            this.setState(
              {cardsAvailable: true},
              () => completion && completion(),
            );
          } else {
            this.setState(
              {cardsAvailable: false},
              () => completion && completion(),
            );
          }
        } else {
          completion && completion();
        }
      },
      error => {
        console.log(error);
        this.dismissLoader();
        completion && completion();
      },
    );
  }

  InstantConsultationAction() {
    this.fetchUserInfo(() => {
      this.getCustomersCards(() => {
        if (this.state.cardsAvailable || this.state.insuranceAvailable) {
          this.props.navigation.navigate('InstantAppListing');
        } else {
          const webviewUri = getWebViewUrl('profile/payment-info/');
          Alert.alert(
            'Oops!',
            'Please complete your payment information details to continue with instant consultation.',
            [
              {
                text: 'Add Payment Information',
                onPress: () => {
                  this.props.navigation.navigate(webview, {
                    uri: webviewUri,
                    title: 'Payment Information',
                  });
                },
              },
            ],
          );
        }
      });
    });
  }

  ScheduleAptAction() {}
  render() {
    const {showNotice, moreThanThree} = this.state;
    return (
      <View style={commonStyles.container}>
        {this.progressLoader()}
        <PaymentPendingAlert
          visible={showNotice}
          setShowModal={bool => this.setState({showNotice: bool})}
          moreThanThree={moreThanThree}
        />
        <Image style={styles.illustration} source={images.illustration}></Image>
        <Text style={[commonStyles.Regular135, styles.stepInsideText]}>
          {
            'Get Phone and Video consultation or schedule appointment with provider from comfort of your home.'
          }
        </Text>

        <ButtonComponent
          style={{marginTop: 20, width: '90%'}}
          buttonTitle={'Instant Consultation'}
          buttonAction={() => {
            if (moreThanThree) {
              this.setState({showNotice: true});
            } else {
              this.InstantConsultationAction();
            }
          }}
        />

        <ButtonComponent
          style={{marginTop: 20, width: '90%'}}
          buttonTitle={'Book Appointment'}
          buttonAction={() => {
            if (moreThanThree) {
              this.setState({showNotice: true});
            } else {
              this.props.navigation.navigate('PatientBookAppointment');
            }
          }}
        />
      </View>
    );
  }
}

const STATE = state => ({user: state.user.user});
export default connect(STATE)(BookNew);

const styles = StyleSheet.create({
  illustration: {
    alignSelf: 'center',
    width: getCalculated(150),
    resizeMode: 'contain',
  },
  stepInsideText: {
    alignSelf: 'center',
    margin: 20,
    textAlign: 'center',
    width: '80%',
  },
});
