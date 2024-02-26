/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Store} from '../../../../App';
import images from '../../../assets/images';
import {commonStyles, COLORS, getCalculated} from '../../../components/Common';
import ImageLoader from '../../../components/ImageLoader';
import {SmallButton} from '../../../components/SmallButton';
import {RESET_BOOK_APPOINTMENT} from '../../../redux/BookAppointmentReducer';
import Base from '../../Base/Base';

class AppointmentSuccess extends Base {
  constructor(props) {
    super(props);
    this.state = {
      doctorDetails: {},
    };
  }

  componentDidMount() {}

  render() {
    const {doctorDetails = {}, objAppointment = {}} = this.props;
    if (Object.keys(doctorDetails).length) {
      const {
        _id,
        firstname,
        lastname,
        profileImageS3Link,
        providerType,
        providerSubType,
        preferredByPatients,
        providerInformation: {city, state, about},
      } = doctorDetails;
      const genderLetter = doctorDetails?.providerInformation?.gender
        ? doctorDetails?.miniSurveyForm?.gender == 'male'
          ? 'M'
          : 'F'
        : '';
      return (
        <View style={commonStyles.container}>
          <Image style={styles.successImage} source={images.circlewiththumb} />
          <Text style={styles.headerText}>
            Your appointment request has been sent.
          </Text>
          <Text style={styles.detailText}>
            You will be notified as doctor accepts your appointment.
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
                    {firstname + ' ' + lastname + ' '}
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
                  {city}, {state}
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
                    {objAppointment?.slots.length +
                      ' ' +
                      (objAppointment?.slots.length == 1 ? 'Slot ' : 'Slots ') +
                      'Total Duration -' +
                      objAppointment?.duration +
                      ' Mins'}
                    ),
                  </Text>
                  <Text style={commonStyles.RegularDark11}>
                    {moment(objAppointment.startDate).format('dddd, MMMM DD, YYYY')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[commonStyles.line, {alignSelf: 'center'}]} />
            <View style={styles.smallRowView}>
              <View style={styles.miniRowView}>
                <Image style={styles.followup} source={images.calenderdark} />
                <Text style={commonStyles.Regular125}>
                  {' '}
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

          <SmallButton
            buttonTitle={'Finish'}
            style={styles.btnDone}
            buttonAction={() => {
              this.props.navigation.navigate('Appointments',{ screen: "Awards"});
              Store.dispatch({type: RESET_BOOK_APPOINTMENT});
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = ({bookedAppointment}) => {
  return {
    doctorDetails: bookedAppointment.selectedDoctor,
    objAppointment: bookedAppointment.objAppointment,
    appointmentDate: bookedAppointment.appointmentDate
  };
};

export default connect(mapStateToProps)(AppointmentSuccess);

const styles = StyleSheet.create({
  successImage: {
    width: getCalculated(79),
    resizeMode: 'contain',
    height: getCalculated(79),
    marginVertical: 20,
  },
  headerText: {...commonStyles.Bold15, width: '70%', textAlign: 'center'},
  detailText: {
    ...commonStyles.Regular125,
    width: '70%',
    textAlign: 'center',
    marginTop: 10,
  },
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
    marginVertical: 20,
    paddingBottom: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.65,
    elevation: 1,
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
  btnDone: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: getCalculated(12),
    paddingHorizontal: getCalculated(13),
    backgroundColor: COLORS.BLUE,
  },
});
