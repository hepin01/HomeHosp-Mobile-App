/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import moment from 'moment';
import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Store} from '../../../../App';
import images from '../../../assets/images';
import {Checkmark} from '../../../components/Checkmark';
import {
  commonStyles,
  COLORS,
  getCalculated,
  window,
} from '../../../components/Common';
import ImageLoader from '../../../components/ImageLoader';
import {SmallButton} from '../../../components/SmallButton';
import {getUserProfile} from '../../../networking/APIMethods';
import {UPDATE_SELECTED_DOCTOR} from '../../../redux/BookAppointmentReducer';
import {charges, userId} from '../../../utiles/common';
import Base from '../../Base/Base';

class AppointmentConfirmation extends Base {
  constructor(props) {
    super(props);
    this.state = {
      doctorDetails: {},
      isAgree: false,
      totalCharges: 0,
      transactionFee: 0,
      useDetails: {},
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
    const {
      route: {
        params: {doctorDetails},
      },
    } = this.props;
    this.updateSelectedDoctor(doctorDetails);
    this.setState({doctorDetails: doctorDetails});
  }

  updateSelectedDoctor(obj) {
    Store.dispatch({
      type: UPDATE_SELECTED_DOCTOR,
      payload: obj,
    });
  }

  calculateFees() {
    let transactionCharge = 0;
    const {objAppointment, isOnline} = this.props;
    if (isOnline) {
      if (this.state.useDetails.isPatientChargesEnabled) {
        // formula to calcular target charge for deducting stripe charges from patient
        transactionCharge =
          (parseFloat(objAppointment?.price) +
            charges.adminFees +
            charges.stripeFixedCharge) /
          (1 - charges.stripePercentageCharge);
        this.setState({
          transactionFee: parseFloat(
            transactionCharge - objAppointment?.price - charges.adminFees,
          ).toFixed(2),
        });
      } else {
        transactionCharge =
          (parseFloat(objAppointment?.price) + charges.stripeFixedCharge) /
          (1 - charges.stripePercentageCharge);
        this.setState({
          transactionFee: parseFloat(
            transactionCharge - objAppointment?.price,
          ).toFixed(2),
        });
      }
      this.setState({
        totalCharges: parseFloat(transactionCharge).toFixed(2),
      });
    } else {
      this.setState({totalCharges: objAppointment?.price, transactionFee: 0});
    }
  }

  fetchUserInfo() {
    // this.showLoader('');
    getUserProfile(
      // payload,
      response => {
        this.setState({useDetails: response.user}, () => {
          this.calculateFees();
          this.dismissLoader();
        });
      },
      error => {
        this.displayErrorMsg(error);
        this.dismissLoader();
      },
    );
  }

  render() {
    const {isOnline, objAppointment, appointmentDate} = this.props;
    const {doctorDetails, isAgree, totalCharges, transactionFee} = this.state;
    const {
      _id,
      firstname,
      lastname,
      providerType,
      providerSubType,
      profileImageS3Link,
      providerInformation,
    } = doctorDetails;
    const genderLetter = doctorDetails?.providerInformation?.gender
      ? doctorDetails?.miniSurveyForm?.gender == 'male'
        ? 'M'
        : 'F'
      : '';
    return (
      <View style={commonStyles.container}>
        {this.progressLoader()}
        <ScrollView
          style={{width: '100%'}}
          contentContainerStyle={{width: '100%'}}>
          <Text
            style={{
              marginVertical: 15,
              alignSelf: 'flex-start',
              marginHorizontal: 18,
            }}>
            <Text style={commonStyles.Bold15}>Book Appointment with</Text>
            <Text style={commonStyles.Regular155Blue}>
              {' '}
              {'Dr. ' + firstname + ' ' + lastname + ' '}
            </Text>
          </Text>
          <View style={[styles.docCellView, styles.shadow]}>
            <View style={[styles.subcontainer]}>
              <View style={styles.rowView}>
                <ImageLoader
                  style={styles.imageLogo}
                  url={{uri: profileImageS3Link}}
                  placeholder={images.userdefault}
                />
                <View style={styles.textView}>
                  <Text style={commonStyles.Bold18}>
                    Dr. {firstname + ' ' + lastname + ' '}
                    <Text style={commonStyles.Regular115Blue}>
                      {genderLetter +
                        (doctorDetails?.providerInformation?.dob
                          ? ' (' +
                            moment().diff(
                              doctorDetails?.providerInformation?.dob,
                              'years',
                            ) +
                            ')'
                          : '')}
                    </Text>
                  </Text>
                  <Text
                    style={
                      commonStyles.Regular115Blue
                    }>{`${providerType},\n${providerSubType}`}</Text>
                </View>
              </View>

              <View style={styles.miniRowView}>
                <Image style={styles.locationIcon} source={images.map} />
                <Text style={commonStyles.RegularGrey11}>
                  {providerInformation?.city}, {providerInformation?.state}
                </Text>
              </View>

              <View style={styles.miniRowView}>
                <Image style={styles.clockIcon} source={images.clock} />
                <View style={{width: '95%'}}>
                  <Text
                    style={[commonStyles.Bold135, {alignSelf: 'flex-start'}]}>
                    {moment(objAppointment.startDate).format('hh:mm A')}
                  </Text>
                  <Text
                    style={[commonStyles.Bold135, {alignSelf: 'flex-start'}]}>
                    (
                    {objAppointment?.slots?.length +
                      ' ' +
                      (objAppointment?.slots?.length == 1
                        ? 'Slot '
                        : 'Slots ') +
                      'Total Duration -' +
                      objAppointment?.duration +
                      ' Mins'}
                    ),
                  </Text>
                  <Text style={commonStyles.RegularDark11}>
                    {moment(appointmentDate).format('dddd, MMMM DD, YYYY')}
                  </Text>
                </View>
              </View>

              <View style={styles.miniRowView}>
                <Image style={styles.clockIcon} source={images.fees} />
                <View style={{justifyContent: 'flex-start'}}>
                  <Text
                    style={[
                      commonStyles.Bold135,
                      {alignSelf: 'flex-start', marginBottom: 5},
                    ]}>
                    ${totalCharges}
                  </Text>
                  <Text>
                    <Text style={commonStyles.Regular135}>Provider Fee: </Text>
                    <Text style={[commonStyles.Bold135]}>
                      ${objAppointment?.price}
                    </Text>
                  </Text>
                  {isOnline ? (
                    this.state.useDetails.isPatientChargesEnabled ? (
                      <Text>
                        <Text style={commonStyles.Regular135}>Admin Fee: </Text>
                        <Text style={[commonStyles.Bold135]}>
                          ${charges.adminFees}
                        </Text>
                      </Text>
                    ) : null
                  ) : null}

                  {isOnline ? (
                    <Text>
                      <Text style={commonStyles.Regular135}>
                        Transaction Fee:{' '}
                      </Text>
                      <Text style={[commonStyles.Bold135]}>
                        ${transactionFee}
                      </Text>
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={[commonStyles.line, {alignSelf: 'center'}]} />
            <View style={styles.smallRowView}>
              <View style={styles.miniRowView}>
                <Image style={styles.followup} source={images.calenderdark} />
                <Text style={commonStyles.Regular125}>
                  {objAppointment?.appointmentType == 'followUp'
                    ? 'Follow-up'
                    : 'New'}
                </Text>
              </View>

              <View style={styles.miniRowView}>
                <Image
                  style={styles.cardIcon}
                  source={
                    objAppointment?.sessionType == 'telephonic'
                      ? images.callgrey
                      : images.videodark
                  }
                />
                <Text style={commonStyles.Regular125}>
                  {objAppointment?.sessionType == 'telephonic'
                    ? 'Audio Call'
                    : 'Video Call'}
                </Text>
              </View>

              <View style={styles.miniRowView}>
                <Image style={styles.cardIcon} source={images.paymentdark} />
                <Text style={commonStyles.Regular125}>
                  {objAppointment?.isInsurance == 'no' ? 'Online' : 'Insurance'}
                </Text>
              </View>
            </View>
          </View>
          <Checkmark
            style={styles.checkMark}
            isChecked={isAgree}
            showCheckbox
            title={
              'I agree to pay Administrative charges as and when applicable by the system.'
            }
            checkmarkAction={() => {
              this.setState({isAgree: !isAgree});
            }}
          />
          <View style={styles.btnContainer}>
            <SmallButton
              disabled={!isAgree}
              buttonTitle={'Confirm My Booking'}
              style={styles.btnDone(!isAgree)}
              buttonAction={() => this.props.navigation.navigate('ConsentForm')}
            />
            <SmallButton
              buttonTitle={'Cancel'}
              style={styles.btnDone(true)}
              buttonAction={() => this.props.navigation.pop()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = ({bookedAppointment}) => {
  return {
    isOnline: bookedAppointment.isOnline,
    appointmentDate: bookedAppointment.appointmentDate,
    objAppointment: bookedAppointment.objAppointment,
  };
};

export default connect(mapStateToProps)(AppointmentConfirmation);

const styles = StyleSheet.create({
  subcontainer: {
    borderRadius: getCalculated(8),
    paddingTop: getCalculated(10),
    width: '95%',
    alignSelf: 'center',
  },
  docCellView: {
    width: '90%',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 7,
    paddingBottom: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.65,
    elevation: 5,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    width: '100%',
    alignItems: 'center',
    height: 'auto',
  },
  smallRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '95%',
  },
  miniRowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // width: '90%',
    marginVertical: 5,
  },
  textView: {
    width: '80%',
    paddingHorizontal: 15,
    marginVertical: 0,
  },
  imageLogo: {
    width: getCalculated(55),
    height: getCalculated(55),
    resizeMode: 'cover',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  descStyle: {marginBottom: 5},
  locationIcon: {
    width: getCalculated(13),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  clockIcon: {
    width: getCalculated(15),
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginRight: 5,
    marginTop: -5,
  },
  followup: {
    height: getCalculated(15),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 3,
  },
  cardIcon: {
    height: getCalculated(12),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 3,
  },
  checkMark: {margin: 15, width: '80%'},
  btnDone: disabled => ({
    marginTop: 50,
    alignSelf: 'center',
    paddingVertical: getCalculated(12),
    paddingHorizontal: getCalculated(13),
    backgroundColor: disabled ? COLORS.LIGHT_GRAY : COLORS.BLUE,
  }),
  btnContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    marginTop: -20,
  },
});
