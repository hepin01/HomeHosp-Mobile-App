import React from 'react';
import {
  Text,
  View,
  Switch,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

import { arrPatient } from './dummyData';

import Base from '../Base/Base';
import TypeSelector from './TypeSelector';
import { ButtonComponent } from '../../components/ButtonComponent';
import { commonStyles, COLORS, getCalculated } from '../../components/Common';
import RequestRecCell from './RequestRecCell';
import RequestSentCell from './RequestSentCell';
import {
  completeInstantConstAppointment,
  getInstantConsultationAppointments,
  onProviderLeaveAppointment,
  toggleInstantConsultation,
} from '../../networking/APIMethods';
import images from '../../assets/images';
import { BillingCode } from './BiilingCode';
import moment from 'moment';
import { getUTCIso } from '../../utiles/common';

const { height } = Dimensions.get('screen');
const types = [
  {
    id: 1,
    label: 'Requests Received',
    selected: true,
  },
  {
    id: 2,
    label: 'Request Sent',
    selected: false,
  },
];
class Instant extends Base {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      isEnabled: false,
      arrTypes: [...types],
      selectedType: types[0],
      arrRequestSent: [],
      arrRequestRec: [],
      showBillingCode: false,
      selectedItem: {},
    };
    this.focus = null;
  }

  componentDidMount() {
    this.fetchPatientList();
    this.focus = this.props.navigation.addListener('focus', () => {
      this.setState(
        prevState => {
          return { selectedType: prevState.selectedType };
        },
        () => {
          this.fetchPatientList();
        },
      );
    });
  }

  componentWillUnmount() {
    if (this.focus) {
      this.focus();
    }
  }

  toggleSwitch() {
    const { isEnabled } = this.state;
    this.setState({ isEnabled: !isEnabled }, () => {
      this.postToggleInstantConsultation();
    });
  }

  fetchPatientList() {
    // this.showLoader();
    this.setState({ fetching: true });
    const payload = {
      isWaiting: false,
      isPatientRequested: this.state.selectedType.id == 1,
      startDate: getUTCIso(moment()),
    };
    getInstantConsultationAppointments(
      payload,
      response => {
        // this.dismissLoader();
        if (this.state.selectedType.id == 1) {
          this.setState({ arrRequestRec: response?.data, fetching: false });
        } else if (this.state.selectedType.id == 2) {
          this.setState({ arrRequestSent: response?.data, fetching: false });
        }
      },
      error => {
        // this.dismissLoader();
        console.log(error);
        this.displayErrorMsg(error);
        this.setState({ fetching: false });
      },
    );
  }

  postToggleInstantConsultation() {
    // this.showLoader();
    const payload = {
      isInstantConsultation: this.state.isEnabled,
    };
    toggleInstantConsultation(
      payload,
      response => {
        // this.dismissLoader();
      },
      error => {
        // this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  handleTypePressed = (item, index) => {
    const tempArr = this.state.arrTypes.map(item => {
      return {
        ...item,
        selected: false,
      };
    });
    const tempItem = {
      ...item,
      selected: true,
    };
    tempArr.splice(index, 1, tempItem);
    this.setState({ arrTypes: tempArr, selectedType: tempItem }, () =>
      this.fetchPatientList(),
    );
  };

  render() {
    return (
      <View style={commonStyles.container}>
        {this.showInstantView()}
        {this.progressLoader()}
      </View>
    );
  }

  onToggle(status) {
    if (status) {
      this.displayErrorMsg();
    } else {
      this.fetchPatientList();
    }
  }

  renderEmptyList() {
    return (
      <View style={styles.noRecordFound}>
        <Image source={images.nodatafound} style={styles.noDataImage} resizeMode="contain" />
        <Text style={commonStyles.Regular12}>No Records Found</Text>
      </View>
      // <View style={styles.noRecordFound}>
      //   <Text style={commonStyles.Medium135}>No records found</Text>
      // </View>
    );
  }

  completeTheAppointment(item) {
    this.setState({ selectedItem: item });
    const payload = {
      appointmentId: item?._id,
      callDuration: item?.callDuration,
      app: {},
      isInstantConsultation: true,
    };
    onProviderLeaveAppointment(
      payload,
      response => {
        this.setState({ showBillingCode: true }, () => this.fetchPatientList());
      },
      error => {
        console.log(error);
      },
    );
  }

  completeInstantAptByProvider(amount, billingCode) {
    const payload = {
      app: this.state.selectedItem,
      amount: amount,
      billingCode: billingCode,
      meetingEndTime: moment().format(),
      callDuration: this.state.selectedItem?.callDuration,
    };
    completeInstantConstAppointment(
      payload,
      response => {
        this.setState({ showBillingCode: false });
      },
      error => { },
    );
  }

  showInstantView() {
    const {
      fetching,
      arrTypes,
      selectedType,
      arrRequestSent,
      arrRequestRec,
      showBillingCode,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.rowView}>
          <ButtonComponent
            style={{ width: '60%', marginHorizontal: 5 }}
            buttonStyle={{
              fontSize: getCalculated(13),
              paddingLeft: 5,
              paddingRight: 5,
            }}
            buttonTitle={'Invite patient for Instant Consultation'}
            buttonAction={() => {
              this.props.navigation.navigate('InstantInvite');
            }}
          />
          <ButtonComponent
            style={{ width: '35%', marginHorizontal: 5 }}
            buttonStyle={{
              fontSize: getCalculated(13),
              paddingLeft: 5,
              paddingRight: 5,
            }}
            buttonTitle={'Send Request'}
            buttonAction={() => {
              this.props.navigation.navigate('SendRequest');
            }}
          />
        </View>
        <TypeSelector
          arrTypes={this.state.arrTypes}
          handleTypePressed={(item, index) =>
            this.handleTypePressed(item, index)
          }
        />
        <View style={{ width: '100%' }}>
          {this.state.selectedType.id == 1 ? (
            fetching == false ? (
              arrRequestRec.length ? (
                <FlatList
                  data={arrRequestRec}
                  style={{ width: '100%', height: '100%' }}
                  contentContainerStyle={{ paddingBottom: 200 }}
                  renderItem={({ item, index }) => (
                    <RequestRecCell
                      item={item}
                      onLoading={bool => {
                        this.setState({ fetching: bool });
                      }}
                      onToggle={status => this.onToggle(status)}
                      completeAppointment={() =>
                        this.completeTheAppointment(item)
                      }
                    />
                  )}
                />
              ) : (
                this.renderEmptyList()
              )
            ) : null
          ) : null}
          {this.state.selectedType.id == 2 ? (
            !fetching ? (
              arrRequestSent.length ? (
                <FlatList
                  data={arrRequestSent}
                  style={{ width: '100%' }}
                  contentContainerStyle={{ paddingBottom: 200 }}
                  renderItem={({ item, index }) => (
                    <RequestSentCell
                      item={item}
                      completeAppointment={() =>
                        this.completeTheAppointment(item)
                      }
                    />
                  )}
                />
              ) : (
                this.renderEmptyList()
              )
            ) : null
          ) : null}
        </View>
        {showBillingCode && (
          <BillingCode
            duration={this.state.selectedItem?.callDuration}
            item={this.state.selectedItem}
            CompleteBtnAction={(amount, billingCode) => {
              this.completeInstantAptByProvider(amount, billingCode);
            }}
          />
        )}
      </View>
    );
  }
}

export default Instant;

const styles = StyleSheet.create({
  container: {
    width: '98%',
    height: '90%',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  illustration: {
    alignSelf: 'center',
    width: getCalculated(150),
    resizeMode: 'contain',
    marginTop: -20,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '98%',
    alignSelf: 'center',
  },
  todayView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  instantView: {
    // width: '77%'
  },
  stepText: {
    marginVertical: 10,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  sessionView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    width: '90%',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sessionButton: selected => ({
    height: '60%',
    marginHorizontal: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: selected ? COLORS.BLUE : 'transparent',
    justifyContent: 'center',
  }),
  sessionButtonText: selected => ({
    color: selected ? COLORS.WHITE : COLORS.BLUE,
  }),
  clinicTiming: selected => ({
    width: '30%',
    height: getCalculated(31),
    borderRadius: 6,
    justifyContent: 'center',
    margin: 5,
    backgroundColor: selected ? COLORS.BLUE : COLORS.WHITE,
    alignSelf: 'center',
    marginTop: 10,
  }),
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 7.65,

    elevation: 1,
  },
  tick: {
    position: 'absolute',
    top: -6,
    right: 5,
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  noRecordFound: {
    marginTop: height / 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});
