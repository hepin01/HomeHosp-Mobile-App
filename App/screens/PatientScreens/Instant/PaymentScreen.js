import {connect} from 'react-redux';
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Loader} from '../../../components/Loader';
import {SmallButton} from '../../../components/SmallButton';
import {COLORS, getCalculated} from '../../../components/Common';
import StepTwoIntakeForm from '../PatientBookAppointment/steps/StepTwoIntakeForm';
import StepTwoIntakeCheif from '../PatientBookAppointment/steps/StepTwoIntakeCheif';
import {displayErrorMsg, userId} from '../../../utiles/common';
import {
  addInstantIntakeForm,
  payInstConsultationFee,
} from '../../../networking/APIMethods';
import {QuesRadio} from '../PatientBookAppointment/component/QuesRadio';
import StepThreePaymentInfo from '../PatientBookAppointment/steps/StepThreePaymentInfo';
import {getTimeZone} from 'react-native-localize';

const PaymentScreen = ({navigation, arrCards, route: {params: params}}) => {
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
    const selectedCard = arrCards.find(item => item.selected);
    const payload = {
      isInsurance: params?.item?.isInsurance,
      app: params?.item,
      timeZone: getTimeZone(),
      cardId: params?.item?.isInsurance == 'Yes' ? null : selectedCard?.id,
    };
    console.log(JSON.stringify(payload));
    payInstConsultationFee(
      payload,
      response => {
        setFetching(false);
        Alert.alert(
          'Success',
          'Thanks for submitting the payment information.',
          [
            {
              text: 'Ok',
              onPress: () => navigation.pop(),
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
      <View style={{flex: 1}}>
        <StepThreePaymentInfo
          navigation={navigation}
          disableNext={bool => setNextDisable(bool)}
          isFromInstantConsultion={params?.isFromInstantConsultion}
          item={params?.item}
        />
        <SmallButton
          disabled={nextDisable}
          style={styles.btnNext(nextDisable)}
          buttonTitle={'Submit'}
          buttonAction={() => onPressSubmit()}
        />
      </View>
    </View>
  );
};

const mapStateToProps = ({bookedAppointment}) => {
  return {
    arrCards: bookedAppointment.arrCards,
  };
};

export default connect(mapStateToProps)(PaymentScreen);

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
