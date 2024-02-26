/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Store} from '../../../../../App';
import images from '../../../../assets/images';
import {Checkmark} from '../../../../components/Checkmark';
import {
  COLORS,
  commonStyles,
  getCalculated,
} from '../../../../components/Common';
import {SelectiveDropdown} from '../../../../components/SelectiveDropdown';
import {SmallButton} from '../../../../components/SmallButton';
import {TextFieldComponent} from '../../../../components/TextFieldComponent';
import {
  addnewCardCustomerId,
  getCustomerCards,
  getUserProfile,
} from '../../../../networking/APIMethods';
import {s3DocBase, webview} from '../../../../networking/Constats';
import {
  UPDATE_ARR_CARDS,
  UPDATE_ARR_DOCUMENTS,
  UPDATE_INSURANCE_ID,
  UPDATE_INSURANCE_NAME,
  UPDATE_IS_ONLINE,
  UPDATE_POLICY_NUMBER,
  UPDATE_SAVE_CARD_FUTURE,
  UPDATE_SELECTED_INSURANCE,
  UPDATE_SHOW_ADD_CARD,
} from '../../../../redux/BookAppointmentReducer';
import {
  displayErrorMsg,
  userId,
  validateStringLength,
} from '../../../../utiles/common';
import Base from '../../../Base/Base';
import AddCard from '../component/AddCard';
import Card from '../component/Card';
import {QuesRadio} from '../component/QuesRadio';

class StepTwoIntakeCheif extends Base {
  constructor(props) {
    super(props);
    this.props?.disableNext(true);
    this.state = {
      savedCard: '',
      saveCardForFuture: false,
    };
  }

  updateInsranceName(str) {
    Store.dispatch({
      type: UPDATE_INSURANCE_NAME,
      payload: str,
    });
  }

  updateInsuranceID(str) {
    Store.dispatch({
      type: UPDATE_INSURANCE_ID,
      payload: str,
    });
  }

  updateSelectedInsuranceName(arr) {
    Store.dispatch({
      type: UPDATE_SELECTED_INSURANCE,
      payload: arr,
    });
  }
  updatePolicyNumber(str) {
    Store.dispatch({
      type: UPDATE_POLICY_NUMBER,
      payload: str,
    });
  }

  updateDocArr(arr) {
    Store.dispatch({
      type: UPDATE_ARR_DOCUMENTS,
      payload: arr,
    });
  }

  updateIsOnline(bool) {
    Store.dispatch({
      type: UPDATE_IS_ONLINE,
      payload: bool,
    });
  }

  updateShowAddCards(bool) {
    Store.dispatch({
      type: UPDATE_SHOW_ADD_CARD,
      payload: bool,
    });
  }

  updateArrCards(arr) {
    Store.dispatch({
      type: UPDATE_ARR_CARDS,
      payload: arr,
    });
  }

  updateSaveCardForFuture(bool) {
    Store.dispatch({
      type: UPDATE_SAVE_CARD_FUTURE,
      payload: bool,
    });
  }

  componentDidMount() {
    this.fetchUserInfo(() => {
      this.getCustomersCards();
    });
  }

  componentDidUpdate() {
    const {arrCards, isOnline, disableNext} = this.props;
    if (isOnline) {
      disableNext(!arrCards?.some(item => item.selected));
    } else if (!this.isInsuranceValid()) {
      disableNext(true);
    } else {
      disableNext(false);
    }
  }

  fetchUserInfo(completion) {
    // this.showLoader('');
    getUserProfile(
      response => {
        const {
          user: {
            Documents,
            savedCardId,
            policyNumber,
            insuranceName,
            saveCardForFuture,
            insuranceIdNumber,
          },
        } = response;
        // this.dismissLoader();
        const docs = Documents.map((item, index) => {
          return {
            id: index,
            isNew: false,
            name: item,
            uri: s3DocBase + item,
          };
        });
        this.updateDocArr(docs);
        this.updatePolicyNumber(policyNumber || '');
        this.updateInsuranceID(insuranceIdNumber || '');
        this.updateInsranceName(insuranceName || []);
        this.updateSaveCardForFuture(saveCardForFuture);
        this.setState(
          {savedCard: savedCardId, saveCardForFuture: saveCardForFuture},
          () => {
            completion && completion();
          },
        );
      },
      error => {
        // this.dismissLoader();
        console.log(error);
        this.displayErrorMsg(error);
        completion && completion();
      },
    );
  }

  onAddNewCard() {
    this.updateShowAddCards(true);
  }

  handleSelectedCard(card) {
    const newArrCards = this.props.arrCards?.map(item => {
      if (item.id == card.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      } else {
        return {
          ...item,
          selected: false,
        };
      }
    });
    this.updateArrCards(newArrCards);
  }

  isInsuranceValid() {
    const {
      showAddCard,
      insuranceName,
      policyNumber,
      InsuranceID,
      selectedInsuranceName,
    } = this.props;
    if (insuranceName.length) {
      return (
        validateStringLength(insuranceName[0]) &&
        validateStringLength(policyNumber) &&
        validateStringLength(InsuranceID)
      );
    } else return false;
  }

  showInsuranceView() {
    const {showAddCard=false, insuranceName=[], policyNumber='', InsuranceID=''} = this.props;
    const isInsurance = insuranceName.length > 0;
    let insDispName = '';
    if (insuranceName.length) {
      insDispName = insuranceName[0];
    }
    return (
      <View style={styles.insuranceContainer}>
        {isInsurance ? (
          <View style={{width: '100%'}}>
            <Text style={styles.textHeader}>Insurance Details</Text>
            <Text style={commonStyles.Regular135}>Insurance Name</Text>
            <Text style={styles.textHeader}>{insDispName}</Text>
            <Text style={commonStyles.Regular135}>Policy Number</Text>
            <Text style={styles.textHeader}>{policyNumber}</Text>
            <Text style={commonStyles.Regular135}>
              Member / Insurance Identification Number*
            </Text>
            <Text style={styles.textHeader}>{InsuranceID}</Text>
            <View style={commonStyles.line} />
            <Text style={commonStyles.Regular12}>Documents Attached</Text>
            {this.showDocuments()}
          </View>
        ) : (
          <View>
            <Text style={commonStyles.Regular135}>
              Don't worry! We need card details just to identify you as a
              responsible user. You will still be paying fees through Insurance.
            </Text>
            <SmallButton
              style={styles.btnAddNew}
              buttonTitle={'+ Add New Card'}
              buttonAction={() => this.onAddNewCard()}
            />
            {showAddCard ? (
              <AddCard
                onPressSave={id => this.saveCard(id)}
                onPressCancel={() => this.updateShowAddCards(false)}
              />
            ) : null}
          </View>
        )}
        {/* </View> */}
      </View>
    );
  }

  showDocuments() {
    const {documentArr} = this.props;
    let documentList = documentArr?.map((element, index) => {
      return (
        <View style={styles.rowView} key={index}>
          <Text style={commonStyles.Regular135}>{element.name}</Text>
          <Pressable
            onPress={() =>
              this.props.navigation.navigate(webview, {
                uri: element.uri,
                title: element.name,
              })
            }>
            <Image style={styles.eysImage} source={images.viewcircle} />
          </Pressable>
        </View>
      );
    });
    return <View style={{marginTop: 10}}>{documentList}</View>;
  }

  getCustomersCards() {
    // this.showLoader('');
    getCustomerCards(
      {userId: userId()},
      response => {
        const {savedCard} = this.state;
        // this.dismissLoader(() => {
          if (Array.isArray(response?.data)) {
            const cards = response?.data?.map(item => {
              if (item.id == savedCard) {
                return {
                  ...item,
                  selected: true,
                };
              } else {
                return {
                  ...item,
                  selected: false,
                };
              }
            });
            this.updateArrCards(cards || []);
          } else {
            this.updateArrCards([]);
          }
        // });
      },
      error => {
        // this.dismissLoader(() => {
          console.log(error);
        // });
      },
    );
  }

  saveCard(id) {
    // this.showLoader('');
    const payload = {
      userId: userId(),
      token: id,
    };
    addnewCardCustomerId(
      payload,
      response => {
        // this.dismissLoader();
        this.getCustomersCards();
        this.updateShowAddCards(false);
        if (!this.props.isOnline) {
          this.updateIsOnline(true);
        }
      },
      error => {
        // this.dismissLoader();
        displayErrorMsg(error);
        console.log(error);
      },
    );
  }

  showOnlineView() {
    const {showAddCard, arrCards, saveCardForFuture} = this.props;
    return (
      <View style={{width: '100%'}}>
        <SmallButton
          style={styles.btnAddNew}
          buttonTitle={'+ Add New Card'}
          buttonAction={() => this.onAddNewCard()}
        />
        {showAddCard ? (
          <AddCard
            onPressSave={id => this.saveCard(id)}
            onPressCancel={() => this.updateShowAddCards(false)}
          />
        ) : null}
        <View>
          {arrCards?.length
            ? arrCards?.map(item => (
                <Card
                  key={item.id.toString()}
                  cardData={item}
                  onPressCard={data => this.handleSelectedCard(data)}
                />
              ))
            : null}
        </View>
        {arrCards?.length ? (
          <View>
            <Checkmark
              showCheckbox={true}
              style={styles.checkmark}
              isChecked={saveCardForFuture}
              title={'Save the card details for future appointments'}
              checkmarkAction={() =>
                this.updateSaveCardForFuture(!saveCardForFuture)
              }
            />
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    const {isOnline, isFromInstantConsultion, item} = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          style={{width: '100%'}}
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{width: '100%'}}>
          <Text style={styles.textHeader}>Payment Information</Text>
          {!isFromInstantConsultion && (
            <>
              <QuesRadio
                isChecked={isOnline}
                question={'Mode of payment?*'}
                yesTitle={'Online'}
                noTitle={'Insurance'}
                yesSelected={isOnline => {
                  this.updateIsOnline(isOnline);
                }}
              />
              {isOnline && this.showOnlineView()}
              {!isOnline && this.showInsuranceView()}
            </>
          )}

          {isFromInstantConsultion && (
            <>
              {item?.isInsurance == 'Yes'
                ? this.showInsuranceView()
                : this.showOnlineView()}
            </>
          )}
        </ScrollView>
        {this.progressLoader()}
      </View>
    );
  }
}

const mapStateToProps = ({bookedAppointment}) => ({
  insuranceName: bookedAppointment.insuranceName,
  policyNumber: bookedAppointment.policyNumber,
  InsuranceID: bookedAppointment.InsuranceID,
  documentArr: bookedAppointment.documentArr,
  arrCards: bookedAppointment.arrCards,
  isOnline: bookedAppointment.isOnline,
  showAddCard: bookedAppointment.showAddCard,
  saveCardForFuture: bookedAppointment.saveCardForFuture,
  selectedInsuranceName: bookedAppointment.selectedInsuranceName,
});

export default connect(mapStateToProps)(StepTwoIntakeCheif);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  textHeader: {
    ...commonStyles.Bold15,
    width: '100%',
    marginBottom: 15,
  },
  txtFiled: {marginTop: 10, width: '100%'},
  swdDetils: {width: '100%', alignItems: 'center'},
  labelStyle: {
    ...commonStyles.Regular12,
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
    color: COLORS.LIGHTER_GREY,
    alignSelf: 'flex-start',
  },
  uploadView: {
    backgroundColor: COLORS.LIGHT_BLUE,
    width: '100%',
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.BLUE,
    borderRadius: 6,
  },
  uploadIcon: {
    width: getCalculated(34),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  btnAddNew: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.BLUE,
    borderColor: COLORS.BLUE,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  insuranceContainer: {
    ...commonStyles.shadow,
    ...commonStyles.shadowCard,
    width: '98%',
    alignSelf: 'center',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
  },
  eysImage: {width: 25, resizeMode: 'contain'},
  cardContainer: {
    borderRadius: 10.3,
    padding: getCalculated(11),
    backgroundColor: COLORS.width,
    ...commonStyles.shadow,
    ...commonStyles.shadowCard,
    width: '98%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBrand: isVisa => ({
    width: isVisa ? getCalculated(52) : getCalculated(43),
    height: isVisa ? getCalculated(16) : getCalculated(26),
  }),
  radio: {
    width: getCalculated(16),
    height: getCalculated(16),
  },
  checkmark: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
  },
});
