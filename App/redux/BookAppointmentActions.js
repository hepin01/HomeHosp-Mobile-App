import {Store} from '../../App';
import {
  UPDATES_QUESTIONS,
  UPDATE_CHEF_COMPLAIN,
  UPDATE_DURATION,
  UPDATE_FREQUENCY,
  UPDATE_INTAKE_DOCS,
  UPDATE_BMI,
  UPDATE_BP,
  UPDATE_HEART_RATE,
  UPDATE_HEIGHT,
  UPDATE_ISSWD,
  UPDATE_OXYGEN,
  UPDATE_SUGAR,
  UPDATE_WEIGHT,
  UPDATE_ISAGREE,
  RESET_BOOK_APPOINTMENT,
  UPDATE_FILES,
  UPDATE_FILES_TO_UPLOAD,
} from './BookAppointmentReducer';

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

export const updateIntakeDocuments = arr => {
  Store.dispatch({
    type: UPDATE_INTAKE_DOCS,
    payload: arr,
  });
};

export const updateQuestions = arr => {
  Store.dispatch({
    type: UPDATES_QUESTIONS,
    payload: arr,
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

export const resetAppointment = () => {
  Store.dispatch({
    type: RESET_BOOK_APPOINTMENT,
  });
};

export const updateFilesToUpload = arr => {
  Store.dispatch({
    type: UPDATE_FILES_TO_UPLOAD,
    payload: arr,
  });
};
