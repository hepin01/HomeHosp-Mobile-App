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
import {
  getLanguages,
  updateProvider,
  updatePatient,
} from '../../networking/APIMethods';
import {Messages} from '../../components/Messages';
import Base from '../Base/Base';
import {connect} from 'react-redux';
import {SelectiveDropdown} from '../../components/SelectiveDropdown';

class EditLanguages extends Base {
  constructor(props) {
    super(props);
    this.state = {
      languagesArray: props.user.language != null ? props.user.language : [],
      languages: [],
    };
  }

  componentDidMount() {
    this.getLanguages();
  }

  getLanguages() {
    getLanguages(
      response => {
        console.log(response);
        var langs = [];
        response.map((item, index) => (langs = [...langs, item?.fullName]));
        this.setState({languages: langs});
      },
      error => {},
    );
  }

  saveBtnClicked() {
    const {languagesArray} = this.state;
    const {user} = this.props;
    if (!languagesArray || languagesArray.length < 1) {
      this.displayErrorMsg(Messages.selectLanguage);
    } else {
      if (user.userType == 'patient') {
        this.updatePatientInfo();
      } else {
        this.updateProviderInfo();
      }
    }
  }

  updateProviderInfo() {
    const {user} = this.props;

    const {languagesArray} = this.state;
    this.showLoader('');
    updateProvider(
      user?.about,
      user?.city,
      user?.country,
      user?.dob,
      user?.firstname,
      user?.gender,
      user?.lastname,
      user?.providerSubType,
      user?.providerType,
      user?.state,
      user?.zipcode,
      languagesArray,
      response => {
        this.dismissLoader();
        console.log(response);
        const userObj = this.setUser(response?.data);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Your languages has been updated');
        this.props.navigation.pop();
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  updatePatientInfo() {
    const {user} = this.props;

    const {languagesArray} = this.state;
    this.showLoader('');
    updatePatient(
      user?.city,
      user?.country,
      user?.dob,
      user?.firstname,
      user?.gender,
      user?.lastname,
      user?.state,
      user?.zipcode,
      languagesArray,
      response => {
        this.dismissLoader();
        console.log(response);
        const userObj = this.setUser(response?.data);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.displayMsg('Your languages has been updated');
        this.props.navigation.pop();
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  render() {
    const {languagesArray, languages} = this.state;
    return (
      <View style={commonStyles.container}>
        <Text style={[commonStyles.Regular12, styles.labelStyle]}>
          Languages
        </Text>
        <View style={styles.dropdownView}>
          <SelectiveDropdown
            list={languages}
            value={'Select'}
            onSelect={(selectedItem, index) => {
              if (!languagesArray.includes(selectedItem)) {
                this.setState({
                  languagesArray: [...languagesArray, selectedItem],
                });
              }
            }}
          />
        </View>

        {this.showLanguagesAdded()}
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

  showLanguagesAdded() {
    const {languagesArray} = this.state;
    let langs = languagesArray?.map((element, index) => {
      return (
        <View style={[styles.specialityTst, styles.shadow]} key={index}>
          <Text
            style={[commonStyles.Medium125, {marginRight: 10}]}
            key={index + 1}>
            {element}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const reducedArr = [...languagesArray];
              reducedArr.splice(index, 1);
              this.setState({languagesArray: reducedArr});
            }}
            style={styles.closeBtn}
            key={index + 2}>
            <Image style={styles.closeBtnImage} source={images.closemerged} />
          </TouchableOpacity>
        </View>
      );
    });
    return <View style={styles.languageView}>{langs}</View>;
  }
}

const STATE = state => ({user: state.user.user});
export default connect(STATE)(EditLanguages);

const styles = StyleSheet.create({
  labelStyle: {
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
    color: COLORS.LIGHTER_GREY,
  },
  dropdownView: {
    marginTop: 5,
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
  btnTxtStyle: {
    textAlign: 'left',
    marginLeft: 0,
    height: '60%',
    color: COLORS.LIGHTER_GREY,
    marginTop: 5,
  },
  saveBtn: {width: getCalculated(60), alignSelf: 'center', marginTop: 20},
  languageView: {
    width: '93%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  specialityTst: {
    width: 'auto',
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 'auto',
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
});
