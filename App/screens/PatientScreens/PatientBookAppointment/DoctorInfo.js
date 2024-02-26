/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import moment from 'moment';
import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { color } from 'react-native-reanimated';
import { connect } from 'react-redux';
import images from '../../../assets/images';
import { commonStyles, COLORS, getCalculated } from '../../../components/Common';
import DatePicker from '../../../components/DatePicker';
import ImageLoader from '../../../components/ImageLoader';
import { Radio } from '../../../components/Radio';
import { SmallButton } from '../../../components/SmallButton';
import { checkForTodaysInsApp } from '../../../networking/APIMethods';
import { getUTCIso, userId } from '../../../utiles/common';
import Base from '../../Base/Base';

class DoctorInfo extends Base {
  constructor(props) {
    super(props);
    this.state = {
      doctorDetails: null,

      appointmentType: 'new',
      arrDuration: [],
      selectedDate: null,
      isViewOnly: false,
    };
  }

  componentDidMount() {
    let appointmentType = 'new';
    const {
      appointmentTypeNew = false,
      modeTypeAudio = false,
      isOnline = false,
    } = this.props;
    const { doctorDetails, viewOnly = false } = this.props.route.params;
    if (viewOnly) {
      this.setState({ isViewOnly: viewOnly });
    }
    let billingCode = doctorDetails.billingCodes;
    if (!appointmentTypeNew) {
      if (isOnline) {
        if (modeTypeAudio) {
          billingCode = doctorDetails?.followUpBillingAudioCodes;
        } else {
          billingCode = doctorDetails?.followUpBillingCodes;
        }
      }
      if (!isOnline) {
        if (modeTypeAudio) {
          billingCode = doctorDetails?.insuranceFollowUpAudioBillingCodes;
        } else {
          billingCode = doctorDetails?.insuranceFollowUpBillingCodes;
        }
      }
    } else {
      if (!isOnline) {
        billingCode = doctorDetails?.insuranceBillingCodes;
      } else {
        billingCode = doctorDetails?.billingCodes;
      }
    }

    const durations = billingCode?.filter((item) => !!item.amountCharged).map((item, index) => {
      const { timeDuration, amountCharged } = item;
      return {
        id: index + 1,
        label: `${timeDuration} mins - $${amountCharged}`,
        selected: false,
      };
    });

    if (!appointmentTypeNew && !modeTypeAudio) {
      appointmentType = 'followup';
    } else if (!appointmentTypeNew && modeTypeAudio) {
      appointmentType = 'audiofollowup';
    }
    this.setState({
      arrDuration: durations,
      doctorDetails: doctorDetails,
      appointmentType: appointmentType,
    });
  }

  showDoctorInfoView() {
    const { doctorDetails } = this.state;
    const {
      _id,
      firstname,
      lastname,
      profileImageS3Link,
      providerType,
      providerSubType,
      preferredByPatients,
      providerInformation: { city, state, about },
    } = doctorDetails;
    const genderLetter = doctorDetails?.providerInformation?.gender
      ? doctorDetails?.miniSurveyForm?.gender == 'male'
        ? 'Male'
        : 'Female'
      : '';
    const isPreferred = preferredByPatients.includes(userId());
    return (
      <View>

        <View style={[styles.subcontainer, { alignItems: "center", justifyContent: "center", marginTop: 20 }]}>
          <ImageLoader
            style={styles.imageLogo}
            url={{ uri: profileImageS3Link }}
            placeholder={images.userdefault}
          />
        </View>

        <View style={styles.textView}>
          <Text style={commonStyles.Bold18}>
            Dr. {firstname + ' ' + lastname + ' '}
          </Text>
          <Text style={[commonStyles.Medium125, { paddingVertical: 5, marginTop: 5 }]}>
            {genderLetter +
              (doctorDetails?.providerInformation?.dob
                ? ' (' +
                moment().diff(
                  doctorDetails?.providerInformation?.dob,
                  'years',
                ) + " years" +
                ')'
                : '')}
          </Text>
          <View style={styles.smallRowView}>
            <View style={[styles.miniRowView, {
              justifyContent: "center",
              borderWidth: 2,
              width: "50%",
              borderRadius: 20,
              borderColor: isPreferred ? COLORS.BLUE : COLORS.LIGHTER_GREY
            }]}>
              <Image
                style={styles.startIcon}
                source={
                  isPreferred ? images.staractiveicon : images.stardeactiveicon
                }
              />
              <Text style={[commonStyles.RegularGrey11]}>
                {isPreferred ? 'Preferred Doctor' : 'Not Preferred'}
              </Text>
            </View>
          </View>

        </View>
        <View style={[styles.docCellView, styles.shadow]}>
          <Text style={styles.textTitle}>About</Text>
          <Text style={styles.detailText}>{about}</Text>
        </View>

        <View style={[styles.docCellView, styles.shadow]}>
          <Text style={styles.textTitle}>Contact Details</Text>
          <View style={styles.miniRowView}>
            <Image style={styles.locationIcon} source={images.map} />
            <Text style={[commonStyles.RegularGrey135, { width: "90%" }]}>
              {city}, {state}
            </Text>
          </View>
        </View>
        <View style={[styles.docCellView, styles.shadow]}>
          <Text style={styles.textTitle}>Specialities</Text>
          <Text style={styles.detailText}>{`${providerType},\n${providerSubType}`}</Text>

        </View>
      </View>
    );
  }

  handleDurationSelected(item) {
    const { arrDuration } = this.state;
    const modDuration = arrDuration.map(element => {
      if (element.id == item.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      } else if (element.selected) {
        return {
          ...element,
          selected: false,
        };
      } else {
        return element;
      }
    });
    this.setState({ arrDuration: modDuration });
  }

  showAptConsulationView() {
    const { appointmentType, arrDuration } = this.state;
    return (
      <View style={[styles.docCellView, styles.shadow]}>
        <View style={[styles.subcontainer]}>
          <Text style={commonStyles.Bold15}>Select Appointment Type</Text>
          <View style={styles.aptTypeRowView}>
            <Radio
              disabled={true}
              style={styles.radioBtn}
              isChecked={appointmentType == 'new'}
              title={'New'}
              checkmarkAction={() => {
                this.setState({ appointmentType: 'new' });
              }}
            />
            <Radio
              disabled={true}
              style={styles.radioBtn}
              isChecked={appointmentType == 'followup'}
              title={'Follow - Up'}
              checkmarkAction={() => {
                this.setState({ appointmentType: 'followup' });
              }}
            />
            <Radio
              disabled={true}
              style={styles.radioBtn}
              isChecked={appointmentType == 'audiofollowup'}
              title={'Follow - Up - Audio'}
              checkmarkAction={() => {
                this.setState({ appointmentType: 'audiofollowup' });
              }}
            />
          </View>
          <Text style={styles.textHeader}>Select Consultation Time</Text>
          <View style={styles.aptTypeRowView}>
            {arrDuration.length ? (
              arrDuration.map((item, index) => (
                <Radio
                  key={index.toString()}
                  style={styles.radioBtnTime}
                  isChecked={item.selected}
                  title={item.label}
                  checkmarkAction={() => {
                    this.handleDurationSelected(item);
                  }}
                />
              ))
            ) : (
              <View style={styles.noTimeSlots}>
                <Text style={commonStyles.Regular12}>
                  Consultation timings not available
                </Text>
              </View>
            )}
          </View>

          <DatePicker
            minStartDate={new Date()}
            onStartDateSelection={date => this.setState({ selectedDate: date })}
          />
        </View>
      </View>
    );
  }

  showAvailabilityClicked() {
    const { arrDuration, selectedDate, doctorDetails } = this.state;
    const selectedSlot = arrDuration.find(item => item.selected);
    const { isOnline } = this.props;
    if (!isOnline) {
      // this.showLoader();
      checkForTodaysInsApp(
        //converts local current date and time to utc and send to server to get the slots of the date
        { date: getUTCIso(selectedDate) },
        response => {
          this.dismissLoader();
          if (response == undefined) {
            this.props.navigation.navigate('SessionSlots', {
              doctorDetails: doctorDetails,
              fromBookAppoitnment: true,
              selectedSlot: selectedSlot,
              selectedDate: selectedDate,
            });
          } else {
            this.dismissLoader();
            Alert.alert(
              'Add new Insurance Appointment',
              'You cannot add a new appointment using insurance as payment mode, as for the selected date a insurance appointment already exists.',
            );
          }
        },
        error => { },
      );
    } else {
      this.props.navigation.navigate('SessionSlots', {
        doctorDetails: doctorDetails,
        fromBookAppoitnment: true,
        selectedSlot: selectedSlot,
        selectedDate: selectedDate,
      });
    }
  }

  render() {
    const { doctorDetails, selectedDate, arrDuration, isViewOnly } = this.state;
    const disableSaveBtn =
      moment.isMoment(selectedDate) && arrDuration.some(item => item.selected);
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ width: '100%' }}>
          {doctorDetails ? this.showDoctorInfoView() : null}
          {isViewOnly == false ? this.showAptConsulationView() : null}
          {isViewOnly == false ? (
            <SmallButton
              disabled={!disableSaveBtn}
              style={styles.saveBtn(!disableSaveBtn)}
              buttonTitle={'Show Availability'}
              buttonAction={() => {
                this.showAvailabilityClicked();
              }}
            />
          ) : null}
        </ScrollView>
        {this.progressLoader()}
      </View>
    );
  }
}
const mapStateToProps = ({ bookedAppointment }) => ({
  isOnline: bookedAppointment.isOnline,
  modeTypeAudio: bookedAppointment.modeTypeAudio,
  appointmentTypeNew: bookedAppointment.appointmentTypeNew,
});

export default connect(mapStateToProps)(DoctorInfo);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    // padding: getCalculated(15)
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
    marginVertical: 7,
    paddingVertical: 10,
    paddingHorizontal: 5
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
    // width: '100%',
    marginTop: 10,

  },
  miniRowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    // flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  textView: {
    width: '100%',
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 15,

  },
  imageLogo: {
    width: getCalculated(95),
    height: getCalculated(95),
    resizeMode: 'cover',
    borderRadius: 60,
    alignSelf: 'flex-start',
  },
  descStyle: { marginBottom: 5 },
  locationIcon: {
    width: getCalculated(16),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  startIcon: {
    width: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  actionButtons: { alignSelf: 'flex-start' },
  textTitle: {
    ...commonStyles.Bold15,
    margin: 5,
  },
  textHeader: {
    ...commonStyles.Bold15,
    marginTop: 20,
  },
  detailText: {
    ...commonStyles.Regular135,
    marginHorizontal: 10,
  },
  aptTypeRowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    width: '100%',
    height: 'auto',
    flexWrap: 'wrap',
  },
  radioBtn: { marginRight: 20, marginTop: 10, marginBottom: 5 },
  radioBtnTime: { marginRight: 20, marginTop: 10, marginBottom: 5, width: 140 },
  containerDurations: {
    marginTop: getCalculated(14),
    // marginBottom: getCalculated(19),
  },
  textDuration: {
    ...commonStyles.Regular135,
    marginBottom: getCalculated(15),
  },
  imgSelectImg: {
    height: getCalculated(19),
    width: getCalculated(19),
  },
  durationSubContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  saveBtn: disable => ({
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: disable ? COLORS.LIGHTER_GREY : COLORS.BLUE,
  }),
  noTimeSlots: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getCalculated(15),
  },
});
