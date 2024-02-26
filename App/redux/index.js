import {combineReducers} from 'redux';
import UserReducer from './UserReducer';
import BookAppointmentReducer from './BookAppointmentReducer';
import TwilioReducer from './TwilioReducer'

export default combineReducers({
  user: UserReducer,
  twilio: TwilioReducer,
  bookedAppointment: BookAppointmentReducer,
});
