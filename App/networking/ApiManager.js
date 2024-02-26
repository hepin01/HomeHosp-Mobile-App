import axios from 'axios';

import NetInfo from '@react-native-community/netinfo';
import {Store} from '../../App';
import {RESET_BOOK_APPOINTMENT} from '../redux/BookAppointmentReducer';

// import { Store } from '../../../App';

const checkIfAuthValid = error => {
  if (Object.keys(error?.response?.data?.data).includes('auth')) {
    if (error?.response?.data?.data?.auth == false) {
      Store.dispatch({type: 'LOGOUT'});
      Store.dispatch({type: RESET_BOOK_APPOINTMENT});
    }
  }
};
export const postMethodMultipart = (endpointUrl, parameters, header) => {
  //console.log("endpointUrl:", JSON.stringify(endpointUrl), "\nparameters:", JSON.stringify(parameters), "\nheader:", JSON.stringify(header));
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // const currentState = Store.getState();
        axios
          .post(endpointUrl, parameters, {
            headers: header,
            timeout: 15000,
          })
          .then(response => {
            //console.log(response.data && response.data);
            resolve(response.data);
          })
          .catch(error => {
            //console.log(error.response && error.response.data && error.response.data);

            if (error.message && error.message.includes('timeout')) {
              //console.log(error.message);
              reject({data: {message: 'Request timeout.'}});
            } else if (error.response && error.response.status == 401) {
              checkIfAuthValid(error);
              reject();
            } else {
              //console.log("rehit call")
              reject(
                error.response
                  ? error.response.data
                  : {data: {message: 'Something went wrong'}},
              );
            }
          });
      } else {
        reject({data: {message: 'No Internet Connection'}});
      }
    });
  });
};

export const postMethod = (endpointUrl, parameters, header) => {
  console.log(JSON.stringify(endpointUrl), "\n", JSON.stringify(parameters), "\n", JSON.stringify(header));
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        axios
          .post(endpointUrl, parameters, {
            headers: header,
            timeout: 15000,
          })
          .then(response => {
            console.log(response.data && response.data);
            resolve(response.data);
          })
          .catch(error => {
            console.log(error, error.response);
            if (error.message && error.message.includes('timeout')) {
              console.log(error.message);
              reject({data: {message: 'Request timeout.'}});
            } else if (error.response && error.response.status == 401) {
              checkIfAuthValid(error);
              reject(
                error.response
                  ? error.response.data
                  : {data: {message: 'Something went wrong'}},
              );
            } else {
              reject(
                error.response
                  ? error.response.data
                  : {data: {message: 'Something went wrong. Please Try Again'}},
              );
            }
          });
      } else {
        reject({data: {message: 'No Internet Connection'}});
      }
    });
  });
};

export const putMethod = (endpointUrl, parameters, header) => {
  console.log(endpointUrl, parameters, header);
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        axios
          .put(endpointUrl, parameters, {
            headers: header,
            timeout: 15000,
          })
          .then(response => {
            console.log(response.data && response.data);
            resolve(response.data);
          })
          .catch(error => {
            console.log(error.response && error.response.data);
            if (error.message && error.message.includes('timeout')) {
              console.log(error.message);
              reject({data: {message: 'Request timeout.'}});
            } else if (error.response && error.response.status == 401) {
              checkIfAuthValid(error);
              // Store.dispatch({type: 'LOGOUT'});
              // Store.dispatch({type: RESET_BOOK_APPOINTMENT});
              reject(
                error.response
                  ? error.response.data
                  : {data: {message: 'Something went wrong'}},
              );
              reject();
            } else {
              console.log('rehit call');
              reject(
                error.response
                  ? error.response.data
                  : {data: {message: 'Something went wrong'}},
              );
            }
          });
      } else {
        reject({data: {message: 'No Internet Connection'}});
      }
    });
  });
};

export const deleteMethod = (endpointUrl, header, err, success) => {
  //console.log("endpointUrl", endpointUrl, header);
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      axios
        .delete(endpointUrl, {
          headers: header,
        })
        .then(response => {
          //console.log("success:", response.data);
          success(response.data);
        })
        .catch(error => {
          //console.log("error :", error.response.data ? error.response.data : "");
          err(
            error.response.data
              ? error.response.data
              : {data: {message: 'Please try again.'}},
          );
        });
    } else {
      err({data: {message: 'No Internet'}});
    }
  });
};

export const getMethod = (endpointUrl, header) => {
  console.log(endpointUrl, header);
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        axios
          .get(endpointUrl, {
            headers: header,
            timeout: 15000,
          })
          .then(response => {
            console.log(response);
            resolve(response?.data);
          })
          .catch(error => {
            console.log(
              error.response && error.response.data && error.response.data,
            );

            if (error.message && error.message.includes('timeout')) {
              //console.log(error.message);
              reject({data: {message: 'Request timeout.'}});
            } else if (error.response && error.response.status == 403) {
              reject();
            } else {
              //console.log("rehit call")
              reject(
                error.response
                  ? error.response.data
                  : {data: {message: 'Something went wrong. Please try again'}},
              );
            }
          });
      } else {
        reject({data: {message: 'No Internet Connection'}});
      }
    });
  });
};

export const patchMethod = (endpointUrl, parameters, header, err, success) => {
  //console.log("endpointUrl", endpointUrl, parameters, header);
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      axios
        .patch(endpointUrl, parameters, {
          headers: header,
        })
        .then(response => {
          //console.log("success:", response.data);
          success(response.data);
        })
        .catch(error => {
          //console.log("error :", error.response.data ? error.response.data : "");
          err(
            error.response.data
              ? error.response.data
              : {data: {message: strings('common.errMsgTry')}},
          );
        });
    } else {
      err({data: {message: 'No Internet'}});
    }
  });
};
