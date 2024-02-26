import React from 'react';
import {Text, View} from 'react-native';

import {commonStyle, COLORS} from '../../components/Common';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {getValueFromDictionary} from '../../utiles/validator';
import {Messages} from '../../components/Messages';
import {Loader} from '../../components/Loader';

export default class Base extends React.Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    this.state = {
      isLoaderVisible: false,
      loaderText: '',
    };
  }

  displayMsg = message => {
    showMessage({
      message: message,
      type: 'success',
    });
  };

  displayErrorMsg = message => {
    showMessage({
      message: message,
      type: 'danger',
    });
  };

  dismissMsg = () => {
    hideMessage({});
  };

  getAccessToken() {
    return this.props.accessToken;
  }

  showLoader = (text = '') => {
    console.log('loader called base');
    this.setState({isLoaderVisible: true, loaderText: text});
  };

  dismissLoader = (done) => {
    this.setState({isLoaderVisible: false, loaderText: ''},() => done && done());
  };

  progressLoader = () => (
    <Loader
      closeLoader={() => {
        this.setState({isLoaderVisible: false});
      }}
      text={this.state.loaderText}
      modalVisible={this.state.isLoaderVisible || false}
    />
  );

  setUser = userObj => {
    console.log(userObj);
    var userType = getValueFromDictionary(userObj, 'userType');
    console.log(userType);
    return {
      user: {
        _id: getValueFromDictionary(userObj, '_id'),
        firstname: getValueFromDictionary(userObj, 'firstname'),
        lastname: getValueFromDictionary(userObj, 'lastname'),
        email: getValueFromDictionary(userObj, 'email'),
        isActive: getValueFromDictionary(userObj, 'isActive'),
        identificationNumber: getValueFromDictionary(
          userObj,
          'identificationNumber',
        ),
        identificationType: getValueFromDictionary(
          userObj,
          'identificationType',
        ),
        freeTrialPeriodStatus: getValueFromDictionary(
          userObj?.freeTrialPeriod,
          'status',
        ),
        about: getValueFromDictionary(userObj?.providerInformation, 'about'),
        city:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? getValueFromDictionary(userObj?.providerInformation, 'city')
            : getValueFromDictionary(userObj?.miniSurveyForm, 'city'),
        contactnumber: JSON.stringify(
          getValueFromDictionary(userObj, 'contactnumber'),
        ),
        country:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? getValueFromDictionary(userObj?.providerInformation, 'country')
            : getValueFromDictionary(userObj?.miniSurveyForm, 'country'),
        dob:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? getValueFromDictionary(userObj?.providerInformation, 'dob')
            : getValueFromDictionary(userObj?.miniSurveyForm, 'dob'),
        gender:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? getValueFromDictionary(userObj?.providerInformation, 'gender')
            : getValueFromDictionary(userObj?.miniSurveyForm, 'gender'),
        state:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? getValueFromDictionary(userObj?.providerInformation, 'state')
            : getValueFromDictionary(userObj?.miniSurveyForm, 'state'),
        zipcode:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? getValueFromDictionary(userObj?.providerInformation, 'zipcode')
            : getValueFromDictionary(userObj?.miniSurveyForm, 'zipcode'),
        userType: getValueFromDictionary(userObj, 'userType'),
        providerType: getValueFromDictionary(userObj, 'providerType'),
        providerSubType: getValueFromDictionary(userObj, 'providerSubType'),
        profileImgUrl: getValueFromDictionary(userObj, 'profileImgUrl'),
        language:
          getValueFromDictionary(userObj, 'userType') == 'provider'
            ? userObj?.providerInformation?.language
              ? getValueFromDictionary(userObj?.providerInformation, 'language')
              : []
            : userObj?.miniSurveyForm?.language
            ? getValueFromDictionary(userObj?.miniSurveyForm, 'language')
            : [],
      },
    };
  };

  setUserTypeIdAccessToken = (userObj, response) => {
    return {
      userType: userObj.userType ? userObj.userType : '',
      userId: response.userId ? response.userId : '',
      accessToken: response.accessToken ? response.accessToken : '',
    };
  };

  isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  render() {
    return <View style={commonStyle.viewContainerGrayBg}></View>;
  }
}

// const state = state => ({ user: state.user.user, isLoggedIn: state.isLoggedIn, userType: state.userType, language: state.language, accessToken: state.accessToken, userType: state.userType, userId: state.userId });
// export default connect(state)(Base);
