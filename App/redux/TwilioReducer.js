const INITIAL_STATE = {
  message: '',
  arrMessage: [],
};

const TwilioReducer = (state = INITIAL_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case UPDATE_MESSAGE:
      return {
        ...state,
        message: payload,
      };
    case UPDATE_ARR_MESSAGES: {
      return {
        ...state,
        arrMessage: payload,
      };
    }
    default:
      return state;
  }
};

export default TwilioReducer;

export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_ARR_MESSAGES = 'UPDATE_ARR_MESSAGES';