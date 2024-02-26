import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import {SmallButton} from '../../../components/SmallButton';

import StepOneAppointment from '../PatientBookAppointment/steps/StepOneAppointment';
import StepTwoIntakeCheif from '../PatientBookAppointment/steps/StepTwoIntakeCheif';
import StepTwoIntakeForm from '../PatientBookAppointment/steps/StepTwoIntakeForm';
import StepThreePaymentInfo from '../PatientBookAppointment/steps/StepThreePaymentInfo';
import {connect, useSelector} from 'react-redux';
import {Store} from '../../../../App';
import {
  UPDATE_CURRENT_PAGE,
  UPDATE_INTAKE_FORM_ID,
} from '../../../redux/BookAppointmentReducer';
import {submitAppointment} from '../../../networking/APIMethods';
import {displayErrorMsg, userId} from '../../../utiles/common';
import {Loader} from '../../../components/Loader';
import ProgressBar from '../PatientBookAppointment/component/ProgressBar';

const IntakeForm = ({
  navigation,
  currentStep,
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
  intakeFormId,
}) => {
  const doctorDetails = useSelector(
    state => state.bookedAppointment.selectedDoctor,
  );
  const [fetch, setFetch] = useState(false);
  const [nextDisable, setNextDisable] = useState(false);

  function nextStep() {
    if (currentStep == 3) {
      const regex = /^\d{1,3}\/\d{1,3}$/;
      const isValid = isSWD ? regex.test(BP) : true;
      if (isValid) {
        createIntakeForm()
          .then(response => {
            setIntakeFormId(response.id);
            gotToNextPage();
          })
          .catch(e => console.log(e));
      } else {
        displayErrorMsg('Oops! Please enter valid Blood Pressure value.');
      }
    } else {
      gotToNextPage();
    }
  }

  function gotToNextPage() {
    let step = currentStep;
    setCurrentStep(++step);
  }

  function prevStep() {
    let step = currentStep;
    setCurrentStep(--step);
    setNextDisable(false);
  }

  function setCurrentStep(step) {
    Store.dispatch({
      type: UPDATE_CURRENT_PAGE,
      payload: step,
    });
  }

  function setIntakeFormId(id) {
    Store.dispatch({
      type: UPDATE_INTAKE_FORM_ID,
      payload: id,
    });
  }

  function createIntakeForm() {
    setFetch(true);
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
        documents_temp: '',
        intakeSummary: questions,
      },
      from: 'all',
      isOnDemandAppointment: false,
    };
    return new Promise((resolve, reject) => {
      submitAppointment(
        payload,
        response => {
          setFetch(false);
          resolve(response);
        },
        error => {
          setFetch(false);
          displayErrorMsg(error);
          console.log(error);
          reject(error);
        },
      );
    });
  }

  function onPressSubmit() {
    navigation.navigate('DoctorInfo', {
      doctorDetails: doctorDetails,
    });
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={fetch} />
      <View style={styles.progressBar}>
        <ProgressBar currentStep={currentStep} showFindProvider={false} />
      </View>
      <View style={{flex: 1}}>
        {currentStep == 1 ? (
          <StepOneAppointment
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
          />
        ) : null}
        {currentStep == 2 ? (
          <StepTwoIntakeCheif
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
          />
        ) : null}
        {currentStep == 3 ? (
          <StepTwoIntakeForm
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
          />
        ) : null}
        {currentStep == 4 ? (
          <StepThreePaymentInfo
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
          />
        ) : null}
        {/* {currentStep == 5 ? (
          <StepFourFindProvider
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
          />
        ) : null} */}
      </View>
      <View style={styles.btnContainer}>
        {currentStep !== 1 ? (
          <SmallButton
            buttonTextStyle={{color: COLORS.BLUE}}
            style={styles.btnPrevious}
            buttonTitle={'Previous'}
            buttonAction={() => prevStep()}
          />
        ) : null}
        {currentStep < 4 ? (
          <SmallButton
            disabled={nextDisable}
            style={styles.btnNext(nextDisable)}
            buttonTitle={'Next'}
            buttonAction={() => nextStep()}
          />
        ) : null}
        {currentStep == 4 ? (
          <SmallButton
            disabled={nextDisable}
            style={styles.btnNext(nextDisable)}
            buttonTitle={'Submit'}
            buttonAction={() => onPressSubmit()}
          />
        ) : null}
      </View>
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
  };
};

export default connect(mapStateToProps)(IntakeForm);

const styles = StyleSheet.create({
  container: {
    // ...commonStyles.container,
    flex: 1,
    padding: getCalculated(12),
    backgroundColor: COLORS.WHITE,
  },
  btnContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
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
  progressBar: {
    width: '100%',
    alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: getCalculated(25),
  },
});
