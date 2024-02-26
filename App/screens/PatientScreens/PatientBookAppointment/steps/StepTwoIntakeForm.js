/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useId} from 'react';
import {
  Button,
  Image,
  InputAccessoryView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {Store} from '../../../../../App';
import images from '../../../../assets/images';
import {Checkmark} from '../../../../components/Checkmark';
import {
  COLORS,
  commonStyles,
  getCalculated,
} from '../../../../components/Common';
import {Radio} from '../../../../components/Radio';
import {TextFieldComponent} from '../../../../components/TextFieldComponent';
import {
  UPDATES_QUESTIONS,
  UPDATE_BMI,
  UPDATE_BP,
  UPDATE_HEART_RATE,
  UPDATE_HEIGHT,
  UPDATE_ISAGREE,
  UPDATE_ISSWD,
  UPDATE_NOTOALL,
  UPDATE_OXYGEN,
  UPDATE_SUGAR,
  UPDATE_WEIGHT,
  UPDATE_YESTOALL,
} from '../../../../redux/BookAppointmentReducer';
import {
  userId,
  validateNumberWithDecimal,
  validateStringLength,
} from '../../../../utiles/common';
import Base from '../../../Base/Base';
import {QuesRadio} from '../component/QuesRadio';

class StepTwoIntakeCheif extends Base {
  constructor(props) {
    super(props);
    this.props.disableNext(true);
  }

  updateQuestions(arr) {
    Store.dispatch({
      type: UPDATES_QUESTIONS,
      payload: arr,
    });
  }

  updateYesToAll(bool) {
    Store.dispatch({
      type: UPDATE_YESTOALL,
      payload: bool,
    });
  }

  updateNoToAll(bool) {
    Store.dispatch({
      type: UPDATE_NOTOALL,
      payload: bool,
    });
  }

  updateISSwd(bool) {
    Store.dispatch({
      type: UPDATE_ISSWD,
      payload: bool,
    });
  }

  updateSugar(str) {
    Store.dispatch({
      type: UPDATE_SUGAR,
      payload: str,
    });
  }

  updateBP(str) {
    Store.dispatch({
      type: UPDATE_BP,
      payload: str,
    });
  }

  updateheartRate(str) {
    Store.dispatch({
      type: UPDATE_HEART_RATE,
      payload: str,
    });
  }

  updateHeight(str) {
    Store.dispatch({
      type: UPDATE_HEIGHT,
      payload: str,
    });
  }

  updateWeight(str) {
    Store.dispatch({
      type: UPDATE_WEIGHT,
      payload: str,
    });
  }

  updateBMI(str) {
    Store.dispatch({
      type: UPDATE_BMI,
      payload: str,
    });
  }

  updateOxygen(str) {
    Store.dispatch({
      type: UPDATE_OXYGEN,
      payload: str,
    });
  }

  updateIsAgree(bool) {
    Store.dispatch({
      type: UPDATE_ISAGREE,
      payload: bool,
    });
  }

  componentDidMount() {}

  componentDidUpdate() {
    const {disableNext, questions} = this.props;
    const wearableStats = this.validateSWD();
    const validateReasons = this.validateReasons();
    const arrQuestionsMarked =
      questions.filter(item => item.isYes == null).length == 0;
    if (!wearableStats || !validateReasons || !arrQuestionsMarked) {
      disableNext(true);
    } else {
      disableNext(false);
    }
  }

  validateSWD() {
    const {sugar, BP, isSWD, heartRate, height, weight, BMI, oxygen} =
      this.props;
    if (isSWD == null) {
      return false;
    } else if (isSWD) {
      return (
        validateStringLength(sugar) &&
        validateNumberWithDecimal(sugar) &&
        // this.validateBP() &&
        validateStringLength(BMI) &&
        validateNumberWithDecimal(BMI) &&
        validateStringLength(height) &&
        validateNumberWithDecimal(height) &&
        validateStringLength(weight) &&
        validateNumberWithDecimal(weight) &&
        validateStringLength(heartRate) &&
        validateNumberWithDecimal(heartRate) &&
        validateStringLength(oxygen)
      );
    } else {
      return true;
    }
  }

  validateBP() {
    const regex = /^\d{1,3}\/\d{1,3}$/;
    return regex.test(this.props.BP);
  }

  validateReasons() {
    const {yesToAll, questions} = this.props;
    if (yesToAll) {
      return questions.every(item => item.answer.trim().length !== 0);
    } else if (questions.some(item => item.isYes)) {
      return (
        questions.filter(
          item => item.isYes && validateStringLength(item.answer),
        ).length > 0
      );
    } else {
      return true;
    }
  }

  render() {
    const {
      yesToAll,
      noToAll,
      questions,
      isSWD,
      sugar,
      BMI,
      BP,
      heartRate,
      height,
      weight,
      oxygen,
      isAgree,
      disabled = false,
    } = this.props;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          extraHeight={200}
          keyboardShouldPersistTaps="handled"
          style={{width: '100%'}}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.textHeader}>Intake Form</Text>
          <Text style={styles.textHeader}>Patient Intake Form</Text>
          {!disabled ? (
            <Text style={styles.subTitle}>
              Identify your current symptoms. This information will be reviewed
              by your doctor at the time of appointment.
            </Text>
          ) : null}

          {!disabled ? (
            <View style={styles.rowView}>
              <Radio
                isChecked={yesToAll}
                title={'Yes to All'}
                checkmarkAction={() => {
                  this.updateYesToAll(true);
                  this.updateNoToAll(false);
                  questions?.map((item, index) => {
                    let some_array = questions?.slice();
                    let que = some_array[index];
                    que.isYes = true;
                    this.updateQuestions(some_array);
                  });
                }}
              />
              <Radio
                style={{marginLeft: 20}}
                isChecked={noToAll}
                title={'No to All'}
                checkmarkAction={() => {
                  this.updateYesToAll(false);
                  this.updateNoToAll(true);
                  questions?.map((item, index) => {
                    let some_array = questions?.slice();
                    let que = some_array[index];
                    que.isYes = false;
                    que.answer = '';
                    this.updateQuestions(some_array);
                  });
                }}
              />
            </View>
          ) : null}
          {this.showQuestionView()}

          <Text style={styles.textHeader}>Smart Wearable Devices</Text>
          <QuesRadio
            disabled={disabled}
            isChecked={isSWD}
            question={'Do you use smart wearable devices?'}
            yesSelected={isChecked => {
              this.updateISSwd(isChecked);
            }}
          />
          {isSWD ? (
            <View style={styles.swdDetils}>
              <View style={styles.swdrowView}>
                <TextFieldComponent
                  editable={!disabled}
                  style={styles.txtFiled}
                  value={sugar}
                  placeholder={'Sugar Level'}
                  onChangeText={text => {
                    this.updateSugar(text);
                  }}
                  keyboardType="number-pad"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={3}
                  blurOnSubmit={false}
                />
                <Text style={styles.measure}>mg/dl</Text>
              </View>

              <View style={[styles.swdrowView, {flexDirection: 'column'}]}>
                <Text style={styles.textBpLabel}>
                  Blood Pressure (systolic/diastolic)
                </Text>
                <View View style={[styles.swdrowView, {marginVertical: 0}]}>
                  <TextInput
                    editable={!disabled}
                    style={styles.txtBp(BP.length == 0)}
                    value={BP}
                    allowFontScaling={false}
                    // returnKeyType="next"
                    onChangeText={text => {
                      this.updateBP(text);
                    }}
                    placeholder={'Systolic/diastolic'}
                    placeholderTextColor={'#98a0ab'}
                    // textContentType="telephoneNumber"
                    // dataDetectorTypes="phoneNumber"
                    // keyboardType="numeric"
                    inputAccessoryViewID={'txtDismiss'}
                    onSubmitEditing={() => {}}
                    autoCapitalize="none"
                    onFocus={() => {}}
                    onBlur={() => {}}
                    maxLength={10}
                    blurOnSubmit={true}
                  />
                  <Text style={styles.measure}>mm/Hg</Text>
                </View>
              </View>

              <View style={styles.swdrowView}>
                <TextFieldComponent
                  editable={!disabled}
                  style={styles.txtFiled}
                  value={heartRate}
                  placeholder={'Heart Rate'}
                  onChangeText={text => {
                    this.updateheartRate(text);
                  }}
                  keyboardType="number-pad"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={3}
                  blurOnSubmit={false}
                />
                <Text style={styles.measure}>per minute</Text>
              </View>

              <View style={styles.swdrowView}>
                <TextFieldComponent
                  editable={!disabled}
                  style={styles.txtFiled}
                  value={height}
                  placeholder={'Height'}
                  onChangeText={text => {
                    this.updateHeight(text);
                  }}
                  keyboardType="numeric"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={3}
                  blurOnSubmit={false}
                />
                <Text style={styles.measure}>inches</Text>
              </View>

              <View style={styles.swdrowView}>
                <TextFieldComponent
                  editable={!disabled}
                  style={styles.txtFiled}
                  value={weight}
                  placeholder={'Weight'}
                  onChangeText={text => {
                    this.updateWeight(text);
                  }}
                  keyboardType="numeric"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={3}
                  blurOnSubmit={false}
                />
                <Text style={styles.measure}>lbs</Text>
              </View>

              <View style={styles.swdrowView}>
                <TextFieldComponent
                  editable={!disabled}
                  style={styles.txtFiled}
                  value={BMI}
                  placeholder={'BMI'}
                  onChangeText={text => {
                    this.updateBMI(text);
                  }}
                  keyboardType="number-pad"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={3}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.swdrowView}>
                <TextFieldComponent
                  editable={!disabled}
                  style={styles.txtFiled}
                  value={oxygen}
                  placeholder={'Oxygen'}
                  onChangeText={text => {
                    this.updateOxygen(text);
                  }}
                  keyboardType="number-pad"
                  onSubmitEditing={() => {}}
                  autoCapitalize="words"
                  maxLength={3}
                  blurOnSubmit={false}
                />
                <Text style={styles.measure}>%</Text>
              </View>
            </View>
          ) : null}
          {!disabled ? (
            <View style={styles.swdrowView}>
              <Checkmark
                disabled={disabled}
                style={styles.checkFiled}
                isChecked={isAgree}
                showCheckbox
                title={
                  'Tick check box if you would like to share your health information with invited care takers.'
                }
                checkmarkAction={() => {
                  this.updateIsAgree(!isAgree);
                }}
              />
            </View>
          ) : null}
        </KeyboardAwareScrollView>
        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={'txtDismiss'}>
            <View style={styles.inputAccessory}>
              <Button
                onPress={() => {
                  Keyboard.dismiss();
                }}
                title="Done"
              />
            </View>
          </InputAccessoryView>
        ) : null}
      </View>
    );
  }

  showQuestionView() {
    const {questions, disabled = false} = this.props;
    return questions?.map((item, index) => {
      return (
        <QuesRadio
          disabled={disabled}
          key={item.intakeId.toString()}
          isChecked={item?.isYes}
          question={item?.question}
          showReason
          reason={item?.answer}
          onChangeReason={reason => {
            let some_array = questions?.slice();
            let que = some_array[index];
            que.answer = reason;
            this.updateQuestions(some_array);
          }}
          yesSelected={isChecked => {
            let some_array = questions?.slice();
            let que = some_array[index];
            que.isYes = isChecked;
            if (!isChecked) {
              que.answer = '';
            }
            this.updateQuestions(some_array);
            this.updateYesToAll(false);
            this.updateNoToAll(false);
          }}
        />
      );
    });
  }
}

const mapStateToProps = ({bookedAppointment}) => {
  return {
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

export default connect(mapStateToProps)(StepTwoIntakeCheif);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  textHeader: {
    ...commonStyles.Bold15,
    width: '100%',
    marginBottom: 10,
  },
  subTitle: {...commonStyles.Regular135, width: '100%'},
  rowView: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  swdrowView: {
    flexDirection: 'row',
    width: '95%',
    marginVertical: 5,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start'
  },
  txtFiled: {width: '70%', marginBottom: 0, marginHorizontal: 0},
  swdDetils: {width: '100%', alignItems: 'center'},
  measure: {
    ...commonStyles.Bold125,
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginLeft: 10,
  },
  checkMark: {marginTop: 20, marginHorizontal: 5},
  checkFiled: {width: '95%'},
  txtBp: empty => ({
    width: getCalculated(55),
    height: getCalculated(40),
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    paddingVertical: getCalculated(10),
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: empty ? getCalculated(12) : getCalculated(15.5),
    marginTop: 0,
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    width: '70%',
  }),
  textBpLabel: {
    ...commonStyles.Regular12,
    width: '90%',
    marginTop: 10,
    marginBottom: 5,
    // alignSelf: 'center',
    color: COLORS.LIGHT_GRAY,
  },
  inputAccessory: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
