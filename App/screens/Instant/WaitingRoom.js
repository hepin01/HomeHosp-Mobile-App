import moment from 'moment';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import images from '../../assets/images';
import { COLORS, commonStyles, getCalculated } from '../../components/Common';
import {
  updateCallDurationProvider,
  completeAppointment,
  getInstantConsultationAppointments,
} from '../../networking/APIMethods';
import {
  updateChiefComplaints,
  updateIntakeDocuments,
  updateQuestions,
  updateSelectedDuration,
  updateSelectedFrequency,
  updateISSwd,
  updateSugar,
  updateBP,
  updateheartRate,
  updateHeight,
  updateWeight,
  updateBMI,
  updateOxygen,
  updateIsAgree,
} from '../../redux/BookAppointmentActions';
import { getUTCIso, isProvider, userId } from '../../utiles/common';
import Base from '../Base/Base';
import { BillingCode } from './BiilingCode';
import PatientCell from './PatientCell';

class WaitingRoom extends Base {
  constructor(props) {
    super(props);
    this.state = {
      arrPatients: [],
    };
  }

  componentDidMount() {
    this.getPatientList();
  }

  getPatientList() {
    this.showLoader('');
    const payload = {
      isWaiting: true,
      isPatientRequested: false,
      startDate: getUTCIso(),
    };
    getInstantConsultationAppointments(
      payload,
      response => {
        this.dismissLoader();
        this.setState({ arrPatients: response?.data });
      },
      error => {
        this.dismissLoader();
        console.log(error);
        this.displayErrorMsg(error);
      },
    );
  }

  handleIntakeForm(data) {
    const {
      documents,
      intakeSummary,
      chiefComplaints,
      height,
      hasSmartWatch,
      sugarLevel,
      bloodPressure,
      heartRate,
      weight,
      bmi,
      oxygen,
      shareInfoCareTakers,
      durationNo,
      durationType,
    } = data.intakeForm;
    updateISSwd(hasSmartWatch);
    updateSugar(sugarLevel);
    updateBP(bloodPressure);
    updateheartRate(heartRate);
    updateHeight(heartRate);
    updateWeight(weight);
    updateBMI(bmi);
    updateOxygen(oxygen);
    updateChiefComplaints(chiefComplaints);
    updateSelectedFrequency(durationType);
    updateSelectedDuration(durationNo);
    updateIntakeDocuments(documents);
    updateIsAgree(shareInfoCareTakers);
    const modQues = intakeSummary.map(ele => {
      if (ele.answer.length) {
        return {
          ...ele,
          isYes: true,
        };
      }
      return ele;
    });
    updateQuestions(modQues);
    this.props.navigation.navigate('IntakeForm');
  }

  render() {
    const { arrPatients } = this.state;
    return (
      <View style={styles.container}>
        {this.progressLoader()}
        {arrPatients.length ? (
          <FlatList
            data={arrPatients}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 200 }}
            renderItem={({ item, index }) => (
              <PatientCell
                item={item}
                onItemPressed={() => { }}
                onConnectPressed={() => {
                  this.props.navigation.navigate('TwilioCall', {
                    popCount: 2,
                    appointmentData: {
                      from: isProvider() ? 'provider' : 'patient',
                      appointmentId: item?._id,
                      callDuration: item.callDuration,
                    },
                    isInstantConsultation: true,
                    item: item,
                  });
                }}
                onIntakePressed={() => this.handleIntakeForm(item)}
                showWaitingView
              />
            )}
          />
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image source={images.nodatafound} style={styles.noDataImage} resizeMode="contain" />
            <Text style={commonStyles.Regular12}>No Records Found</Text>
          </View>
        )}
        {this.progressLoader()}
      </View>
    );
  }

  updateCallDurationProvider() {
    const { user } = this.props;
    const indentity = {
      fName: user.firstname + ' ' + user.lastname,
      userId: userId(),
      userType: isProvider() ? 'provider' : 'patient',
    };
    const payload = {
      identity: JSON.stringify(indentity),
      appointmentId: '<appointmentId>',
    };
    updateCallDurationProvider(
      payload,
      response => { },
      error => { },
    );
  }

  completeAppointment() {
    const { user } = this.props;
    const indentity = {
      fName: user.firstname + ' ' + user.lastname,
      userId: userId(),
      userType: isProvider() ? 'provider' : 'patient',
    };
    const payload = {
      identity: JSON.stringify(indentity),
      appointmentId: '<appointmentId>',
    };
    completeAppointment(
      payload,
      response => { },
      error => { },
    );
  }
}

const STATE = state => ({ user: state.user.user });
export default connect(STATE)(WaitingRoom);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getCalculated(10),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: getCalculated(15),
  },
  noAwards: {
    width: getCalculated(104),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    width: '75%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});
