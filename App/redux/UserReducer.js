import {clone} from 'lodash';

const INITIAL_STATE = {
  isLoggedIn: false,
  accessToken: '',
  deviceToken: '',
  notDoNotShowAgain: false,
  user: {
    _id: '',
    firstname: '',
    lastname: '',
    email: '',
    contactnumber: '',
    identificationNumber: '',
    identificationType: '',
    freeTrialPeriodStatus: '',
    about: '',
    city: '',
    country: '',
    dob: '',
    gender: '',
    state: '',
    zipcode: '',
    userType: '',
    providerType: '',
    providerSubType: '',
    profileImgUrl: '',
    language: [],
  },
};

export const UPDATE_DEVICE_TOKEN = 'UPDATE_DEVICE_TOKEN';
export const UPDATE_NOTIFICATION_POPUP = 'UPDATE_NOTIFICATION_POPUP';

const UserReducer = (state = INITIAL_STATE, action) => {
  const newState = clone(state);
  switch (action.type) {
    case 'SET_LOGIN':
      newState.isLoggedIn = true;
      return newState;
    case 'SET_USER':
      newState.user = clone(action.payload.user);
      return newState;
    case 'SET_ACCESSTOKEN':
      newState.accessToken = clone(action.payload.accessToken);
      return newState;
    case 'SET_PROFILE_IMAGE':
      newState.user.profileImgUrl = clone(action.payload.profileImgUrl);
      return newState;
    case 'SET_EMAIL':
      newState.user.email = clone(action.payload.email);
      return newState;
    case 'SET_PHONE':
      newState.user.contactnumber = clone(action.payload.contactnumber);
      return newState;
    case 'LOGOUT':
      return INITIAL_STATE;
    case 'SET_USERID':
      newState.user.userId = clone(action.payload.userId);
      return newState;
      case UPDATE_DEVICE_TOKEN:
      newState.deviceToken = clone(action.payload);
      return newState;
      case UPDATE_NOTIFICATION_POPUP:
      newState.notDoNotShowAgain = clone(action.payload);
      return newState;
    default:
      return state;
  }
};

export default UserReducer;
