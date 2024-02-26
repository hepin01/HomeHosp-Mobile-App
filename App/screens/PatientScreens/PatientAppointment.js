/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import images from '../../assets/images';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { commonStyles, COLORS, getCalculated } from '../../components/Common';
import Base from '../Base/Base';
import { ScrollView } from 'react-native-gesture-handler';
import FromToDatePicker from '../../components/FromToDatePicker';
import { getPatientsAppointments } from '../../networking/APIMethods';
import ImageLoader from '../../components/ImageLoader';
import { capitalize } from 'lodash';
import AppointmentFilter from '../../components/AppointmentFilter';
import { getUTCIso, getWebViewUrl } from '../../utiles/common';
import { Loader } from '../../components/Loader';
import { webview } from '../../networking/Constats';
import { RefreshControl } from 'react-native';
import SearchBar from '../../components/SearchBar';
import PatientAppointmentCard from './PatientAppointmentCard';

const defaultPayload = {
  status: 'all',
  filter: 'upcoming',
  appointmentType: '',
  sessionType: 'all',
  from: null,
  to: null,
  doctorName: '',
  limit: 100,
  offset: 0,
};

class PatientAppointments extends Base {
  constructor(props) {
    super(props);
    this.state = {
      doctorName: '',
      fromDate: null,
      toDate: null,
      isDateTimePickerVisible: false,
      fromDateClicked: false,
      filterIndexSelected: 0,
      patientArray: [],
      filter: defaultPayload,
      searchQuery: '',
      showFilter: false,
      fetching: true,
      refreshing: false,
    };
    this.patientNameFld = this.patientNameFld;
  }

  componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', () => {
      this.fetchPatientsAppointments(this.state.filter);
    });
  }

  componentWillUnmount() {
    this.focus();
  }

  dateBtnTapped = () => {
    this.setState({
      isDateTimePickerVisible: true,
    });
  };

  fetchPatientsAppointments = filters => {
    this.setState({ showFilter: false, fetching: true });
    const { fromDate, toDate } = this.state;
    const selectedFilter = {
      ...filters,
      from: moment.isMoment(fromDate) ? fromDate.utc().toISOString() : fromDate,
      to: moment.isMoment(toDate) ? toDate.utc().toISOString() : toDate,
      doctorName: this.state.searchQuery,
    };
    this.setState({ filter: selectedFilter });
    getPatientsAppointments(
      selectedFilter,
      response => {
        if (filters.offset != 0) {
          this.setState(prevState => ({
            patientArray: [...prevState.patientArray, ...response],
            fetching: false,
            refreshing: false,
          }));
        } else {
          this.setState({
            patientArray: response,
            fetching: false,
            refreshing: false,
          });
        }
      },
      error => {
        this.setState({ fetching: false, refreshing: false });
        console.log(error);
      },
    );
  };

  filterButtonClicked() {
    this.setState({ showFilter: true });
  }

  onRefresh() {
    this.setState({ refreshing: true }, () =>
      this.fetchPatientsAppointments(this.state.filter),
    );
  }

  handleEndTime = () => {
    const { toDate, filter } = this.state;
    const selectedFilter = {
      ...filter,
      limit: 100,
      offset: 0,
      to: toDate ? getUTCIso(toDate) : null,
    };
    this.setState({ filter: selectedFilter }, () => {
      this.fetchPatientsAppointments(selectedFilter);
    });
  };

  handleStartTime = () => {
    const { fromDate, filter } = this.state;
    const selectedFilter = {
      ...filter,
      limit: 100,
      offset: 0,
      from: fromDate ? getUTCIso(fromDate) : null,
    };
    this.setState({ filter: selectedFilter, patientArray: [] }, () => {
      this.fetchPatientsAppointments(selectedFilter);
    });
  };

  filterActions(index) {
    this.setState({ filterIndexSelected: index });
  }
  render() {
    const {
      searchQuery,
      filterIndexSelected,
      patientArray,
      filter,
      showFilter,
      fetching,
      refreshing,
    } = this.state;
    const arrFilters = [
      capitalize(filter.filter),
      filter.sessionType == 'all'
        ? 'Audio/Video'
        : filter.sessionType == 'telephonic'
          ? 'Audio'
          : capitalize(filter.sessionType),
    ];
    return (
      <View style={commonStyles.container}>
        <Loader modalVisible={fetching} />
        <View style={commonStyles.increasedNavBar}></View>
        <SearchBar
          placeholder="Search by Doctor name"
          onSubmitEditing={() =>
            this.fetchPatientsAppointments({
              ...this.state.filter,
              limit: 100,
              offset: 0,
            })
          }
          textInputProps={{ value: searchQuery }}
          style={[styles.welcomeView, commonStyles.shadow]}
          onChangeText={text => this.setState({ searchQuery: text })}
          onClearPressed={() =>
            this.setState({
              searchQuery: '',
            })
          }
        />
        <View style={[styles.datesView]}>
          <FromToDatePicker
            onStartDateSelection={date =>
              this.setState({ fromDate: date }, () => this.handleStartTime())
            }
            onEndDateSelection={date =>
              this.setState({ toDate: date }, () => this.handleEndTime())
            }
          />
        </View>
        <View style={styles.filterView}>
          {arrFilters.map((item, index) => (
            <View key={index.toString()} style={styles.filterButton(false)}>
              <Text
                style={[
                  commonStyles.Medium11White,
                  styles.sessionButtonText(false),
                ]}>
                {item}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => {
              this.filterButtonClicked();
            }}
            style={{ justifyContent: 'flex-end' }}>
            <Image style={styles.filterIcon} source={images.filter} />
          </TouchableOpacity>
        </View>
        {/* <Pressable
          style={styles.clearFilter}
          onPress={() =>
            this.setState(
              {
                fromDate: null,
                toDate: null,
                searchQuery: '',
                filter: defaultPayload,
                patientArray: [],
              },
              () => this.fetchPatientsAppointments(this.state.filter),
            )
          }>
          <Text style={commonStyles.Regular12Blue}>Clear Filters</Text>
        </Pressable> */}

        {patientArray.length ? (
          <FlatList
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{}}
            data={patientArray}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.BLUE}
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            keyExtractor={(item, index) =>
              `item-${item.appointmentId || index}`
            }
            renderItem={({ item, index }) => {
              const {
                _id,
                status,
                sessionType,
                appointmentType,
                startDate,
                doctor: {
                  _id: dId,
                  firstname,
                  lastname,
                  profileImageS3Link,
                  providerInformation: { city },
                },
              } = item;
              const webviewUrl = getWebViewUrl(`appointment-details/${_id}/`);
              return (
                <PatientAppointmentCard
                  item={item}
                  status={status}
                  profileImageS3Link={profileImageS3Link}
                  sessionType={sessionType}
                  startDate={startDate}
                  firstname={firstname}
                  lastname={lastname}
                  city={city}
                  appointmentType={capitalize(appointmentType)}
                  onPress={() => {
                    this.props.navigation.navigate('webview', {
                      uri: webviewUrl,
                      title: 'Appointment Details',
                    });
                  }} />
                // <Pressable
                //   style={{width: '100%', alignSelf: 'center'}}
                //   onPress={() => {
                //     // if (Platform.OS == 'ios') {
                //     this.props.navigation.navigate('webview', {
                //       uri: webviewUrl,
                //       title: 'Appointment Details',
                //     });
                //     // } else {
                //     //   Linking.openURL(webviewUrl);
                //     // }
                //   }}>
                //   <View
                //     style={[
                //       styles.shadow,
                //       commonStyles.shadowCard,
                //       {alignSelf: 'center', marginVertical: 7},
                //     ]}>
                //     <View style={styles.patientMainView}>
                //       <ImageLoader
                //         style={styles.userImage}
                //         url={{uri: profileImageS3Link}}
                //         placeholder={images.userdefault}
                //       />
                //       <View style={styles.patientDetailsView}>
                //         <Text>
                //           <Text style={[commonStyles.Medium18]}>
                //             Dr. {firstname + ' ' + lastname}
                //           </Text>
                //         </Text>

                //         <View
                //           style={{
                //             flexDirection: 'row',
                //             marginTop: 2,
                //             width: '100%',
                //           }}>
                //           <Image
                //             style={styles.locationIcon}
                //             source={images.locationBig}
                //           />
                //           <Text
                //             style={[
                //               commonStyles.RegularLight11,
                //               {marginLeft: 5},
                //             ]}>
                //             {city}
                //           </Text>
                //           {sessionType == 'telephonic' && (
                //             <Image
                //               style={styles.callgrey}
                //               source={images.callgrey}
                //             />
                //           )}
                //           {sessionType == 'video' && (
                //             <Image
                //               style={styles.callgrey}
                //               source={images.video}
                //             />
                //           )}
                //         </View>

                //         <Text style={{marginTop: 4}}>
                //           <Text style={[commonStyles.BoldLight11]}>
                //             {moment(startDate).format('hh:mm A') + ',\n'}
                //           </Text>
                //           <Text style={[commonStyles.RegularLight11]}>
                //             {moment(startDate).format('dddd, MMMM DD, YYYY')}
                //           </Text>
                //         </Text>

                //         <View style={{flexDirection: 'row', marginTop: 4}}>
                //           <View
                //             style={{alignSelf: 'center', flexDirection: 'row'}}>
                //             <Image
                //               style={styles.locationIcon}
                //               source={images.greycalender}
                //             />
                //             <Text
                //               style={[
                //                 commonStyles.RegularLight11,
                //                 {marginLeft: 5, alignSelf: 'center'},
                //               ]}>
                //               {capitalize(appointmentType)}
                //             </Text>
                //           </View>
                //           <Text style={{marginTop: 2, marginLeft: 10}}>
                //             <Text
                //               style={[
                //                 commonStyles.RegularLight11,
                //                 {
                //                   color:
                //                     status == 0
                //                       ? COLORS.PURPLE
                //                       : status == 1
                //                       ? COLORS.Orange
                //                       : status == 2 || status == 4
                //                       ? COLORS.GREEN
                //                       : status == 3
                //                       ? COLORS.RED
                //                       : COLORS.LIGHTER_GREY,
                //                   // status == 3 ? COLORS.RED : COLORS.LIGHTER_GREY,
                //                 },
                //               ]}>
                //               {status == 0 ? 'Upcoming' : null}
                //               {status == 1 ? 'Pending' : null}
                //               {status == 2 ? 'Accepted' : null}
                //               {status == 3 ? 'Cancelled' : null}
                //               {status == 4 ? 'Completed' : null}
                //               {status == 5 ? 'Paid/Unpaid' : null}
                //               {status == 6 ? 'No show' : null}
                //             </Text>
                //             {item?.instant && (
                //               <Image
                //                 style={styles.instantIcon}
                //                 source={images.instanticon}
                //               />
                //             )}
                //           </Text>
                //         </View>
                //       </View>
                //     </View>
                //   </View>
                // </Pressable>
              );
            }}
          />
        ) : (
          <View style={styles.ListEmptyComponent}>
            <Image source={images.patientnodatafound} style={styles.noDataImage} resizeMode="contain" />
            <Text style={commonStyles.Regular12}>No Records Found</Text>
          </View>
        )}
        <AppointmentFilter
          isVisible={showFilter}
          closeFilter={() => this.setState({ showFilter: false })}
          selectedFilter={this.state.filter}
          onClearPressed={filters => {
            this.fetchPatientsAppointments(filters);
          }}
          onDonePressed={filters => {
            this.setState({ patientArray: [] }, () => {
              this.fetchPatientsAppointments(filters);
            });
          }}
        />
      </View>
    );
  }
}

const STATE = state => ({ user: state.user.user });
export default connect(STATE)(PatientAppointments);

const styles = StyleSheet.create({
  welcomeView: {
    width: '90%',
    height: getCalculated(45),
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    borderRadius: 6,
    top: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchImage: { width: 15, height: 15, resizeMode: 'contain' },
  datesView: {
    marginTop: 40,
    width: '100%',
  },
  dateMainView: { width: '45%' },
  dateView: {
    flexDirection: 'row',
    width: 'auto',
    height: getCalculated(30),
    backgroundColor: COLORS.LIGHT_BLUE,
    borderColor: COLORS.BLUE,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 7,
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  dateText: { marginLeft: 10 },
  calanderIcon: { width: 15, height: 15, resizeMode: 'contain' },
  filterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    width: '90%',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  filterButton: selected => ({
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
  filterIcon: { width: 24, height: 24, resizeMode: 'contain' },
  patientMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  userImage: { width: 57, height: 57, resizeMode: 'contain', borderRadius: 6 },
  patientDetailsView: { marginHorizontal: 10, width: '80%' },
  instantIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -2,
    marginLeft: 10,
  },
  audioIcon: { width: 15, height: 15, resizeMode: 'contain' },
  audioIconBg: {
    padding: 10,
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: COLORS.LIGHTER_GREY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7.65,

    elevation: 5,
  },
  locationIcon: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  callgrey: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 5,
    right: 0,
    top: 5,
  },
  clearFilter: {
    alignSelf: 'flex-end',
    paddingRight: getCalculated(17),
    marginVertical: getCalculated(13),
  },
  ListEmptyComponent: {
    width: '100%',
    height: Dimensions.get('screen').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});
