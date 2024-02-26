/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../../../assets/images';
import {Checkmark} from '../../../components/Checkmark';
import {commonStyles, COLORS, getCalculated} from '../../../components/Common';
import {SelectiveDropdown} from '../../../components/SelectiveDropdown';
import {SmallButton} from '../../../components/SmallButton';
import {SuccessModal} from '../../../components/SuccessModal';
import {
  getAllVendorServices,
  getSpecialities,
  getCustomUserProfile,
  updateUserData,
  getUserProfile,
} from '../../../networking/APIMethods';
import {displayErrorMsg, userId} from '../../../utiles/common';
import Base from '../../Base/Base';

class Services extends Base {
  constructor(props) {
    super(props);
    this.state = {
      medicinList: [],
      vendorList: [],
      selectedMedicines: [],
      selectedVendors: [],
      isAgree: false,
      showSuccess: false,
      isUpdate: false,
    };
    this.medRef = React.createRef();
    this.vendorRef = React.createRef();
  }

  componentDidMount() {
    this.fetchUserInfo();
    this.fetchProviderType();
    this.fetchVendors();
  }

  fetchUserInfo() {
    // this.showLoader('');
    const payload = {
      query: {_id: userId()},
      select: {miniSurveyForm: 1},
    };
    getUserProfile(
      // payload,
      response => {
        const {
          user: {
            miniSurveyForm,
            miniSurveyForm: {selectspecialist, selectvendor, viewadds},
          },
        } = response;
        console.log(selectspecialist, selectvendor, miniSurveyForm);
        // this.dismissLoader();
        this.setState({
          selectedMedicines: selectspecialist || [],
          selectedVendors: selectvendor || [],
          isAgree: viewadds,
        });
      },
      error => {
        this.displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  }

  fetchProviderType() {
    getSpecialities(
      response => {
        const providers = response?.specialties.map(item => item?.provider);
        this.setState({fetch: false, medicinList: providers});
      },
      error => {
        displayErrorMsg(error);
      },
    );
  }

  fetchVendors() {
    this.setState({fetch: true}, () => {
      getAllVendorServices(
        response => {
          const vendor = response.filter(
            item => !item?.isDeleted && item?.name,
          );
          this.dismissLoader();
          this.setState({
            fetch: false,
            vendorList: vendor,
          });
        },
        error => {
          this.dismissLoader();
          this.setState({fetch: false});
          displayErrorMsg(error);
        },
      );
    });
  }

  updateData(isReset = false) {
    this.setState(
      {
        fetch: true,
        isUpdate: isReset,
      },
      () => {
        this.showLoader('');
        const {isAgree, selectedMedicines, selectedVendors} = this.state;
        let payload = {
          userId: userId(),
          setitem: {
            miniSurveyForm: {
              selectspecialist: selectedMedicines,
              selectvendor: selectedVendors,
              viewadds: isAgree,
            },
          },
        };
        if (!isReset) {
          payload = {
            userId: userId(),
            setitem: {
              miniSurveyForm: {
                selectspecialist: [],
                selectvendor: [],
                isAgree: false,
              },
            },
          };
          this.medRef?.reset();
          this.vendorRef?.reset();
          this.setState({
            selectedMedicines: [],
            selectedVendors: [],
            isAgree: false,
          });
        }
        updateUserData(
          payload,
          response => {
            this.dismissLoader();
            this.setState({
              fetch: false,
              showSuccess: true,
            });
          },
          error => {
            this.dismissLoader();
            this.setState({fetch: false});
            displayErrorMsg(error);
          },
        );
      },
    );
  }

  render() {
    const {
      isUpdate,
      medicinList,
      selectedMedicines,
      vendorList,
      selectedVendors,
      isAgree,
      showSuccess,
    } = this.state;
    const saveButtnDisabled =
      selectedVendors?.length == 0 || selectedMedicines?.length == 0;
    return (
      <View style={[commonStyles.container, {paddingHorizontal: 15}]}>
        <ScrollView
          style={styles.scroller}
          showsVerticalScrollIndicator={false}>
          <Text style={[commonStyles.Regular12, styles.labelStyle]}>
            {'Select Specialists'}
          </Text>
          <SelectiveDropdown
            getRef={ref => (this.medRef = ref)}
            list={medicinList.map((item, index) => item)}
            value={'Select'}
            onSelect={(selectedItem, index) => {
              if (!selectedMedicines?.includes(selectedItem)) {
                this.setState({
                  selectedMedicines: [...selectedMedicines, selectedItem],
                });
              }
            }}
          />
          {this.showMedicinesAdded()}

          <Text style={[commonStyles.Regular12, styles.labelStyle]}>
            {'Select Vendor'}
          </Text>
          <SelectiveDropdown
            getRef={ref => (this.vendorRef = ref)}
            list={vendorList.map((item, index) => item?.name)}
            value={'Select'}
            onSelect={(selectedItem, index) => {
              if (!selectedVendors?.includes(selectedItem)) {
                this.setState({
                  selectedVendors: [...selectedVendors, selectedItem],
                });
              }
            }}
          />
          {this.showVendorsAdded()}
          <View style={styles.checkmark}>
            <Checkmark
              showCheckbox={true}
              isChecked={isAgree}
              title={
                'I agree to see products and advertisements of selected vendors.'
              }
              checkmarkAction={() => {
                this.setState({isAgree: !isAgree});
              }}
            />
          </View>
          <View style={styles.rowView}>
            <SmallButton
              whiteBg
              style={styles.resetBtn}
              buttonTitle={'Reset Services'}
              buttonAction={() => {
                this.setState(
                  {selectedMedicines: [], selectedVendors: []},
                  () => this.updateData(false),
                );
              }}
            />
            <SmallButton
              style={styles.saveBtn(saveButtnDisabled)}
              buttonTitle={'Save'}
              buttonAction={() => {
                this.updateData(true);
              }}
              disabled={saveButtnDisabled}
            />
          </View>
        </ScrollView>
        {showSuccess && (
          <SuccessModal
            image={images.settingscircle}
            title={'Success'}
            message={
              'Services have been ' +
              (isUpdate ? 'updated' : 'resetted') +
              ' successfully'
            }
            buttonAction={() => {
              this.setState({showSuccess: false});
            }}
            rightButtonTitle="Okay"
            closeBtnAction={() => {
              this.setState({showSuccess: false});
            }}
          />
        )}
        {this.progressLoader()}
      </View>
    );
  }

  showMedicinesAdded() {
    const {selectedMedicines} = this.state;
    let medicines = selectedMedicines?.map((element, index) => {
      return (
        <View style={[styles.specialityTst, styles.shadow]} key={index}>
          <Text
            style={[commonStyles.Medium11, {marginRight: 10}]}
            key={index + 1}>
            {element}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const reducedArr = [...selectedMedicines];
              reducedArr.splice(index, 1);
              this.setState({selectedMedicines: reducedArr});
            }}
            style={styles.closeBtn}
            key={index + 2}>
            <Image style={styles.closeBtnImage} source={images.closemerged} />
          </TouchableOpacity>
        </View>
      );
    });
    return <View style={styles.languageView}>{medicines}</View>;
  }

  showVendorsAdded() {
    const {selectedVendors} = this.state;
    let vendors = selectedVendors?.map((element, index) => {
      return (
        <View style={[styles.specialityTst, styles.shadow]} key={index}>
          <Text
            style={[commonStyles.Medium11, {marginRight: 10}]}
            key={index + 1}>
            {element}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const reducedArr = [...selectedVendors];
              reducedArr.splice(index, 1);
              this.setState({selectedVendors: reducedArr});
            }}
            style={styles.closeBtn}
            key={index + 2}>
            <Image style={styles.closeBtnImage} source={images.closemerged} />
          </TouchableOpacity>
        </View>
      );
    });
    return <View style={styles.languageView}>{vendors}</View>;
  }
}

export default Services;

const styles = StyleSheet.create({
  labelStyle: {
    width: '100%',
    marginTop: 20,
    alignSelf: 'center',
    color: COLORS.LIGHTER_GREY,
  },
  scroller: {width: '100%', height: '100%'},
  languageView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 10,
    alignSelf: 'center',
  },
  specialityTst: {
    // width: '90%',
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 7,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
  },
  closeBtnImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 3,
    right: 0,
    width: 20,
    height: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.65,

    elevation: 5,
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '80%',
    justifyContent: 'space-between',
  },
  saveBtn: disabled => ({
    width: getCalculated(60),
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: disabled ? COLORS.LIGHTER_GREY : COLORS.BLUE,
  }),
  resetBtn: {alignSelf: 'center', marginTop: 20},
  checkmark: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});
