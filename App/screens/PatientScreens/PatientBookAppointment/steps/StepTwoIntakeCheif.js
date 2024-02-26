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
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

import images from '../../../../assets/images';
import {
  commonStyles,
  COLORS,
  getCalculated,
} from '../../../../components/Common';
import {SelectiveDropdown} from '../../../../components/SelectiveDropdown';
import {TextFieldComponent} from '../../../../components/TextFieldComponent';
import Base from '../../../Base/Base';
import {allowedFileFormates, userId} from '../../../../utiles/common';
import DocumentCell from '../../Payment&Insurance/DocumentCell';
import {Store} from '../../../../../App';
import {
  UPDATE_CHEF_COMPLAIN,
  UPDATE_DURATION,
  UPDATE_FREQUENCY,
  UPDATE_INTAKE_DOCS,
} from '../../../../redux/BookAppointmentReducer';
import {getInatakeformvaluesNew} from '../../../../networking/APIMethods';
import {webview} from '../../../../networking/Constats';
import {updateFilesToUpload} from '../../../../redux/BookAppointmentActions';

class StepTwoIntakeCheif extends Base {
  constructor(props) {
    super(props);
    this.state = {
      durationList: Array.from({length: 50}, (_, i) => i + 1),
      frequency: ['Days', 'Weeks', 'Months', 'Years'],
      arrDocuments: [],
      filesToUpload: [],
      disabled: false,
    };
    props.disableNext(true);
  }

  componentDidMount() {
    if (this.props.disabled) {
      this.setState({disabled: this.props.disabled});
    }
    if (this.props.intakeFormId.length) this.fetchIntakeForm();
  }

  componentDidUpdate() {
    const {
      cheifComplain,
      selectedDuration,
      selectedFrequency,
      disableNext,
      getFilesToUpload = null,
    } = this.props;
    const {filesToUpload} = this.state;
    if (
      selectedDuration == 'Select' ||
      selectedFrequency == 'Select' ||
      cheifComplain?.trim().length == 0
    ) {
      disableNext(true);
    } else {
      disableNext(false);
    }

    if (filesToUpload.length && !!getFilesToUpload) {
      getFilesToUpload(filesToUpload);
    }
  }

  updateChiefComplaints(str) {
    Store.dispatch({
      type: UPDATE_CHEF_COMPLAIN,
      payload: str,
    });
  }

  updateSelectedFrequency(str) {
    Store.dispatch({
      type: UPDATE_FREQUENCY,
      payload: str,
    });
  }

  updateSelectedDuration(str) {
    Store.dispatch({
      type: UPDATE_DURATION,
      payload: str,
    });
  }

  updateIntakeDocuments(arr) {
    Store.dispatch({
      type: UPDATE_INTAKE_DOCS,
      payload: arr,
    });
  }

  fetchIntakeForm() {
    getInatakeformvaluesNew(
      {userId: userId(), intakeFormId: this.props.intakeFormId},
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      },
    );
  }

  convertFilesToBase64(arrDocs) {
    var arrbase64 = [];
    new Promise.all(
      arrDocs.map((item, index) => {
        return RNFS.readFile(item.uri, 'base64');
      }),
    )
      .then(res => {
        arrbase64 = arrDocs.map((item, index) => {
          const type = item.type.split('/');
          return {
            id: index,
            file: `data:${item.type};base64,${res[index]}`, //base64
            name: item.name, //name of file
            type: type[1],
            title: item.name,
            size: item.size,
            extention: item.type,
            tmpName: '',
            tempFile: '',
            _id: '',
          };
        });
        this.setState(
          {
            filesToUpload: [...this.state.filesToUpload, ...arrbase64],
          },
          () => {
            updateFilesToUpload([...this.props.arrFilesToUpload, ...arrbase64]);
          },
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  openFileSelector() {
    const {arrDocuments} = this.state;
    if (arrDocuments.length < 5) {
      // if the app crashes use the below url
      // https://github.com/rnmods/react-native-document-picker/issues/600#issuecomment-1324653670
      DocumentPicker.pickMultiple()
        .then(results => {
          const type = results[0].type.split('/');
          if (allowedFileFormates.includes(type[1].toUpperCase())) {
            this.convertFilesToBase64(results);
            const newFiles = results.map(({name, uri, size, type}) => {
              return {
                id: Date.now(),
                name: name,
                uri: uri,
                isNew: true,
              };
            });
            this.updateIntakeDocuments([...arrDocuments, ...newFiles]);
            this.setState({arrDocuments: [...arrDocuments, ...newFiles]});
          } else {
            this.displayErrorMsg('Oops! Selected file is not supported');
          }
        })
        .catch(error => {
          // this.displayErrorMsg(error);
          console.log(error);
        });
    } else {
      this.displayErrorMsg('Oops! User cannot upload more than 5 files.');
    }
  }

  handleDeleteDoc(data) {
    const {isNew, id} = data;
    const {arrDocuments, filesToUpload} = this.state;
    const tempNew = [...arrDocuments];
    const arrUpload = [...arrDocuments];
    const indexToDelete = tempNew.findIndex(item => item.id == id);
    tempNew.splice(indexToDelete, 1);
    arrUpload.splice(indexToDelete, 1);
    this.setState({filesToUpload: arrUpload, arrDocuments: tempNew});
    this.updateIntakeDocuments(tempNew);
    updateFilesToUpload(arrUpload);
  }

  showDocuments() {
    const {intakeDocs} = this.props;
    let documentList = intakeDocs?.map((element, index) => {
      return (
        <View
          style={[styles.specialityTst, {...commonStyles.shadow}]}
          key={index}>
          {this.state.disabled ? (
            <DocumentCell
              disabled={this.state.disabled}
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
          ) : (
            <DocumentCell
              disabled={this.state.disabled}
              data={element}
              onDelete={data => {
                this.handleDeleteDoc(data);
              }}
            />
          )}
        </View>
      );
    });
    return <View>{documentList}</View>;
  }

  render() {
    const {durationList, frequency, disabled} = this.state;
    const {cheifComplain, selectedDuration, selectedFrequency} = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          style={{width: '100%'}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}>
          <Text style={styles.textHeader}>Intake Form</Text>
          {!disabled ? (
            <Text style={styles.textHeader}>
              Specify chief complaints and symptoms
            </Text>
          ) : null}

          <TextFieldComponent
            editable={!disabled}
            style={styles.txtFiled}
            value={cheifComplain}
            placeholder={'Chief Complaints*'}
            onChangeText={text => this.updateChiefComplaints(text)}
            onSubmitEditing={() => {}}
            autoCapitalize="words"
            maxLength={100}
            blurOnSubmit={true}
            labelStyle={styles.textLabelStyle}
            // error={!cheifComplain.length > 0}
            // errorMessage={'Please enter cheif complain'}
            disabled={disabled}
          />

          <Text style={styles.labelStyle}>{'Duration of onset*'}</Text>
          <SelectiveDropdown
            list={durationList}
            value={selectedDuration}
            onSelect={(selectedItem, index) =>
              this.updateSelectedDuration(selectedItem.toString())
            }
            // error={!selectedDuration.length > 0}
            // errorMessage={'Please select duration of onset'}
            disabled={disabled}
          />

          <Text style={styles.labelStyle}>{'Duration*'}</Text>
          <SelectiveDropdown
            list={frequency}
            value={selectedFrequency}
            onSelect={(selectedItem, index) =>
              this.updateSelectedFrequency(selectedItem)
            }
            // error={!validateDuration}
            // errorMessage={'Please select duration'}
            disabled={disabled}
          />
          {!disabled ? (
            <Pressable
              disabled={disabled}
              style={styles.uploadView}
              onPress={() => this.openFileSelector()}>
              <Image style={styles.uploadIcon} source={images.uploadicon} />
              <Text
                style={[commonStyles.Regular135Blue, {textAlign: 'center'}]}>
                Uploading a photos/documents is strongly recommended when
                applicable. Maximum 5 files can be uploaded.
              </Text>
              <Text
                style={[
                  commonStyles.Regular135,
                  {textAlign: 'center', marginTop: 10},
                ]}>
                Supported formats Doc, PDF, JPEG, JPG, PNG
              </Text>
            </Pressable>
          ) : null}
          {this.showDocuments()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({bookedAppointment}) => {
  return {
    intakeFormId: bookedAppointment.intakeFormId,
    cheifComplain: bookedAppointment.cheifComplain,
    selectedDuration: bookedAppointment.selectedDuration,
    selectedFrequency: bookedAppointment.selectedFrequency,
    intakeDocs: bookedAppointment.arrDocuments,
    arrFilesToUpload: bookedAppointment.arrFilesToUpload,
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
  txtFiled: {marginTop: 10, width: '100%', marginBottom: 0},
  labelStyle: {
    ...commonStyles.Regular155,
    width: '90%',
    marginTop: 30,
    alignSelf: 'center',
    color: COLORS.LIGHTER_GREY,
    alignSelf: 'flex-start',
  },
  uploadView: {
    backgroundColor: COLORS.LIGHT_BLUE,
    width: '100%',
    padding: 20,
    marginTop: Platform.OS == 'ios' ? 40 : 60,
    borderWidth: 1,
    borderColor: COLORS.BLUE,
    borderRadius: 6,
  },
  uploadIcon: {
    width: getCalculated(34),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  specialityTst: {
    width: '95%',
    alignSelf: 'center',
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
  textLabelStyle: {
    fontSize: getCalculated(14.5),
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
  },
});
