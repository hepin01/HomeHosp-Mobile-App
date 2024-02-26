import {
  UPDATE_CHEF_COMPLAIN,
  UPDATE_DURATION,
  UPDATE_FREQUENCY,
  UPDATES_QUESTIONS,
  UPDATE_BMI,
  UPDATE_BP,
  UPDATE_HEART_RATE,
  UPDATE_HEIGHT,
  UPDATE_ISAGREE,
  UPDATE_ISSWD,
  UPDATE_NOTOALL,
  UPDATE_OXYGEN,
  UPDATE_SUGAR,
  UPDATE_WEIGHT,
  UPDATE_YESTOALL,
} from '../../../../redux/BookAppointmentReducer';

export const updateQuestions = arr => {
  Store.dispatch({
    type: UPDATES_QUESTIONS,
    payload: arr,
  });
};

export const updateYesToAll = bool => {
  Store.dispatch({
    type: UPDATE_YESTOALL,
    payload: bool,
  });
};

export const updateNoToAll = bool => {
  Store.dispatch({
    type: UPDATE_NOTOALL,
    payload: bool,
  });
};

export const updateISSwd = bool => {
  Store.dispatch({
    type: UPDATE_ISSWD,
    payload: bool,
  });
};

export const updateSugar = str => {
  Store.dispatch({
    type: UPDATE_SUGAR,
    payload: str,
  });
};

export const updateBP = str => {
  Store.dispatch({
    type: UPDATE_BP,
    payload: str,
  });
};

export const updateheartRate = str => {
  Store.dispatch({
    type: UPDATE_HEART_RATE,
    payload: str,
  });
};

export const updateHeight = str => {
  Store.dispatch({
    type: UPDATE_HEIGHT,
    payload: str,
  });
};

export const updateWeight = str => {
  Store.dispatch({
    type: UPDATE_WEIGHT,
    payload: str,
  });
};

export const updateBMI = str => {
  Store.dispatch({
    type: UPDATE_BMI,
    payload: str,
  });
};

export const updateOxygen = str => {
  Store.dispatch({
    type: UPDATE_OXYGEN,
    payload: str,
  });
};

export const updateIsAgree = bool => {
  Store.dispatch({
    type: UPDATE_ISAGREE,
    payload: bool,
  });
};

export const updateChiefComplaints = str => {
  Store.dispatch({
    type: UPDATE_CHEF_COMPLAIN,
    payload: str,
  });
};

export const updateSelectedFrequency = str => {
  Store.dispatch({
    type: UPDATE_FREQUENCY,
    payload: str,
  });
};

export const updateSelectedDuration = str => {
  Store.dispatch({
    type: UPDATE_DURATION,
    payload: str,
  });
};
