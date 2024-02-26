import React from 'react';

import {StyleSheet, Pressable, Text, View, Image} from 'react-native';
import Modal from 'react-native-modal';
import {getCalculated, commonStyles, COLORS} from '../../components/Common';
import Base from '../Base/Base';
import images from '../../assets/images';
import {SelectiveDropdown} from '../../components/SelectiveDropdown';
import {ButtonComponent} from '../../components/ButtonComponent';
import {TextFieldComponent} from '../../components/TextFieldComponent';
import {Checkmark} from '../../components/Checkmark';
import {getBillingCode} from '../../networking/APIMethods';
import {QuesRadio} from '../PatientScreens/PatientBookAppointment/component/QuesRadio';

const stripeCharge = 0;
const adminCharge = 5;
const stripeFixedCharge = 0.3;
const stripePercentageCharge = 0.029;

export class BillingCode extends Base {
  constructor(props) {
    super(props);
    this.state = {
      originalBillingCodes: [],
      billingCodes: [],
      selectedBillingCode: '',
      selectedIndex: null,

      displaySetChargeCheckbox: false,
      isExtraAmount: false,
      extraFees: 0,
      adminStripExtraAmountCharged: 0,
      settleableAmount: 0,
      isFollowUpReq: false,
      followUpDays: 0,
      arrFollowUpDays: Array.from(Array(30).fill(), (_, i) => i + 1),
    };
  }

  componentDidMount() {
    this.getBillingCodes();
  }

  getBillingCodes() {
    const {item, duration} = this.props;
    this.showLoader('');
    getBillingCode(
      response => {
        this.dismissLoader();
        const codes =
          item?.isInsurance == 'Yes'
            ? response?.data?.insuranceBillingCodes
            : response?.data?.billingCodes;
        var codeArray = codes?.filter((code, index) => {
          return code?.timeDuration * 60 < duration;
        });
        if (codes?.length > codeArray.length) {
          codeArray = [...codeArray, codes[codeArray.length]];
        }
        this.setState(
          {
            billingCodes: codeArray,
            originalBillingCodes: codeArray,
          },
          () => {},
        );
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
    var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';

    return hDisplay + mDisplay + sDisplay;
  }

  onExtraChargeAmountChange() {
    const {item} = this.props;
    const {originalBillingCodes, selectedIndex} = this.state;

    let extraChargeAmount = 0;
    let adminStripExtraAmount = 0;
    if (item?.isInsurance == 'Yes') {
      adminStripExtraAmount =
        parseFloat(originalBillingCodes?.[selectedIndex]?.amountCharged) +
        parseFloat(extraChargeAmount);
    } else {
      if (item?.isPatientChargesEnabled == true) {
        // formula to calcular target charge for deducting stripe charges from patient
        adminStripExtraAmount = (
          (parseFloat(originalBillingCodes?.[selectedIndex]?.amountCharged) +
            adminCharge +
            parseFloat(extraChargeAmount) +
            stripeFixedCharge) /
          (1 - stripePercentageCharge)
        ).toFixed(2);
      } else {
        adminStripExtraAmount = (
          (parseFloat(originalBillingCodes?.[selectedIndex]?.amountCharged) +
            stripeFixedCharge +
            parseFloat(extraChargeAmount)) /
          (1 - stripePercentageCharge)
        ).toFixed(2);
      }
    }
    this.setState({adminStripExtraAmountCharged: adminStripExtraAmount});
  }

  getSettleableAmount() {
    const {item, duration} = this.props;
    const {originalBillingCodes, selectedIndex} = this.state;
    const finalBillingCodes = originalBillingCodes?.[selectedIndex];
    let maxSettableAmount = 0;
    let timer = this.secondsToHms(duration);

    if (originalBillingCodes.length == 1) {
      this.setState({displaySetChargeCheckbox: false});
    } else {
      if (
        originalBillingCodes[originalBillingCodes.length - 1]?.timeDuration ==
        finalBillingCodes?.timeDuration
      ) {
        if (parseFloat(finalBillingCodes.timeDuration) * 60 < timer) {
          this.setState({displaySetChargeCheckbox: true});
          let lastDiffMultiplier =
            originalBillingCodes[originalBillingCodes.length - 1]
              .amountCharged -
            originalBillingCodes[originalBillingCodes.length - 2].amountCharged;
          maxSettableAmount =
            (Math.ceil(timer / (15 * 60)) - originalBillingCodes.length) *
            lastDiffMultiplier;
        } else {
          this.setState({displaySetChargeCheckbox: false});
        }
      } else {
        this.setState({displaySetChargeCheckbox: true});
        if (
          parseFloat(
            originalBillingCodes[originalBillingCodes.length - 1].timeDuration,
          ) *
            60 <
          timer
        ) {
          let lastDiffMultiplier =
            originalBillingCodes[originalBillingCodes.length - 1]
              .amountCharged -
            originalBillingCodes[originalBillingCodes.length - 2].amountCharged;
          maxSettableAmount =
            (Math.ceil(timer / (15 * 60)) - originalBillingCodes.length) *
              lastDiffMultiplier +
            originalBillingCodes[originalBillingCodes.length - 1]
              .amountCharged -
            finalBillingCodes.amountCharged;
        } else {
          maxSettableAmount =
            originalBillingCodes[originalBillingCodes.length - 1]
              .amountCharged - finalBillingCodes.amountCharged;
        }
        this.setState({settleableAmount: maxSettableAmount});
      }
    }
  }

  render() {
    const {CompleteBtnAction, duration, item} = this.props;
    const {
      billingCodes,
      selectedBillingCode,
      isExtraAmount,
      extraFees,
      originalBillingCodes,
      selectedIndex,
      adminStripExtraAmountCharged,
      displaySetChargeCheckbox,
      settleableAmount,
    } = this.state;

    var finalAmountCharged =
      (extraFees.length > 0 ? parseFloat(extraFees) : 0) +
      parseFloat(adminStripExtraAmountCharged);

    return (
      <Modal
        style={{margin: 0}}
        coverScreen={true}
        visible={this.state.modalVisible}
        onBackButtonPress={() => this.setState({modalVisible: true})}
        onBackdropPress={() => {
          this.setState({modalVisible: true});
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBgView}>
            <View style={styles.modalMainView}>
              <Text style={styles.title}>
                <Text style={[commonStyles.Medium135, styles.labelStyle]}>
                  {'Actual time taken: '}
                </Text>
                <Text style={[commonStyles.Regular135, styles.labelStyle]}>
                  {this.secondsToHms(duration)}
                </Text>
              </Text>
              <Text style={[styles.header, commonStyles.RegularGrey11]}>
                Billing Code
              </Text>
              <SelectiveDropdown
                style={styles.header}
                list={billingCodes.map(item => {
                  return (
                    item?.billingCode + ' (' + item?.timeDuration + ' min)'
                  );
                })}
                value={selectedBillingCode || 'Select'}
                onSelect={(selectedItem, index) => {
                  this.setState(
                    {selectedBillingCode: selectedItem, selectedIndex: index},
                    () => {
                      this.onExtraChargeAmountChange();
                      this.getSettleableAmount();
                    },
                  );
                }}
              />

              {displaySetChargeCheckbox && (
                <Checkmark
                  style={styles.checkmark}
                  isChecked={isExtraAmount}
                  title={'Set extra charge for appointment'}
                  checkmarkAction={() => {
                    this.setState({isExtraAmount: !isExtraAmount});
                  }}
                />
              )}

              {isExtraAmount && (
                <TextFieldComponent
                  style={{marginTop: 10}}
                  value={extraFees}
                  placeholder={'Enter Extra Charge'}
                  onChangeText={text => {
                    this.setState({extraFees: text});
                  }}
                  onSubmitEditing={() => {}}
                  maxLength={2}
                  blurOnSubmit={false}
                  keyboardType={'numeric'}
                />
              )}
              {parseFloat(extraFees) > settleableAmount && (
                <Text
                  style={[
                    commonStyles.Regular11Red,
                    {marginTop: 30, marginHorizontal: 20},
                  ]}>
                  {'You can add max upto $' +
                    settleableAmount +
                    ' as per current billing code'}
                </Text>
              )}

              <Text style={{margin: 10, marginTop: 50}}>
                <Text style={[commonStyles.Medium135, styles.labelStyle]}>
                  {'Amount charged: '}
                </Text>
                <Text style={[commonStyles.Regular135, styles.labelStyle]}>
                  {'$' + finalAmountCharged}
                </Text>
              </Text>
              {this.props.isNormalConsultation ? (
                <View>
                  <QuesRadio
                    style={{margin: 10}}
                    disabled={false}
                    isChecked={this.state.isFollowUpReq}
                    question={'Suggest Follow-up'}
                    yesSelected={isChecked => {
                      this.setState({isFollowUpReq: isChecked});
                    }}
                  />
                  <Text style={[styles.header, commonStyles.RegularGrey11]}>
                    Follow-up After(Days)
                  </Text>
                  <SelectiveDropdown
                    style={styles.header}
                    list={this.state.arrFollowUpDays}
                    value={'Select'}
                    onSelect={(selectedItem, index) =>
                      this.setState({followUpDays: selectedItem})
                    }
                  />
                  <Text style={[commonStyles.Regular12Blue, {margin: 10}]}>
                    Note: suggested follow-up's will be visible under
                    E-Consultation menu
                  </Text>
                </View>
              ) : null}

              <ButtonComponent
                disabled={
                  selectedBillingCode.length == 0 ||
                  (isExtraAmount && extraFees.length == 0) ||
                  parseFloat(extraFees) > settleableAmount
                }
                style={{marginTop: 20}}
                buttonStyle={{
                  fontSize: getCalculated(13),
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                buttonTitle={'Complete Appointment'}
                buttonAction={() => {
                  CompleteBtnAction(
                    originalBillingCodes?.[selectedIndex]?.amountCharged +
                      extraFees,
                    originalBillingCodes?.[selectedIndex],
                    {
                      days: this.state.followUpDays,
                      isFollowUp: this.state.isFollowUpReq ? 'yes' : 'no',
                    },
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBgView: {
    width: '95%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMainView: {
    width: '95%',
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: getCalculated(7),
    marginTop: getCalculated(7),
    paddingBottom: 40,
  },
  title: {margin: 10, marginTop: 20},
  header: {marginHorizontal: 20},
  checkmark: {
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
  },
});
