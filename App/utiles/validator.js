// import moment from 'moment';

import moment from 'moment';

export const emailValidator = (text, err, success) => {
  // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let pattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (pattern.test(String(text).toLowerCase()) === true) {
    //this.setState({ Email: text })
    success();
  } else {
    err();
  }
};

export const validateEnteredCharacters = text => {
  return text.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    '',
  );
};

export const validateName = text => {
  return text.replace(
    /([`~0-9!@#$%^&*()_|+\-₹¥₱£€★‡«»‹♠♣♥♦πΩ¶§›¢=?;:'",.<>\{\}\[\]\\\/])/gi,
    '',
  );
};

export const validatePhone = text => {
  return text.replace(
    /([`~!@#$%^&*()_|+\-₹¥₱£€★‡«»‹♠♣♥♦πΩ¶§›¢=?;:'",.<>\{\}\[\]\\\/])/gi,
    '',
  );
};

export const checkPwd = (str, err, success) => {
  if (str.length < 10) {
    err('Password must be of 10 to 16 characters');
    return;
  } else if (str.length > 16) {
    err('Password must be of 10 to 16 characters');
    return;
  } else if (str.search(/\d/) == -1) {
    err('Password must have a number');
    return;
  } else if (str.search(/[A-Z]/) == -1) {
    err('Password must have a Upper case');
    return;
  } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
    err('Password must have a special character');
    return;
  }
  success('ok');
};

export const getValueFromDictionary = (dict, key) => {
  if (dict?.hasOwnProperty(key)) {
    if (dict[key] == null) {
      return '';
    } else {
      return dict[key];
    }
  } else {
    return '';
  }
};

export const isMoment = date => {
  return moment.isMoment(date);
};