/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import images from '../../../assets/images';
import {commonStyles, COLORS, getCalculated} from '../../../components/Common';
import {SelectiveDropdown} from '../../../components/SelectiveDropdown';
import {SmallButton} from '../../../components/SmallButton';
import {TextFieldComponent} from '../../../components/TextFieldComponent';
import DocumentCell from './DocumentCell';
import {SuccessModal} from '../../../components/SuccessModal';
import ImageView from 'react-native-image-viewing';
import {
  getAgencyUsers,
  getUserProfile,
  updateProfileImage,
  updateProviderInsurance,
  uploadMultipleDocument,
} from '../../../networking/APIMethods';
import Base from '../../Base/Base';
import {s3DocBase, webview} from '../../../networking/Constats';
import DocumentPicker from 'react-native-document-picker';
import {getInsuranceList, userId} from '../../../utiles/common';

class InsuranceDetails extends Base {
  constructor(props) {
    super(props);
    this.state = {
      insuranceList: getInsuranceList(),
      selectedInsurance: [],
      prevSelectedInsurance: [],
      policyNumber: '',
      memberId: '',
      showSuccess: false,
      visible: false,
      imageIndex: 0,
      photoArr: [],
      filesToUpload: [],
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    // this.showLoader();
    getUserProfile(
      response => {
        const {
          user: {Documents, policyNumber, insuranceName, insuranceIdNumber},
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
        const selectedInsurance = insuranceName;
        this.setState({
          photoArr: docs || [],
          memberId: insuranceIdNumber || '',
          policyNumber: policyNumber || '',
          selectedInsurance: selectedInsurance,
          prevSelectedInsurance: insuranceName,
        });
      },
      error => {
        this.displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  }

  saveBtnClicked() {
    let isValid = true;
    const {selectedInsurance, policyNumber, memberId} = this.state;
    if (selectedInsurance.length == 0) {
      isValid = false;
      this.displayErrorMsg('Oops! Please select an Insurance');
    } else if (!this.validateNumberAndAlphabets(policyNumber)) {
      isValid = false;
      this.displayErrorMsg("Oops! Policy name can't contain characters");
    } else if (!this.validateNumberAndAlphabets(memberId)) {
      isValid = false;
      this.displayErrorMsg(
        "Oops! Member/Insurance name can't contain characters",
      );
    } else if (policyNumber?.length == 0) {
      isValid = false;
      this.displayErrorMsg('"Oops! policy name cannot be empty');
    } else if (memberId.length == 0) {
      isValid = false;
      this.displayErrorMsg('Oops! Member/Insurance name cannot be empty');
    }
    if (isValid) {
      this.updateInsuranceDetails();
      // this.setState({showSuccess: true});
    }
  }

  validateNumberAndAlphabets(str) {
    const regex = /^[a-zA-Z0-9_.-]*$/;
    return regex.test(str);
  }

  updateInsuranceDetails() {
    this.showLoader();
    const {selectedInsurance, policyNumber, memberId, prevSelectedInsurance} =
      this.state;
      const arrInsurance = selectedInsurance
    const payload = {
      insuranceName: arrInsurance.filter((item, 
        index) => arrInsurance.indexOf(item) === index),
      policyNumber: policyNumber,
      insuranceIdNumber: memberId,
      userId: userId(),
    };
    updateProviderInsurance(
      payload,
      response => {
        this.uploadDocuments();
      },
      error => {
        this.displayErrorMsg(error);
        this.dismissLoader();
      },
    );
  }

  convertFilesToBase64(arrDocs) {
    var arrbase64 = [];
    new Promise.all(
      arrDocs.map((item, index) => {
        console.log(item);
        return RNFS.readFile(item.uri, 'base64');
      }),
    )
      .then(res => {
        arrbase64 = arrDocs.map((item, index) => {
          const type = item.type.split('/');
          return {
            id: index,
            blob: `data:${item.type};base64,${res[index]}`, //base64
            name: item.name, //name of file
            type: type[1],
          };
        });
        this.setState({
          filesToUpload: [...this.state.filesToUpload, ...arrbase64],
        });
      })
      .catch(e => console.log(e));
  }

  openFileSelector() {
    const {photoArr} = this.state;
    if (photoArr.length < 5) {
      // if the app crashes use the below url
      // https://github.com/rnmods/react-native-document-picker/issues/600#issuecomment-1324653670
      DocumentPicker.pickMultiple()
        .then(results => {
          this.convertFilesToBase64(results);
          const newFiles = results.map(({name, uri}) => {
            return {
              id: Date.now(),
              name: name,
              uri: uri,
              isNew: true,
            };
          });
          this.setState({photoArr: [...photoArr, ...newFiles]});
        })
        .catch(error => {
          // this.displayErrorMsg(error);
          console.log(error);
        });
    } else {
      Alert.alert('Error', 'User cannot upload more than 5 files.');
    }
  }

  uploadDocuments() {
    const {photoArr, filesToUpload} = this.state;
    const arrPhotos = photoArr
      .filter(item => item.isNew == false)
      .map(ele => ele.name);
    const arrFilesToUpload = filesToUpload.map(item => {
      return {
        blob: item.blob,
        name: item.name,
        type: item.type,
      };
    });
    const arrDocs = [...arrPhotos, ...arrFilesToUpload];
    const payload = {
      document: arrDocs,
      userId: userId(),
    };

    uploadMultipleDocument(
      payload,
      response => {
        this.dismissLoader();
        this.setState({showSuccess: true, filesToUpload: []}, () =>
          this.fetchUserInfo(),
        );
      },
      error => {
        this.displayErrorMsg(error);
        this.dismissLoader();
      },
    );
  }

  handleDeleteDoc(data) {
    const {isNew, id} = data;
    const {photoArr, filesToUpload} = this.state;
    if (isNew) {
      const tempNew = [...filesToUpload];
      const indexToDelete = tempNew.findIndex(item => item.id == id);
      tempNew.splice(indexToDelete, 1);
      this.setState({filesToUpload: tempNew});
    }
    const tempNew = [...photoArr];
    const indexToDelete = tempNew.findIndex(item => item.id == id);
    tempNew.splice(indexToDelete, 1);
    this.setState({photoArr: tempNew});
  }

  showDocuments() {
    const {photoArr} = this.state;
    let documentList = photoArr?.map((element, index) => {
      if (element.isNew) {
        return (
          <View style={[styles.specialityTst, styles.shadow]} key={index}>
            <DocumentCell
              data={element}
              onDelete={data => {
                this.handleDeleteDoc(data);
              }}
            />
          </View>
        );
      }
      return (
        <View style={[styles.specialityTst, styles.shadow]} key={index}>
          <DocumentCell
            data={element}
            onDelete={data => {
              this.handleDeleteDoc(data);
            }}
            onPressView={(uri, name) =>
              this.props.navigation.navigate(webview, {
                uri: uri,
                title: name,
              })
            }
          />
        </View>
      );
    });
    return <View>{documentList}</View>;
  }

  render() {
    const {
      insuranceList,
      selectedInsurance,
      policyNumber,
      memberId,
      showSuccess,
      imageIndex,
      visible,
      photoArr,
    } = this.state;
    console.log(policyNumber)
    const ispolicyNumberValid = policyNumber?.length == 0;
    const isMemberIdValid = memberId.length == 0;
    const disableSaveBtn =
      selectedInsurance.length == 0 || ispolicyNumberValid || isMemberIdValid;
    return (
      <View style={commonStyles.container}>
        <ScrollView
          style={styles.subContainer}
          contentContainerStyle={{paddingBottom: 200}}
          showsVerticalScrollIndicator={false}>
          <Text style={[commonStyles.Regular12, styles.labelStyle]}>
            {'Insurance Name*'}
          </Text>
          <View style={{marginHorizontal: getCalculated(15)}}>
            <SelectiveDropdown
              list={insuranceList}
              value={selectedInsurance[0] || 'Select'}
              onSelect={(selectedItem, index) => {
                if (!selectedInsurance.includes(selectedItem)) {
                  this.setState(prevState => ({
                    selectedInsurance: [
                      selectedItem,
                    ],
                  }));
                }
              }}
            />
          </View>

          <TextFieldComponent
            style={{marginTop: 7}}
            value={policyNumber}
            placeholder={'Policy Number*'}
            returnKeyType="next"
            onChangeText={text => {
              this.setState({policyNumber: text});
            }}
            autoCapitalize="none"
            maxLength={256}
            blurOnSubmit={false}
            // error={ispolicyNumberValid}
            // errorMessage={'Please enter the Policy Name.'}
          />

          <TextFieldComponent
            style={{marginTop: 30}}
            value={memberId}
            placeholder={'Member/Insurance Identification Number*'}
            returnKeyType="next"
            onChangeText={text => {
              this.setState({memberId: text});
            }}
            autoCapitalize="none"
            maxLength={256}
            blurOnSubmit={false}
            // error={isMemberIdValid}
            // errorMessage={
            //   'Please enter the Member/Insurance Identification number'
            // }
          />

          <View style={styles.uploadView}>
            <TouchableOpacity
              style={styles.uploadbtn}
              onPress={() => this.openFileSelector()}>
              <Image style={styles.uploadIcon} source={images.uploadicon} />
              <Text style={commonStyles.Regular135Blue}>
                Upload your Insurance documents here
              </Text>
            </TouchableOpacity>
          </View>
          {this.showDocuments()}
          <SmallButton
            disabled={disableSaveBtn}
            style={styles.saveBtn(disableSaveBtn)}
            buttonTitle={'Save'}
            buttonAction={() => {
              this.saveBtnClicked();
            }}
          />
        </ScrollView>
        {showSuccess && (
          <SuccessModal
            image={images.insurancecircle}
            title={'Success'}
            message="Insurance details has been updated successfully"
            buttonAction={() => {
              this.setState({showSuccess: false});
            }}
            rightButtonTitle="Okay"
            closeBtnAction={() => {
              this.setState({showSuccess: false});
            }}
          />
        )}
        <ImageView
          images={photoArr}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => this.setState({visible: false})}
        />
        {this.progressLoader()}
      </View>
    );
  }
}

export default InsuranceDetails;

const styles = StyleSheet.create({
  subContainer: {width: '100%'},
  labelStyle: {
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
    color: COLORS.LIGHTER_GREY,
  },
  uploadView: {
    width: '90%',
    height: 150,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: COLORS.BLUE,
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: COLORS.LIGHT_BLUE,
    marginBottom: 10,
  },
  uploadIcon: {width: 40, resizeMode: 'contain'},
  uploadbtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: disable => ({
    width: getCalculated(60),
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: disable ? COLORS.LIGHTER_GREY : COLORS.BLUE,
  }),
  specialityTst: {
    width: '90%',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 7,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 5,
  },
});
