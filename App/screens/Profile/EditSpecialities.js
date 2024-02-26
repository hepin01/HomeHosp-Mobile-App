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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TextInput,
} from 'react-native';
import {commonStyles, getCalculated, COLORS} from '../../components/Common';
import {SmallButton} from '../../components/SmallButton';
import SelectDropdown from 'react-native-select-dropdown';
import images from '../../assets/images';
import {getSpecialities, updateProvider} from '../../networking/APIMethods';
import {Messages} from '../../components/Messages';
import Base from '../Base/Base';
import {connect} from 'react-redux';
import {SelectiveDropdown} from '../../components/SelectiveDropdown';
class EditSpecialities extends Base {
  constructor(props) {
    super(props);
    this.state = {
      speciality: (props.user && props.user.providerType) ?? 'Select',
      subSpeciality: (props.user && props.user.providerSubType) ?? 'Select',
      responseArray: [],
      specialitiesArray: [],
      subSpecialitiesArray: [],
      disabledSubSpeciality: false,
    };
  }

  componentDidMount() {
    this.getSpecilityList();
  }

  getSpecilityList() {
    const {responseArray} = this.state;
    getSpecialities(
      response => {
        console.log(response);
        this.setState({responseArray: response?.specialties});
        var spcialities = [];
        response?.specialties.map((item, index) => {
          spcialities = [...spcialities, item?.provider];
          if (this.props.user.providerType == item?.provider) {
            this.setState({subSpecialitiesArray: item?.Specialties ?? []});
          }
        });
        this.setState({specialitiesArray: spcialities});
        console.log(responseArray);
      },
      error => {},
    );
  }

  saveBtnClicked() {
    const {speciality, subSpeciality} = this.state;

    if (!speciality || speciality?.length < 1) {
      this.displayErrorMsg(Messages.enterSpeciality);
    } else if (!subSpeciality || subSpeciality?.length < 1) {
      this.displayErrorMsg(Messages.enterSubSpeciality);
    } else {
      this.updateUserInfo();
    }
  }

  updateUserInfo() {
    const {user} = this.props;

    const {speciality, subSpeciality} = this.state;
    this.showLoader('');
    updateProvider(
      user?.about,
      user?.city,
      user?.country,
      user?.dob,
      user?.firstname,
      user?.gender,
      user?.lastname,
      subSpeciality,
      speciality,
      user?.state,
      user?.zipcode,
      user?.language,
      response => {
        this.dismissLoader();
        const userObj = this.setUser(response?.data);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Your specialities has been updated');
        this.props.navigation.pop();
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  render() {
    const {
      specialitiesArray,
      subSpecialitiesArray,
      speciality,
      subSpeciality,
      responseArray,
      disabledSubSpeciality,
    } = this.state;
    return (
      <View style={commonStyles.container}>
        <Text style={[commonStyles.Regular12, styles.labelStyle]}>
          Specialities
        </Text>
        <View style={styles.dropdownView}>
          <SelectiveDropdown
            list={specialitiesArray}
            value={speciality}
            onSelect={(selectedItem, index) => {
              //console.log(selectedItem, index)
              this.setState({
                speciality: selectedItem,
                subSpeciality: 'Select',
              });
              //Add subspecialities related to selecyed speciality into array to display in dropdown
              console.log(responseArray[index]);
              if (
                responseArray[index]?.Specialties &&
                responseArray[index]?.Specialties?.length > 0
              ) {
                this.setState({
                  subSpecialitiesArray: responseArray?.[index]?.Specialties,
                  disabledSubSpeciality: false,
                });
              } else {
                this.setState({
                  subSpecialitiesArray: ['No sub specialities available'],
                  disabledSubSpeciality: true,
                });
              }
            }}
          />
        </View>

        <Text style={[commonStyles.Regular12, styles.labelStyle]}>
          Sub Specialities
        </Text>
        <View style={styles.dropdownView}>
          <SelectiveDropdown
            list={subSpecialitiesArray}
            value={subSpeciality}
            onSelect={(selectedItem, index) => {
              //console.log(selectedItem, index)
              this.setState({subSpeciality: selectedItem});
            }}
          />
        </View>
        <SmallButton
          style={styles.saveBtn}
          buttonTitle={'Save'}
          buttonAction={() => {
            this.saveBtnClicked();
          }}
        />
        {this.progressLoader()}
      </View>
    );
  }
}

const STATE = state => ({user: state.user.user});
export default connect(STATE)(EditSpecialities);

const styles = StyleSheet.create({
  labelStyle: {
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
    color: COLORS.LIGHT_GRAY,
  },
  dropdownView: {
    alignSelf: 'center',
    width: '90%',
  },
  ddBtnStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'center',
  },
  ddStyle: {width: '90%', borderRadius: 6, marginTop: -4},
  rowTxtStyle: {textAlign: 'left', alignSelf: 'center'},
  btnTxtStyle: hasLenght => ({
    textAlign: 'left',
    marginLeft: 0,
    height: '60%',
    color: hasLenght ? COLORS.DARK_GRAY : COLORS.LIGHT_GRAY,
  }),
  saveBtn: {width: getCalculated(60), alignSelf: 'center', marginTop: 20},
});
