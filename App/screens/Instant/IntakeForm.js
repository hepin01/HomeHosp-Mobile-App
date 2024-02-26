import {connect} from 'react-redux';
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Loader} from '../../components/Loader';
import {QuesRadio} from '../PatientScreens/PatientBookAppointment/component/QuesRadio';
import StepTwoIntakeCheif from '../PatientScreens/PatientBookAppointment/steps/StepTwoIntakeCheif';
import {SmallButton} from '../../components/SmallButton';
import StepTwoIntakeForm from '../PatientScreens/PatientBookAppointment/steps/StepTwoIntakeForm';
import {COLORS, getCalculated} from '../../components/Common';
import {Store} from '../../../App';

const IntakeForm = ({navigation, route: {params: appointmentId}}) => {
  const [fetching, setFetching] = useState(false);
  const [nextDisable, setNextDisable] = useState(false);
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

  return (
    <View style={styles.container}>
      <Loader modalVisible={fetching} />
      {showChefComplain ? (
        <View style={{flex: 1}}>
          <StepTwoIntakeCheif
            disabled={true}
            navigation={navigation}
            disableNext={bool => setNextDisable(bool)}
            // isFromInstantConsultion={appointmentId?.isFromInstantConsultion}
          />
          <SmallButton
            style={styles.btnNext(false)}
            buttonTitle={'Next'}
            buttonAction={() => onPressNext()}
          />
        </View>
      ) : null}
      {showSymptoms ? (
        <View style={{flex: 1}}>
          <StepTwoIntakeForm
            disabled={true}
            navigation={navigation}
            getFilesToUpload={files => setFilesToUpload(files)}
            disableNext={bool => setNextDisable(bool)}
          />
          <View style={styles.btnContainer}>
            <SmallButton
              buttonTextStyle={{color: COLORS.BLUE}}
              style={styles.btnPrevious}
              buttonTitle={'Previous'}
              buttonAction={() => onPressPrevious()}
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
