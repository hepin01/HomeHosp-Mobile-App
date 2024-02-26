import {getTimeZone} from 'react-native-localize';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {Store} from '../../App';
import moment from 'moment';
import {webview, webViewBaseurl} from '../networking/Constats';
import images from '../assets/images';

export const getCurrentTimezone = () => {
  return getTimeZone();
};

export const displayErrorMsg = message => {
  showMessage({
    message: message,
    type: 'danger',
  });
};

export const displayMsg = message => {
  showMessage({
    message: message,
    type: 'success',
  });
};

export const dismissMsg = () => {
  hideMessage({});
};

export const userId = () => {
  return Store.getState().user.user._id;
};

export const getUTCIso = date => {
  const recDate = moment(date);
  return recDate.utc().toISOString();
};

export const getAccessToken = () => {
  const {
    user: {accessToken},
  } = Store.getState();
  return accessToken;
};
export const getWebViewUrl = uri => {
  const {
    user: {
      accessToken,
      user: {firstname, lastname, userType},
    },
  } = Store.getState();
  const user = userType == 'medicalProvider' ? 'provider' : userType;
  return (
    webViewBaseurl +
    user +
    '/' +
    uri +
    `${accessToken}/${user}/${userId()}/${firstname}/${lastname}/isMobile`
  );
};

export const isProvider = () => {
  const {
    user: {user},
  } = Store.getState();
  return user?.userType == 'provider' || user?.userType == 'medicalProvider';
};

export const isMedicalProvider = () => {
  const {
    user: {user},
  } = Store.getState();
  return user?.userType == 'medicalProvider';
};

export const getInsuranceList = () => {
  return [
    'AAA California State Automobile Association',
    'AARP HEALTH CARE OPTIONS',
    'ACF/Healthnet-Medical',
    'ACME Administrators',
    'ADMAR CORPORATION',
    'Adventist Health',
    'AETNA',
    'AETNA HMO',
    'AETNA PPO',
    'AETNA/ US HEALTHCARE',
    'AFFILIATED MEDICAL',
    'AIG Claims Services Inc.',
    'AIMS Insurance Company',
    'ALLSTATE',
    'Alpha Fund',
    'AMBASSADOR SERVICES',
    'AMERCIAN DATA MED',
    'American Administrative Group',
    'American All Risk Loss Administrators',
    'American Claims Management',
    'American Commercial Claims',
    'American Fidelity Assurance Company',
    'American General',
    'American Home Assurance Co',
    'AMERICAN PREFERRED PROVIDERS',
    'American Progressive',
    'Ameriprise Auto & Home Corporation',
    'AMEX ASSURANCE COMPANY',
    'Amtrust',
    'ANTHEM BLUE CROSS',
    'Anthem Blue Cross (Medicare Programs)',
    'Anthem Blue Cross PERS',
    'AON E-SOLUTIONS',
    'APPLIED RISK SERVICES',
    'APWU HEALTH PLAN',
    'Arcadian Health Plan',
    'Argonaut Insurance',
    'ARM Group',
    'Assurant Health',
    'Athens Insurance',
    'Avizent',
    'AVMA New York Life / First Health',
    'Bankers Life and Casualty Company',
    'BAS Health',
    'Berkshire Hathaway Home Estate Company',
    'BLUE CROSS',
    'Blue Cross Blue Shield',
    'BLUE CROSS MCAL',
    'BLUE CROSS BLUE SHIELD OF ILLINOIS',
    'Blue Cross Blue Shield of Michigan',
    'Blue Cross Blue Shield of Wyoming',
    'Blue Cross Blue Shield PPO',
    'Blue Cross Blue Shield PPO Alabama',
    'BLUE CROSS FOUNDATION SISC III',
    'Blue Cross Freedom Blue',
    'Blue Cross Medicare',
    'BLUE CROSS PERS',
    'BLUE CROSS PPO',
    'BLUE CROSS PRUDENT BUYER',
    'Blue Cross Senior',
    'Blue Cross Senior Smart Choice',
    'Blue Cross SISC III',
    'Blue Cross- MediCal Program',
    'Blue Cross/ Blue Shield',
    'Blue Cross/ Blue Shield PPO',
    'Blue Cross/Blue Shield of Oklahoma',
    'Blue Cross/Blue Shield/National Accounts',
    'Blue Cross/Blue Shield of Alabama',
    'Blue Cross Blue Shield of Michigan',
    'Blue Shield 65 Plus (HMO)',
    'Blue Shield FEP',
    'Blue Shield of California',
    'Blue Shield of California Life & Health',
    'BlueCross BlueShield of Oklahoma',
    'BPS HEALTH SERVICES/ ANTHEM',
    'Brand New Day',
    'Brick Masons Trust Fund',
    'BROADSPIRE',
    'CA Field Ironworkers Trust Fund',
    'California Insurance Guarantee Association',
    'California PCI Claims',
    'California Water Service',
    'CAMBRIDGE',
    'CAPP CARE',
    'CARESOLUTION SERVICES CENTER',
    'CCMSI',
    'CCN',
    'CDPHP',
    'CENTURY INSURANCE',
    'Champ VA',
    'Chevron Corporation',
    'CHOICE NETWORK',
    'CHUBB',
    'CIGA',
    'CIGNA',
    'Cigna Group Insurance',
    'CIGNA HEALTHCARE INCORPORATED',
    'Cigna Medicare Access Plus',
    'Cigna Medicare Supplemental Solutions',
    "City of San Jose Workers' Compensation",
    'CNIC Health Solutions',
    'Coastal Communities Physician Network',
    'COLONIAL MEDICAL GROUP',
    'Colonial Penn Life Insurance',
    'COLORADO INSURANCE GUARANTY ASSOCIATION',
    'Combined Benefits Administrators',
    'COMP MEDICAL',
    'Comp West',
    'Concentra Integrated Services',
    'CONTITUTION STATE SERVICES',
    'Corvel Corporation',
    'COUNTY OF KERN',
    'County of Kern POS Plan',
    'County of Kern Workers Comp.',
    'Coventry WC Services',
    'Crawford & Company',
    'Cypress Ins./ Strata Care',
    'Definity Health',
    'DELTA HEALTH SYSTEMS',
    'DEPARTMENT OF LABOR AND INDUSTRY',
    'Department of Veterans Affairs',
    'Deseret Mutual',
    'Deseret Secure',
    'Dignity Health',
    'Disability Management Services',
    'Employers Compensation Insurance Company',
    'EMSI',
    'ESIS Insurance',
    'ESIS Insurance Company/ACE',
    'ESIS West WC Claims',
    'Evergreen Arvin Healthcare',
    'FARA',
    'FARMERS INSURANCE',
    "Fireman's Fund Insurance Company",
    'FIRST CHOIC/CCN/PPO ALLIANCE',
    'FIRST HEALTH',
    'Fiserv Health Benefit Planners',
    'FOSTER FARMS WORKERS COMP',
    'FREMONT COMPENSATION',
    'GALLAGHER BASSETT',
    'GBLA',
    'GEHA',
    'GEHA-ASA',
    'GEICO',
    'Golden Eagle Insurance Co.',
    'GOLDEN EMPIRE MANAGED CARE',
    'Great America Insurance',
    'GREAT WEST',
    'Great West Healthcare',
    'Group Health',
    'Group Market Disability Claims',
    'Group Pension Administration',
    'Guardian Insurance',
    'Hartford Claims Insurance',
    'HARTFORD INSURANCE CO',
    'Hartford Insurance Underwriters',
    'HARTFORD LIFE, INC.',
    'Hazelrigg Risk Insurance',
    'HDI',
    'Health Advocates',
    'Health Data Insights, Inc.',
    'Health Edge Administrator',
    'HEALTH NET',
    'HEALTH NET MEDI-CAL',
    'HEALTH NET OF CALIFORNIA',
    'Health Net PPO',
    'Health Plan of Nevada, Inc.',
    'HEALTHCOMP',
    'Health Edge Inc.',
    'Health Scope Benefits, Inc.',
    'Helmsman Management Services Inc.',
    'HERITAGE Physicians Network',
    'Highmark Blue Cross Blue Shield',
    'Hispanic Physicians IPA',
    'Hospital Association Santa Fe Railroad',
    'Humana',
    'Humana Claims',
    'Humana Gold Plus (HMO)',
    'ICW Group Insurance Company',
    'Independent Medical Group',
    'Insurance Company of the West',
    'Intercare Holding Insurance Services',
    'INTERCARE INSURANCE SERVICES',
    'INTERPLAN',
    'J1 MAC PALMETTO GBA',
    'Jefferson Pilot Financial Insurance',
    'Keenan & Associates',
    'KEMPER',
    'KERN COUNTY DEPARTMENT OF HUMAN SERVICES',
    'Kern County Risk Management',
    'KERN COUNTY WORK COMP',
    'Kern Health Systems',
    'Kern Legacy',
    'KNOX SERVICES',
    'L A County Fire Fighters Local 1014 H&W',
    'Labors Union of So. Cal',
    'LABORERS HEALTH AND WELFARE TRUST',
    'Liberty Life Assurance Company of Boston',
    'Liberty Mutual Insurance Co',
    'Liberty Mutual Insurance Group',
    'LOS Angeles Department of Water and Power',
    'MCMC ATTN Meadowbrook Insurance Group',
    'MCS County of Kern EPO Plan',
    'Meadowbrook Insurance Group',
    'Medi-Cal',
    'Medicare Part B',
    'MEDICARE-NHIC',
    'MediConnect Global Inc',
    'MEDIPLUS',
    'MEDISHARE',
    'Medlink',
    'Meritain Health',
    'MES Solutions',
    'METLIFE AUTO AND HOME',
    'MIDWEST',
    'Missionary Medical',
    'MLS National Medical Evaluation Services',
    'MOTION PICTURE INDUSTRY',
    'MSA Care Guard',
    'Mutual of Omaha Individual Claims',
    'MVP HealthCare',
    'NABL Claims',
    'NALC Health Benefit Plan',
    'NATIONWIDE HEALTH PLAN',
    'National Financial Insurance Co',
    'National Market/Liberty Mutual',
    'NATIONWIDE HEALTH PLANS',
    'NBLA Membership Plan, PCI',
    'Network Medical Management Company, LTD',
    'New Era Life',
    'Noridian',
    'Octagon',
    'OPERATING ENGINEERS',
    'Orange County Foundation for Medical Care',
    'Outcome Sciences, Inc (OPUS)',
    'P G & E',
    'Pacific Gas and Electric Company',
    'PACIFIC HEALTH ALLIANCE',
    'PACIFIC LIFE AND ANNUITY COMPANY',
    'PACIFICARE',
    'PACIFICARE PPO',
    'PACIFICARE Senior',
    'PALADIN MANAGED CARE SERVICES',
    'PALMETTO GBA Claims Part B',
    'Palmetto GBA Finance & Accounting',
    'Palmetto GBA Railroad Medicare',
    'Pan-American Life Insurance Co.',
    'Patriot Risk Services',
    'PAULA INSURANCE COMPANY',
    'Pegasus Risk Management',
    'PERFORMAX',
    'Pinnacle Claims MGT',
    'Pinnacle Risk Management Services, Inc',
    'Pre-Existing Condition Insurance Plan',
    'PREFERRED HEATLHCARE NETWORK',
    'Premera Blue Cross Blue Shield',
    'PRINCIPAL FINANCIAL GROUP',
    'PRUDENTIAL',
    'Qual Care',
    'QUEST DISCOVERY SERVICES',
    'QUINN COMPANY',
    'Reassure America',
    'Reliance Standard Life Insurance Company',
    'RISK MANAGEMENT',
    'SAGEMED',
    'Schaller Anderson',
    'Sedgewick Claims Management Service',
    'SENTRY INSURANCE',
    "SHEET METAL WORKERS'",
    'SISC',
    'SISC I',
    'SISC III',
    'So. California drug Benefit Fund',
    'Social Security Administration',
    'Social Security Disability Advocates',
    'Southern California Drug Benefit Fund',
    'Southern California Edison',
    'Southern California Gas Company',
    'Southern California Pipe Trades',
    "Southern California Workers' Comp",
    'Southwest Administrators',
    'Southwest Carpenters Health & Welfare',
    'Specialty Risk Services',
    'Standard Life & Accident Insurance CO',
    'STATE COMPENSATION INSURANCE FUND',
    'State Farm Health Insurance',
    'State Farm Ins-Group Medical',
    'State Farm Insurance Companies',
    'Sterling Health Services Administration,',
    "Texas Workers' Compensation Commission",
    'The Hartford Financial Services Group, I',
    'The Hartford Insurance',
    'The Hartford/SRS',
    'THE MAIL HANDLERS BENEFIT PLAN',
    'The Mega Life & Health Insurance Company',
    'The Travelers Rancho Cordova',
    'THE ZENITH INSURANCE COMPANY',
    'TOKIO MARINE',
    'Tower Life Insurance Company',
    'Transamerica Life Insurance Company',
    'TRAVELERS INDEMNITY CO OF CT',
    'Travelers Indemnity of CO',
    'Tricare',
    'Tricare for Life W.P.S.',
    'TRICARE WEST REGION',
    'Tristar Insurance Company',
    'TRISTAR RISK MANAGEMENT',
    'TRUSTEED PLANS SERVICES CORPORATION',
    'United American',
    'United Health Care DELTA',
    'United Health Care Verizon',
    'UNITED HEALTHCARE',
    'United Life Insurance',
    'UNITED WORLD LIFE INSURANCE COMPANY',
    'UNITRIN DIRECT',
    'Unum THE BENEFITS CENTER',
    'UNUMPROVIDENT',
    'US Department of Labor',
    'USAA LIFE INSURANCE COMPANY',
    'Utah Pipe Trades Welfare Trust Fund',
    'WARNER BROS. WORKERS COMPENSATION',
    'WASHINGTON NATIONAL INSURANCE COMPANY',
    'WC AIR FORCE INS FUND',
    'WC Insurance Carrier CNA Continental Casualty',
    'WELLCARE HEALTH INSURANCE PLAN',
    'Western Growers',
  ];
};

export const validateStringLength = str => {
  if (typeof str == 'string') {
    if (str) {
      return str.trim().length !== 0;
    } else return false;
  } else return false;
};

// validate number decimal is optional
export const validateNumberWithDecimal = str => {
  const regex = /^\d+(\.\d{1,2})?$/;
  if (str) {
    return regex.test(str);
  }
};

export const allowedFileFormates = ['DOC', 'PDF', 'JPEG', 'JPG', 'PNG'];

export const charges = {
  adminFees: 5,
  stripeFixedCharge: 0.3,
  stripePercentageCharge: 0.029,
};

export const getIsChecked = obj => {
  if (obj == null) {
    return null;
  }
  return obj;
};

export const cardsBrand = {
  visa: images.visaimg,
  mastercard: images.mastercard,
  'diners club': images.diners,
  'american express': images.americanexpressicon,
  unionpay: images.chinaunionpaycup,
  jcb: images.japancreditbureaujcb,
  discover: images.dicovericon,
};

export const twilio = {
  sid: 'ACd7124d023ffc12e1d54b6d11fc8a3d6e',
  apiKeySid: 'SK23342f585595a00a4fefa58ca6811235',
  apiSecret: 'bAC27xtknVPBDkldMUjrP3nD9DAP6hU6',
};

export const getContentWebviewUrl = url => url;
export const contactUs = () => {
  return '+1 725726-8926';
};

export const getFinalPrice = (objAppointment, useDetails, isOnline) => {
  let transactionCharge = 0;
  if (isOnline) {
    if (useDetails.isPatientChargesEnabled) {
      // formula to calcular target charge for deducting stripe charges from patient
      transactionCharge =
        (parseFloat(objAppointment?.price) +
          charges.adminFees +
          charges.stripeFixedCharge) /
        (1 - charges.stripePercentageCharge);
    } else {
      transactionCharge =
        (parseFloat(objAppointment?.price) + charges.stripeFixedCharge) /
        (1 - charges.stripePercentageCharge);
    }
    return parseFloat(transactionCharge).toFixed(2);
  } else {
    return objAppointment?.price;
  }
};

export const paymentPending = (moreThanThree, navigation) => {
  const webviewUri = getWebViewUrl('profile/payment-info/');
  const message = moreThanThree
    ? ''
    : 'You have payments pending for completed appointments. Please click on the "Pay" button to pay from the Payment section.';
  Alert.alert('Alert', message, [
    {
      text: 'Pay',
      onPress: () => {
        navigation.navigate(webview, {
          uri: webviewUri,
          title: 'Payment Information',
        });
      },
    },
    {
      text: 'Close',
      style: 'destructive',
    },
  ]);
};
