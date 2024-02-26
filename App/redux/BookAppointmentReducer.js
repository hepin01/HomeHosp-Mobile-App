const initialState = {
  arrUsers: [],
  currentPage: 1,
  intakeFormId: '',
  modeTypeAudio: null,
  inviteFamily: null,
  appointmentTypeNew: null,

  cheifComplain: '',
  selectedDuration: 'Select',
  selectedFrequency: 'Select',

  yesToAll: false,
  noToAll: false,
  questions: [
    {
      question: 'Do you have headaches?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 1,
    },
    {
      question: 'Do you have chest pain?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 2,
    },
    {
      question: 'Do you have shortness of breath?',
      isYes: null,
      questionType: 'input',
      answer: '',
      intakeId: 3,
    },
    {
      question: 'Do you have any abnormal bleeding?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 4,
    },
    {
      question: 'Do you have constipation?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 5,
    },
    {
      question: 'Do you have diarrhoea?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 6,
    },
    {
      question: 'Do you have trouble walking?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 7,
    },
    {
      question: 'Did you lose > 10 lbs of weight over the month?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 8,
    },
    {
      question: 'Do you have fever?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 9,
    },
    {
      question: 'Did you travel anywhere internationally in the last 3 month?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 10,
    },
    {
      question: 'Abdominal symptoms?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 11,
    },
    {
      question: 'Do you have nausia/vomiting?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 12,
    },
    {
      question: 'Do you feel dizzy?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 13,
    },
    {
      question: 'Do you have back pain?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 14,
    },
    {
      question: 'Do you chronic fatigue?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 15,
    },
    {
      question: 'Do you have skin rash?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 16,
    },
    {
      question: 'Do you have leg swelling?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 17,
    },
    {
      question: 'Do you have an open wound?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 18,
    },
    {
      question: 'Do you have trouble speaking?',
      answer: '',
      isYes: null,
      questionType: 'input',
      intakeId: 19,
    },
  ],
  isSWD: null, //If user has smart wearable device then true,
  sugar: '',
  BP: '',
  heartRate: '',
  height: '',
  weight: '',
  BMI: '',
  oxygen: '',
  isAgree: false,
  arrDocuments: [],
  arrFilesToUpload: [],

  selectedInsuranceName: [],
  insuranceName: [],
  policyNumber: '',
  InsuranceID: '',
  documentArr: [],
  arrCards: [],
  isOnline: true,
  showAddCard: false,
  saveCardForFuture: false,

  provider: [],
  providerFilter: {
    search: '',
    insurance: null,
    language: null,
    providerType: null,
    providerSubType: null,
    gender: null,
    affiliation: null,
    limit: 10,
    page: 1,
    isOnline: null,
    isNew: null,
    // idNotEqualTo: userId(),

    consultationDuration: 0,
    selectedTimeSlots: [],
    appointmentDate: null,

    objAppointment: {},
    objAppointmentPayload: {},

    selectedDoctor: {},
  },
};

export const UPDATE_CURRENT_STEP = 'UPDATE_CURRENT_STEP';
// step 1
export const UPDATE_ARRUSERS = 'UPDATE_ARRUSERS';
export const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE';
export const UPDATE_INTAKE_FORM_ID = 'UPDATE_INTAKE_FORM_ID';
export const UPDATE_MODE_TYPE_AUDIO = 'UPDATE_MODE_TYPE_AUDIO';
export const UPDATE_SET_INVITE_FAMILY = 'UPDATE_SET_INVITE_FAMILY';
export const UPDATE_APPOINTMENTTYPE_NEW = 'UPDATE_APPOINTMENTTYPE_NEW';

// step 2: Chief Complains
export const UPDATE_CHEF_COMPLAIN = 'UPDATE_CHEF_COMPLAIN';
export const UPDATE_DURATION = 'UPDATE_DURATION';
export const UPDATE_FREQUENCY = 'UPDATE_FREQUENCY';

// step 2: Intake off
export const UPDATE_YESTOALL = 'UPDATE_YESTOALL';
export const UPDATE_NOTOALL = 'UPDATE_NOTOALL';
export const UPDATES_QUESTIONS = 'UPDATES_QUESTIONS';
export const UPDATE_ISSWD = 'UPDATE_ISSWD';
export const UPDATE_SUGAR = 'UPDATE_SUGAR';
export const UPDATE_BP = 'UPDATE_BP';
export const UPDATE_HEART_RATE = 'UPDATE_HEART_RATE';
export const UPDATE_HEIGHT = 'UPDATE_HEIGHT';
export const UPDATE_WEIGHT = 'UPDATE_WEGHT';
export const UPDATE_BMI = 'UPDATE_BMI';
export const UPDATE_OXYGEN = 'UPDATE_OXYGEN';
export const UPDATE_ISAGREE = 'UPDATE_ISAGREE';
export const UPDATE_INTAKE_DOCS = 'UPDATE_INTAKE_DOCS';
export const UPDATE_FILES_TO_UPLOAD = 'UPDATE_FILES_TO_UPLOAD';

// step 3
export const UPDATE_SELECTED_INSURANCE = 'UPDATE_SELECTED_INSURANCE';
export const UPDATE_INSURANCE_NAME = 'UPDATE_INSURANCE_NAME';
export const UPDATE_POLICY_NUMBER = 'UPDATE_POLICY_NUMBER';
export const UPDATE_INSURANCE_ID = 'UPDATE_INSURANCE_ID';
export const UPDATE_ARR_CARDS = 'UPDATE_ARR_CARDS';
export const UPDATE_IS_ONLINE = 'UPDATE_IS_ONLINE';
export const UPDATE_SHOW_ADD_CARD = 'UPDATE_SHOW_ADD_CARD';
export const UPDATE_ARR_DOCUMENTS = 'UPDATE_ARR_DOCUMENTS';
export const UPDATE_SAVE_CARD_FUTURE = 'UPDATE_SAVE_CARD_FUTURE';

// step 4
export const UPDATE_PROVIDER = 'UPDATE_PROVIDER';
export const UPDATE_FILTER_PAYLOAD = 'UPDATE_FILTER_PAYLOAD';

export const UPDATE_CONSULTATOIN_DURATION = 'UPDATE_CONSULTATOIN_DURATION';
export const UPDATE_TIME_SLOTS = 'UPDATE_TIME_SLOTS';
export const UPDATE_APPOINTMENT_DATE = 'UPDATE_APPOINTMENT_DATE';

export const UPDATE_OBJ_APPOINTMENT = 'UPDATE_OBJ_APPOINTMENT';
export const UPDATE_OBJ_APPOINTMENT_PAYLOAD = 'UPDATE_OBJ_APPOINTMENT_PAYLOAD';

export const UPDATE_SELECTED_DOCTOR = 'UPDATE_SELECTED_DOCTOR';

export const RESET_BOOK_APPOINTMENT = 'RESET_BOOK_APPOINTMENT';

const BookAppointmentReducer = (state = initialState, action) => {
  const {type, payload} = action;
  console.log(type, payload)
  switch (type) {
    case UPDATE_ARRUSERS:
      return {
        ...state,
        arrUsers: payload,
      };
    case UPDATE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: payload,
      };
    case UPDATE_INTAKE_FORM_ID:
      return {
        ...state,
        intakeFormId: payload,
      };
    case UPDATE_MODE_TYPE_AUDIO:
      return {
        ...state,
        modeTypeAudio: payload,
      };
    case UPDATE_SET_INVITE_FAMILY:
      return {
        ...state,
        inviteFamily: payload,
      };
    case UPDATE_APPOINTMENTTYPE_NEW:
      return {
        ...state,
        appointmentTypeNew: payload,
      };
    case UPDATE_CHEF_COMPLAIN: {
      return {
        ...state,
        cheifComplain: payload,
      };
    }
    case UPDATE_DURATION: {
      return {
        ...state,
        selectedDuration: payload,
      };
    }
    case UPDATE_FREQUENCY: {
      return {
        ...state,
        selectedFrequency: payload,
      };
    }
    case UPDATE_YESTOALL: {
      return {
        ...state,
        yesToAll: payload,
      };
    }
    case UPDATE_NOTOALL: {
      return {
        ...state,
        noToAll: payload,
      };
    }
    case UPDATES_QUESTIONS: {
      return {
        ...state,
        questions: payload,
      };
    }
    case UPDATE_ISSWD: {
      return {
        ...state,
        isSWD: payload,
      };
    }
    case UPDATE_SUGAR: {
      return {
        ...state,
        sugar: payload,
      };
    }
    case UPDATE_BP: {
      return {
        ...state,
        BP: payload,
      };
    }
    case UPDATE_HEART_RATE: {
      return {
        ...state,
        heartRate: payload,
      };
    }
    case UPDATE_HEIGHT: {
      return {
        ...state,
        height: payload,
      };
    }
    case UPDATE_WEIGHT: {
      return {
        ...state,
        weight: payload,
      };
    }
    case UPDATE_BMI: {
      return {
        ...state,
        BMI: payload,
      };
    }
    case UPDATE_OXYGEN: {
      return {
        ...state,
        oxygen: payload,
      };
    }
    case UPDATE_ISAGREE: {
      return {
        ...state,
        isAgree: payload,
      };
    }
    case UPDATE_INSURANCE_NAME: {
      return {
        ...state,
        insuranceName: payload,
      };
    }
    case UPDATE_SELECTED_INSURANCE: {
      return {
        ...state,
        selectedInsuranceName: payload,
      };
    }
    case UPDATE_POLICY_NUMBER: {
      return {
        ...state,
        policyNumber: payload,
      };
    }
    case UPDATE_INSURANCE_ID: {
      return {
        ...state,
        InsuranceID: payload,
      };
    }
    case UPDATE_ARR_DOCUMENTS: {
      return {
        ...state,
        documentArr: payload,
      };
    }
    case UPDATE_ARR_CARDS: {
      return {
        ...state,
        arrCards: payload,
      };
    }
    case UPDATE_IS_ONLINE: {
      return {
        ...state,
        isOnline: payload,
      };
    }
    case UPDATE_SHOW_ADD_CARD: {
      return {
        ...state,
        showAddCard: payload,
      };
    }
    case UPDATE_PROVIDER: {
      return {
        ...state,
        provider: payload,
      };
    }
    case UPDATE_FILTER_PAYLOAD: {
      return {
        ...state,
        providerFilter: payload,
      };
    }
    case UPDATE_CONSULTATOIN_DURATION: {
      return {
        ...state,
        consultationDuration: payload,
      };
    }
    case UPDATE_TIME_SLOTS: {
      return {
        ...state,
        selectedTimeSlots: payload,
      };
    }
    case UPDATE_APPOINTMENT_DATE: {
      return {
        ...state,
        appointmentDate: payload,
      };
    }
    case UPDATE_SAVE_CARD_FUTURE: {
      return {
        ...state,
        saveCardForFuture: payload,
      };
    }
    case UPDATE_OBJ_APPOINTMENT: {
      return {
        ...state,
        objAppointment: payload,
      };
    }
    case UPDATE_SELECTED_DOCTOR: {
      return {
        ...state,
        selectedDoctor: payload,
      };
    }
    case UPDATE_OBJ_APPOINTMENT_PAYLOAD: {
      return {
        ...state,
        objAppointmentPayload: payload,
      };
    }

    case UPDATE_INTAKE_DOCS: {
      return {
        ...state,
        arrDocuments: payload,
      };
    }

    case UPDATE_FILES_TO_UPLOAD: {
      return {
        ...state,
        arrFilesToUpload: payload,
      };
    }
    case RESET_BOOK_APPOINTMENT: {
      return {
        ...initialState,
        questions: [
          {
            question: 'Do you have headaches?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 1,
          },
          {
            question: 'Do you have chest pain?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 2,
          },
          {
            question: 'Do you have shortness of breath?',
            isYes: null,
            questionType: 'input',
            answer: '',
            intakeId: 3,
          },
          {
            question: 'Do you have any abnormal bleeding?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 4,
          },
          {
            question: 'Do you have constipation?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 5,
          },
          {
            question: 'Do you have diarrhoea?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 6,
          },
          {
            question: 'Do you have trouble walking?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 7,
          },
          {
            question: 'Did you lose > 10 lbs of weight over the month?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 8,
          },
          {
            question: 'Do you have fever?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 9,
          },
          {
            question:
              'Did you travel anywhere internationally in the last 3 month?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 10,
          },
          {
            question: 'Abdominal symptoms?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 11,
          },
          {
            question: 'Do you have nausia/vomiting?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 12,
          },
          {
            question: 'Do you feel dizzy?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 13,
          },
          {
            question: 'Do you have back pain?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 14,
          },
          {
            question: 'Do you chronic fatigue?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 15,
          },
          {
            question: 'Do you have skin rash?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 16,
          },
          {
            question: 'Do you have leg swelling?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 17,
          },
          {
            question: 'Do you have an open wound?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 18,
          },
          {
            question: 'Do you have trouble speaking?',
            answer: '',
            isYes: null,
            questionType: 'input',
            intakeId: 19,
          },
        ],
      };
    }
    default:
      return state;
  }
};
export default BookAppointmentReducer;
