/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import Base from '../../../Base/Base';
import {
  commonStyles,
  COLORS,
  getCalculated,
} from '../../../../components/Common';
import {TouchableOpacity} from 'react-native-gesture-handler';
import images from '../../../../assets/images';
import PreferencesCell from '../../Preferences/PreferencesCell';
import {getUserProfile, listDoctors} from '../../../../networking/APIMethods';
import {Store} from '../../../../../App';
import {
  UPDATE_FILTER_PAYLOAD,
  UPDATE_PROVIDER,
} from '../../../../redux/BookAppointmentReducer';
import {connect} from 'react-redux';
import {displayErrorMsg, userId} from '../../../../utiles/common';
import {Loader} from '../../../../components/Loader';

const defaultPayload = {
  search: '',
  insurance: null,
  language: null,
  providerType: null,
  providerSubType: null,
  gender: null,
  affiliation: null,
  limit: 10,
  page: 1,
  isAudio: false,
  isOnline: true,
  isNew: false,
  allNotNull: true,
  // idNotEqualTo: userId(),
};

// {
//   "search": "",
//   "insurance": null,
//   "language": null,
//   "providerType": null,
//   "providerSubType": null,
//   "gender": null,
//   "affiliation": null,
//   "limit": 10,
//   "page": 1,
//   "isOnline": true,
//   "isNew": false,
//   "allNotNull": true,
//   "isAudio": false
// }

class StepFourFindProvider extends Base {
  constructor(props) {
    super(props);
    this.state = {
      selectSpecialist: [],
      filter: defaultPayload,
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    // this.showLoader('');
    const payload = {
      query: {_id: userId()},
      select: {miniSurveyForm: 1},
    };
    getUserProfile(
      // payload,
      response => {
        const {
          user: {
            miniSurveyForm,
            miniSurveyForm: {selectspecialist},
          },
        } = response;
        // this.dismissLoader();
        this.setState(
          {
            selectSpecialist: selectspecialist || [],
          },
          () => {
            const payload = {
              ...defaultPayload,
              providerType: selectspecialist ? [selectspecialist] : null,
              isAudio: this.props.modeTypeAudio,
              isNew: this.props.appointmentTypeNew,
            };
            this.setState({filter: payload}, () => {
              this.fetchDocList(payload);
            });
          },
        );
      },
      error => {
        this.displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  }

  setArrDocs(arr) {
    Store.dispatch({
      type: UPDATE_PROVIDER,
      payload: arr,
    });
  }

  setPayload(obj) {
    Store.dispatch({
      type: UPDATE_FILTER_PAYLOAD,
      payload: obj,
    });
  }

  fetchDocList = payload => {
    // this.showLoader('');
    const {arrDocs} = this.props;
    console.log(payload);
    let apiPayload = {...payload}
    if (!!payload.providerType) apiPayload = {...payload, providerType: [payload.providerType]}
    listDoctors(
      apiPayload,
      response => {
        // this.dismissLoader();
        const {doctors} = response;
        if (doctors.length) {
          if (payload.page !== 1) {
            this.setArrDocs([...arrDocs, ...doctors]);
          } else {
            this.setArrDocs(doctors);
          }
        } else {
          // displayErrorMsg(
          //   'No providers found. Try changing your search filters.',
          // );
          this.fetchDocList(defaultPayload);
        }
      },
      error => {
        // this.dismissLoader();
        displayErrorMsg(error);
      },
    );
  };

  checkAvailability(item, index) {
    this.props.navigation.navigate('DoctorInfo', {
      doctorDetails: item,
    });
  }

  render() {
    const {arrDocs} = this.props;

    return (
      <View style={styles.container}>
        {this.progressLoader()}
        <View style={styles.rowView}>
          <Text style={styles.textHeader}>Find Providers</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('DoctorsListFilter', {
                currentPayload: this.state.filter,
                fromBookAppointment: true,
                filerList: payload => {
                  this.setState(
                    {
                      filter: {
                        ...payload,
                        allNotNull: true,
                      },
                    },
                    () => {
                      this.setPayload(payload);
                      this.fetchDocList(payload);
                    },
                  );
                },
              });
            }}>
            <Image style={styles.filterIcon} source={images.filterwithcirle} />
          </TouchableOpacity>
        </View>
        {arrDocs.length ? (
          <FlatList
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{width: '100%'}}
            data={arrDocs}
            keyExtractor={item => item._id.toString()}
            renderItem={({item, index}) => {
              return (
                <View style={[styles.docCellView, styles.shadow]} key={index}>
                  <PreferencesCell
                    data={item}
                    onPressCell={() => {}}
                    onCheck={() => {
                      this.checkAvailability(item, index);
                    }}
                  />
                </View>
              );
            }}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = ({bookedAppointment}) => ({
  arrDocs: bookedAppointment.provider,
  payload: bookedAppointment.providerFilter,
  modeTypeAudio: bookedAppointment.modeTypeAudio,
  appointmentTypeNew: bookedAppointment.appointmentTypeNew,
});

export default connect(mapStateToProps)(StepFourFindProvider);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    width: '100%',
  },
  textHeader: {
    ...commonStyles.Bold15,
  },
  rowView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    marginBottom: 10,
  },
  filterIcon: {
    resizeMode: 'contain',
    width: getCalculated(34),
  },
  docCellView: {
    width: '98%',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 7,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.65,
    elevation: 5,
  },
});
