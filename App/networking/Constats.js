//Staging Url
const base = 'https://dev.homehosp.com/';

// Prod
//const base = 'https://homehosp.com/';
export const baseAuthUrl = base + 'api/v1/mobileapp/';
export const webViewBaseurl = base;
export const webview = 'webview';
export const s3DocBase =
  'https://s3.us-east-1.amazonaws.com/dev-homehosp/user-document/';
export const signURL = webViewBaseurl + 'signin';

export const APIUrl = {
  signin: baseAuthUrl + 'signin',
  getUserById: baseAuthUrl + 'getUserById',
  getuserprofile: baseAuthUrl + 'getuserprofile',
  updateProvider: baseAuthUrl + 'updateProvider',
  updatePatient: baseAuthUrl + 'update-patient',
  previewDocument: baseAuthUrl + 'previewDocument',
  forgotPassword: baseAuthUrl + 'password-reset-request',
  resetPassword: baseAuthUrl + 'reset-password',
  resendOtp: baseAuthUrl + 'resend-otp',
  checkOtp: baseAuthUrl + 'check-otp',
  updateProfilepic: baseAuthUrl + 'updateProfilepic',
  changePassword: baseAuthUrl + 'change-password',
  userInvitation: baseAuthUrl + 'user-invitation',
  specialityList: baseAuthUrl + 'provider-specialties',
  changePhoneNumber: baseAuthUrl + 'change-phone-number',
  changeEmail: baseAuthUrl + 'change-email',
  verifyOTPForEmail: baseAuthUrl + 'verify-change-email-otp',
  languageList: baseAuthUrl + 'languagelist',
  stateList: baseAuthUrl + 'statelist',
  cityList: baseAuthUrl + 'citylist',
  getDoctorAppointments: baseAuthUrl + 'getDoctorAppointments',
  getPatientsAppointments: baseAuthUrl + 'getPatientAppointments',
  getERequest: baseAuthUrl + 'getErequests',
  getFollowupAppointments: baseAuthUrl + 'getFollowupAppointments',
  toggleErequest: baseAuthUrl + 'toggleErequest',
  getProviderAppBySchedule: baseAuthUrl + 'getProviderAppBySchedule',
  listDoctors: baseAuthUrl + 'listDoctors',
  getAppointmentSlots: baseAuthUrl + 'getAppointmentSlots',
  createAppForEconsultation: baseAuthUrl + 'createAppForEconsultation',
  getAgencyUsers: baseAuthUrl + 'getAgencyUsers',
  findLatestProviderApp: baseAuthUrl + 'findLatestProviderApp',
  checkDay1Day2ForProvider: baseAuthUrl + 'checkDay1Day2ForProvider',
  getCurrentSchedule: baseAuthUrl + 'getCurrentSchedule',
  getProviderTodaysApp: baseAuthUrl + 'getProviderTodaysApp',
  toggleProviderPrefference: baseAuthUrl + 'toggleProviderPrefference',
  getDelegateUsers: baseAuthUrl + 'getDelegateUsers',
  removeDelegateUser: baseAuthUrl + 'removeDelegateUser',
  addNewDelegateUser: baseAuthUrl + 'addNewDelegateUser',
  getPreferredProviders: baseAuthUrl + 'getPreferredProviders',
  updateUserData: baseAuthUrl + 'updateUserData',
  getAllVendorServices: baseAuthUrl + 'getAllVendorServices',
  getProviderDetailForDelegateUser:
    webViewBaseurl + 'api/appointment/getProviderDetailForDelegateUser',
  // getProviderDetailForDelegateUser:
  //   baseAuthUrl + 'getProviderDetailForDelegateUser',
  uploadMultipleDocument: baseAuthUrl + 'uploadMultipleDocument',
  updateProviderInsurance: baseAuthUrl + 'updateProviderInsurance',
  getCurrentPlan: webViewBaseurl + 'api/subscription/getCurrentPlan',
  getCustomerCards: baseAuthUrl + 'getCustomerCards',
  addnewCardCustomerId: baseAuthUrl + 'addnewCardCustomerId',
  getInatakeformvaluesNew: baseAuthUrl + 'getInatakeformvaluesNew',
  submitApointment: baseAuthUrl + 'submitApointment',
  checkForTodaysInsApp: webViewBaseurl + 'api/appointment/checkForTodaysInsApp',
  createAppointment: baseAuthUrl + 'createAppointment',
  checkEmail: webViewBaseurl + 'api/admin/checkEmail',
  getTwilioToken: baseAuthUrl + 'getTwilioToken',
  invitePatient: baseAuthUrl + 'instant-conultation-invitation',
  getPatientsForInstantConsultation:
    baseAuthUrl + 'getPatientsForInstantConsultation',
  toggleInstantConsultation: baseAuthUrl + 'toggleInstantConsultation',
  getInstantConsultationAppointments:
    baseAuthUrl + 'getInstantConsultationAppointments',
  approveRejectInstantConsultation:
    baseAuthUrl + 'approveRejectInstantConsultation',
  requestPatientForInstantConsultation:
    baseAuthUrl + 'requestPatientForInstantConsultation',
  addInstantConsultationSchedule:
    baseAuthUrl + 'addInstantConsultationSchedule',
  getInstantConsultationAppointmentsForPatient:
    baseAuthUrl + 'getInstantConsultationAppointmentsForPatient',
  getInstantConsultationProviders:
    baseAuthUrl + 'getInstantConsultationProviders',
  requestProviderForInstantConsultation:
    baseAuthUrl + 'requestProviderForInstantConsultation',
  addInstantIntakeForm: baseAuthUrl + 'addInstantIntakeForm',
  addFirebaseTokenToUser: baseAuthUrl + 'addFirebaseTokenToUser',
  getNotifications: baseAuthUrl + 'getNotifications',
  setAllNotificationsToRead: baseAuthUrl + 'setAllNotificationsToRead',
  //User Data triggers to save info at backend
  checkIfProviderJoined: baseAuthUrl + 'checkIfProviderJoined',
  onProviderJoined: baseAuthUrl + 'onProviderJoined',
  onProviderLeaveAppointment: baseAuthUrl + 'onProviderLeaveAppointment',
  updateCallDurationProvider: baseAuthUrl + 'updateCallDurationProvider',
  onUserJoined: baseAuthUrl + 'onUserJoined',
  onUserLeaveAppointment: baseAuthUrl + 'onUserLeaveAppointment',
  completeAppointment: baseAuthUrl + 'completeAppointment',
  getBillingCode: baseAuthUrl + 'getBillingCode',
  completeInstantConstAppointment:
    baseAuthUrl + 'completeInstantConstAppointment',
  payInstConsultationFee: baseAuthUrl + 'payInstConsultationFee',
  getUserStripePayments: webViewBaseurl + 'api/user/getUserStripePayments',
};
