import React, {Component} from 'react';

import {
  postMethod,
  postMethodMultipart,
  putMethod,
  getMethod,
} from './ApiManager';
import {APIUrl} from './Constats';
import {Store} from '../../App';
import base64 from 'react-native-base64';
import {getAccessToken, getUTCIso, isProvider, userId} from '../utiles/common';
import moment from 'moment';

import {getTimeZone} from 'react-native-localize';
let isAlertPresent = false;
const sendPostRequest = (url, parameters, error, success) => {
  var header = {Authorization: 'Bearer ' + getAccessToken()};
  postMethod(url, parameters, header)
    .then(response => {
      success(response);
    })
    .catch(errorResp => {
      if (errorResp) {
        error(errorResp);
      } else {
        error();
      }
    });
};

const sendPutRequest = (url, parameters, error, success) => {
  var header = {Authorization: 'Bearer ' + getAccessToken()};

  console.log('header: ', header);
  putMethod(url, parameters, header)
    .then(response => {
      success(response);
    })
    .catch(errorResp => {
      if (errorResp) {
        error(errorResp);
      }
    });
};

const sendPostMutipartRequest = (url, parameters, error, success) => {
  var header = {Authorization: 'Bearer ' + getAccessToken()};

  postMethodMultipart(url, parameters, header)
    .then(response => {
      success(response);
    })
    .catch(errorResp => {
      if (errorResp) {
        error(errorResp);
      }
    });
};

const sendgetRequest = (url, error, success) => {
  var header = {Authorization: 'Bearer ' + getAccessToken()};
  getMethod(url, header)
    .then(response => {
      success(response);
    })
    .catch(errorResp => {
      if (errorResp) {
        error(errorResp);
      }
    });
};

export const signIn = (email, password, success, err) => {
  let parameters = {
    email: email,
    password: base64.encode(password),
  };
  sendPostRequest(
    APIUrl.signin,
    parameters,
    error => {
      console.log(error);
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const addFirebaseTokenToUser = (token, success, err) => {
  let parameters = {
    token: token,
  };
  sendPostRequest(
    APIUrl.addFirebaseTokenToUser,
    parameters,
    error => {
      console.log('addFirebaseTokenToUser', error);
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const forgotpassword = (email, success, err) => {
  let parameters = {
    email: email,
  };
  sendPostRequest(
    APIUrl.forgotPassword,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const verifyOTP = (email, otp, success, err) => {
  let parameters = {
    email: email,
    otp: otp,
  };
  sendPostRequest(
    APIUrl.checkOtp,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const resendOtp = (email, success, err) => {
  let parameters = {
    email: email,
  };
  sendPostRequest(
    APIUrl.resendOtp,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const resetPassword = (email, password, success, err) => {
  let parameters = {
    email: email,
    password: base64.encode(password),
  };
  sendPostRequest(
    APIUrl.resetPassword,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getUserProfile = (success, err) => {
  let parameters = {
    query: {
      _id: userId(),
    },
  };
  sendPostRequest(
    APIUrl.getuserprofile,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const updateProfileImage = (profilePicture, success, err) => {
  let parameters = {
    query: {
      _id: userId(),
      userType: Store.getState().user.user._userType,
    },
    proquery: {
      profilePicture: profilePicture,
    },
  };
  sendPostRequest(
    APIUrl.updateProfilepic,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const updateProvider = (
  about,
  city,
  country,
  dob,
  firstname,
  gender,
  lastname,
  subspeciality,
  speciality,
  state,
  zipcode,
  language,
  success,
  err,
) => {
  let parameters = {
    about: about,
    city: city,
    country: country,
    dob: dob,
    firstname: firstname,
    gender: gender,
    lastname: lastname,
    providerSubType: subspeciality,
    providerType: speciality,
    state: state,
    zipcode: zipcode,
    language: language,
  };
  sendPutRequest(
    APIUrl.updateProvider,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const updatePatient = (
  city,
  country,
  dob,
  firstname,
  gender,
  lastname,
  state,
  zipcode,
  language,
  success,
  err,
) => {
  let parameters = {
    city: city,
    country: country,
    dob: dob,
    firstname: firstname,
    gender: gender,
    lastname: lastname,
    state: state,
    zipcode: zipcode,
    language: language,
  };
  sendPutRequest(
    APIUrl.updatePatient,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const changeEmail = (email, password, success, err) => {
  let parameters = {
    email: email,
    userId: userId(),
    password: base64.encode(password),
  };
  sendPostRequest(
    APIUrl.changeEmail,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const verifyOtpForEmailChange = (email, otp, success, err) => {
  let parameters = {
    email: email,
    userId: userId(),
    otp: otp,
  };
  sendPostRequest(
    APIUrl.verifyOTPForEmail,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const changePhoneNumber = (contactNumber, password, success, err) => {
  let parameters = {
    contactNumber: contactNumber,
    userId: userId(),
    password: base64.encode(password),
  };
  sendPostRequest(
    APIUrl.changePhoneNumber,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const changePassword = (oldPassword, newpassword, success, err) => {
  let parameters = {
    userId: userId(),
    password: base64.encode(oldPassword),
    newPassword: base64.encode(newpassword),
  };
  sendPostRequest(
    APIUrl.changePassword,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const userInvite = (email, userType, success, err) => {
  let parameters = {
    email: email,
    userType: userType,
    invitedBy: userId(),
  };
  sendPostRequest(
    APIUrl.userInvitation,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getSpecialities = (success, err) => {
  sendgetRequest(
    APIUrl.specialityList,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getLanguages = (success, err) => {
  sendgetRequest(
    APIUrl.languageList,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getStates = (success, err) => {
  sendgetRequest(
    APIUrl.stateList,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const setAllNotificationsToRead = (success, err) => {
  sendPostRequest(
    APIUrl.setAllNotificationsToRead,
    {},
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getNotifications = (success, err) => {
  sendPostRequest(
    APIUrl.getNotifications,
    {},
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getCity = (stateId, success, err) => {
  let parameters = {
    stateId: stateId,
  };
  sendPostRequest(
    APIUrl.cityList,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getDoctorsAppointments = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getDoctorAppointments,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getPatientsAppointments = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getPatientsAppointments,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getProviderTodaysApp = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getProviderTodaysApp,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const checkDay1Day2ForProvider = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.checkDay1Day2ForProvider,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getERequests = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getERequest,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getFollowupAppointments = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getFollowupAppointments,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const toggleErequest = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.toggleErequest,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getProviderAppBySchedule = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getProviderAppBySchedule,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const findLatestProviderApp = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.findLatestProviderApp,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const listDoctors = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.listDoctors,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getAppointmentSlots = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getAppointmentSlots,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const createAppForEconsultation = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.createAppForEconsultation,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getAgencyUsers = (success, err) => {
  sendgetRequest(
    APIUrl.getAgencyUsers,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getCurrentSchedule = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getCurrentSchedule,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const toggleProviderPrefference = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.toggleProviderPrefference,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getDelegateUsers = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getDelegateUsers,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const removeDelegateUser = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.removeDelegateUser,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const addNewDelegateUser = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.addNewDelegateUser,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getPreferredProviders = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getPreferredProviders,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const updateUserData = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.updateUserData,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getAllVendorServices = (success, err) => {
  sendgetRequest(
    APIUrl.getAllVendorServices,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getCurrentPlan = (isProvider, success, error) => {
  if (isProvider) {
    var header = {Authorization: 'Bearer ' + getAccessToken()};
    postMethod(APIUrl.getCurrentPlan, {_id: userId()}, header)
      .then(response => {
        if (response) {
          const {
            subscriptionData: {remainingDays},
          } = response.data;
          if (parseInt(remainingDays) >= 0) {
            success(true);
          } else {
            if (!isAlertPresent) {
              isAlertPresent = true;
              success(false);
            }
          }
        } else {
          error();
          console.error(response);
        }
      })
      .catch(errorResp => {
        console.log('getCurrentPlan', errorResp);
        if (errorResp) {
          error(errorResp);
        }
      });
  } else {
    success(true);
  }
};

export const uploadMultipleDocument = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.uploadMultipleDocument,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const updateProviderInsurance = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.updateProviderInsurance,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getCustomerCards = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getCustomerCards,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const addnewCardCustomerId = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.addnewCardCustomerId,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getInatakeformvaluesNew = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getInatakeformvaluesNew,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const submitAppointment = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.submitApointment,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const checkForTodaysInsApp = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.checkForTodaysInsApp,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const createAppointment = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.createAppointment,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const getProviderDetailForDelegateUser = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getProviderDetailForDelegateUser,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res.data);
    },
  );
};

export const checkEmail = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.checkEmail,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const getTwilioToken = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getTwilioToken,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const postInvitePatientInstant = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.invitePatient,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const getPatientsForInstantConsultation = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getPatientsForInstantConsultation,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const toggleInstantConsultation = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.toggleInstantConsultation,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const getInstantConsultationAppointments = (
  parameters,
  success,
  err,
) => {
  sendPostRequest(
    APIUrl.getInstantConsultationAppointments,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const approveRejectInstantConsultation = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.approveRejectInstantConsultation,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const requestPatientForInstantConsultation = (
  parameters,
  success,
  err,
) => {
  sendPostRequest(
    APIUrl.requestPatientForInstantConsultation,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const addInstantConsultationSchedule = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.addInstantConsultationSchedule,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const getInstantConsultationAppointmentsForPatient = (
  parameters,
  success,
  err,
) => {
  sendPostRequest(
    APIUrl.getInstantConsultationAppointmentsForPatient,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const getInstantConsultationProviders = (parameters, success, err) => {
  sendPostRequest(
    APIUrl.getInstantConsultationProviders,
    parameters,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const requestProviderForInstantConsultation = (
  doctorID,
  success,
  err,
) => {
  const payload = {
    doctor: doctorID,
    startDate: getUTCIso(moment()),
    timeZone: getTimeZone(),
  };
  sendPostRequest(
    APIUrl.requestProviderForInstantConsultation,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const addInstantIntakeForm = (payload, success, err) => {
  sendPostRequest(
    APIUrl.addInstantIntakeForm,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const checkIfProviderJoined = (payload, success, err) => {
  sendPostRequest(
    APIUrl.checkIfProviderJoined,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const onProviderJoined = (payload, success, err) => {
  sendPostRequest(
    APIUrl.onProviderJoined,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const onProviderLeaveAppointment = (payload, success, err) => {
  sendPostRequest(
    APIUrl.onProviderLeaveAppointment,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const completeInstantConstAppointment = (payload, success, err) => {
  sendPostRequest(
    APIUrl.completeInstantConstAppointment,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const payInstConsultationFee = (payload, success, err) => {
  sendPostRequest(
    APIUrl.payInstConsultationFee,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const updateCallDurationProvider = (payload, success, err) => {
  sendPostRequest(
    APIUrl.updateCallDurationProvider,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const onUserJoined = (payload, success, err) => {
  sendPostRequest(
    APIUrl.onUserJoined,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const onUserLeaveAppointment = (payload, success, err) => {
  sendPostRequest(
    APIUrl.onUserLeaveAppointment,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const completeAppointment = (payload, success, err) => {
  sendPostRequest(
    APIUrl.completeAppointment,
    payload,
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};

export const getBillingCode = (success, err) => {
  sendPostRequest(
    APIUrl.getBillingCode,
    {},
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};
export const getUserStripePayments = (success, err) => {
  sendPostRequest(
    APIUrl.getUserStripePayments,
    {
      status: 'failed',
      userId: userId(),
      limit: 3,
      patient: true,
    },
    error => {
      err(error?.data?.message);
    },
    res => {
      success(res);
    },
  );
};
