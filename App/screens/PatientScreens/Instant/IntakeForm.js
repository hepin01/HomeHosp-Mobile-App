import {connect} from 'react-redux';
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Loader} from '../../../components/Loader';
import {SmallButton} from '../../../components/SmallButton';
import {COLORS, getCalculated} from '../../../components/Common';
import StepTwoIntakeForm from '../PatientBookAppointment/steps/StepTwoIntakeForm';
import StepTwoIntakeCheif from '../PatientBookAppointment/steps/StepTwoIntakeCheif';
import {displayErrorMsg, userId} from '../../../utiles/common';
import {addInstantIntakeForm} from '../../../networking/APIMethods';
import {QuesRadio} from '../PatientBookAppointment/component/QuesRadio';
import {Store} from '../../../../App';
import {resetAppointment} from '../../../redux/BookAppointmentActions';

const IntakeForm = ({
  navigation,
  yesToAll,
  noToAll,
  questions,
  isSWD,
  sugar,
  BP,
  heartRate,
  height,
  weight,
  BMI,
  oxygen,
  isAgree,
  cheifComplain,
  selectedDuration,
  selectedFrequency,
  arrDocuments,
  route: {params: appointmentId},
}) => {
  const [fetching, setFetching] = useState(false);
  const [nextDisable, setNextDisable] = useState(true);
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [showChefComplain, setShowChefComplain] = useState(true);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isInsurance, setIsInsurance] = useState(false);

  function onPressNext() {
    setShowChefComplain(false);
    setShowSymptoms(true);
  }

  function onPressPrevious() {
    setShowChefComplain(true);
    setShowSymptoms(false);
    setNextDisable(false);
  }

  function onPressSubmit() {
    setFetching(true);
    
    let selectAllRadio = '';
    if (noToAll) {
      selectAllRadio = 'YesToNo';
    }
    if (yesToAll) {
      selectAllRadio = 'YesToAll';
    }
    const payload = {
      userId: userId(),
      reqParams: {
        selectAllRadio: selectAllRadio,
        chiefComplaints: cheifComplain,
        durationNo: selectedDuration,
        durationType: selectedFrequency,
        hasSmartWatch: isSWD,
        sugarLevel: sugar.length ? sugar : null,
        bloodPressure: BP.length ? BP : null,
        heartRate: heartRate.length ? heartRate : null,
        height: height.length ? height : null,
        weight: weight.length ? weight : null,
        bmi: BMI.length ? BMI : null,
        oxygen: oxygen.length ? oxygen : null,
        shareInfoCareTakers: isAgree,
        documents: filesToUpload,
        intakeSummary: questions,
        isInsurance: isInsurance == true ? 'Yes' : 'No',
      },
      instantConsultationId: appointmentId.appointmentId,
    };
    console.log(JSON.stringify(payload))
    addInstantIntakeForm(
      payload,
      response => {
        setFetching(false);
        resetAppointment();
        Alert.alert(
          'Success',
          'Your intake form is submitted successfully and provider will be joining the call shortly. Please wait until provider joins the call.',
          [
            {
              text: 'Connect',
              onPress: () => {
                const {
                  user: {
                    user: {userType},
                  },
                } = Store.getState();
                navigation.navigate('TwilioCall', {
                  popCount: 2,
                  appointmentData: {
                    from: userType,
                    appointmentId: appointmentId.appointmentId,
                  },
                });
              },
            },
          ],
        );
      },
      error => {
        setFetching(false);
        displayErrorMsg(error);
        console.log(error);
      },
    );
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={fetching} />
      {showChefComplain ? (
        <View style={{flex: 1}}>
          {appointmentId?.isFromInstantConsultion && (
            <QuesRadio
              style={{marginBottom: 20}}
              key={'item'}
              isChecked={isInsurance}
              question={'What will be your mode of payment?'}
              yesTitle={'Insurance'}
              noTitle={'Card'}
              yesSelected={isChecked => setIsInsurance(isChecked)}
            />
          )}

          <StepTwoIntakeCheif
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
            getFilesToUpload={files => {
              console.log(files)
              setFilesToUpload(files)}}
            // isFromInstantConsultion={appointmentId?.isFromInstantConsultion}
          />
          <SmallButton
            disabled={nextDisable}
            style={styles.btnNext(nextDisable)}
            buttonTitle={'Next'}
            buttonAction={() => onPressNext()}
          />
        </View>
      ) : null}
      {showSymptoms ? (
        <View style={{flex: 1}}>
          <StepTwoIntakeForm
            navigation={navigation}
            getFilesToUpload={files => {
              console.log(files)
              setFilesToUpload(files)}}
            disableNext={bool => setNextDisable(bool)}
          />
          <View style={styles.btnContainer}>
            <SmallButton
              buttonTextStyle={{color: COLORS.BLUE}}
              style={styles.btnPrevious}
              buttonTitle={'Previous'}
              buttonAction={() => onPressPrevious()}
            />
            <SmallButton
              disabled={nextDisable}
              style={styles.btnNext(nextDisable)}
              buttonTitle={'Submit'}
              buttonAction={() => onPressSubmit()}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const mapStateToProps = ({bookedAppointment}) => {
  return {
    intakeFormId: bookedAppointment.intakeFormId,
    currentStep: bookedAppointment.currentPage,
    yesToAll: bookedAppointment.yesToAll,
    noToAll: bookedAppointment.noToAll,
    questions: bookedAppointment.questions,
    isSWD: bookedAppointment.isSWD,
    sugar: bookedAppointment.sugar,
    BP: bookedAppointment.BP,
    heartRate: bookedAppointment.heartRate,
    height: bookedAppointment.height,
    weight: bookedAppointment.weight,
    BMI: bookedAppointment.BMI,
    oxygen: bookedAppointment.oxygen,
    isAgree: bookedAppointment.isAgree,
    cheifComplain: bookedAppointment.cheifComplain,
    selectedDuration: bookedAppointment.selectedDuration,
    selectedFrequency: bookedAppointment.selectedFrequency,
    arrDocuments: bookedAppointment.arrDocuments,
  };
};

export default connect(mapStateToProps)(IntakeForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCalculated(15),
    backgroundColor: COLORS.WHITE,
  },
  btnNext: nextDisable => ({
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
    backgroundColor: nextDisable ? COLORS.LIGHTER_GREY : COLORS.BLUE,
  }),
  btnPrevious: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BLUE,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  btnContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
