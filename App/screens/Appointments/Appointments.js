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
  Dimensions,
  Pressable,
  Platform,
  ActivityIndicator,
  Linking,
  RefreshControl,
  AppState,
} from 'react-native';
import { connect } from 'react-redux';
import images from '../../assets/images';
import moment from 'moment';

import { commonStyles, COLORS, getCalculated } from '../../components/Common';
import Base from '../Base/Base';
import FromToDatePicker from '../../components/FromToDatePicker';
import AppointmentFilter from '../../components/AppointmentFilter';
import { getDoctorsAppointments } from '../../networking/APIMethods';
import ImageLoader from '../../components/ImageLoader';
import { Store } from '../../../App';
import { webViewBaseurl } from '../../networking/Constats';
import { getUTCIso, getWebViewUrl } from '../../utiles/common';
import SearchBar from '../../components/SearchBar';
import AppointmentCard from '../../components/AppointmentCard';

class Appointments extends Base {
  constructor(props) {
    super(props);
    this.focusListener = null;
    this.state = {
      patientName: '',
      fromDate: null,
      toDate: null,
      isDateTimePickerVisible: false,
      fromDateClicked: false,
      filterIndexSelected: 0,
      showFilter: false,
      patientArray: [],
      fetching: true,
      limit: 30,
      offset: 0,
      filter: {
        status: 'all',
        filter: 'upcoming',
        sessionType: 'all',
        from: null,
        to: null,
        patientName: '',
        limit: 30,
        offset: 0,
      },
      arrFilters: [],
      refreshing: false,
    };
    this.patientNameFld = this.patientNameFld;
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState(
        prevState => ({
          offset: 0,
          filter: {
            ...prevState.filter,
            limit: 30,
            offset: 0,
          },
        }),
        () => this.fetchDoctorsAppointments(this.state.filter),
      );
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  fetchDoctorsAppointments = filters => {
    this.setState({ showFilter: false });
    // this.showLoader('');
    const { fromDate, toDate } = this.state;
    const selectedFilter = {
      ...filters,
      from: moment.isMoment(fromDate) ? fromDate.utc().toISOString() : fromDate,
      to: moment.isMoment(toDate) ? toDate.utc().toISOString() : toDate,
      patientName: this.state.patientName,
    };
    this.setState({ filter: selectedFilter });
    getDoctorsAppointments(
      selectedFilter,
      response => {
        // this.dismissLoader();
        if (selectedFilter.offset != 0) {
          this.setState(prevState => ({
            fetching: false,
            refreshing: false,
            patientArray: [...this.state.patientArray, ...response],
          }));
        } else {
          this.setState({
            fetching: false,
            refreshing: false,
            patientArray: response,
          });
        }
      },
      error => {
        this.setState({ fetching: false, refreshing: false });
        // this.dismissLoader();
        console.log(error);
      },
    );
  };

  filterButtonClicked() {
    this.setState({ showFilter: true });
  }

  filterActions(index) {
    this.setState({ filterIndexSelected: index });
  }

  handleOnEndReached = () => {
    this.setState(
      prevState => ({
        offset: parseInt(prevState.offset + 30),
      }),
      () => {
        const defaultFilter = {
          ...this.state.filter,
          offset: this.state.offset,
          patientName: this.state.patientName,
        };
        this.fetchDoctorsAppointments(defaultFilter);
      },
    );
  };

  handleSearchByPatientName = () => {
    const { filter, patientName } = this.state;
    const selectedFilter = filter;
    selectedFilter.offset = 0;
    selectedFilter.patientName = patientName;
    this.setState({ filter: selectedFilter }, () => {
      this.fetchDoctorsAppointments(selectedFilter);
    });
  };

  handleEndTime = () => {
    const { toDate, filter } = this.state;
    // const selectedFilter = filter;
    // selectedFilter.from = fromDate;
    const selectedFilter = {
      ...filter,
      to: toDate ? getUTCIso(toDate) : null,
    };
    this.setState({ filter: selectedFilter }, () => {
      this.fetchDoctorsAppointments(selectedFilter);
    });
  };

  handleStartTime = () => {
    const { fromDate, filter } = this.state;
    // const selectedFilter = filter;
    // selectedFilter.to = toDate;
    const selectedFilter = {
      ...filter,
      from: fromDate ? getUTCIso(fromDate) : null,
    };
    this.setState({ filter: selectedFilter }, () => {
      this.fetchDoctorsAppointments(selectedFilter);
    });
  };

  handleOnRefersh = () => {
    this.setState({ refreshing: true }, () =>
      this.fetchDoctorsAppointments(this.state.filter),
    );
  };

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100
    );
  }

  render() {
    const {
      patientName,
      fetching,
      filter,
      refreshing,
      patientArray,
      showFilter,
    } = this.state;
    const arrFilters = [
      this.capitalizeFirstLetter(filter.filter),
      this.capitalizeFirstLetter(
        filter.sessionType == 'all'
          ? 'Audio/Video'
          : filter.sessionType == 'telephonic'
            ? 'audio'
            : filter.sessionType,
      ),
    ];
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.increasedNavBar}></View>
        <SearchBar
          placeholder="Search by Patient’s Name"
          onSubmitEditing={() => this.handleSearchByPatientName()}
          style={[styles.welcomeView, commonStyles.shadow]}
          onChangeText={text => {
            this.setState({ patientName: text });
          }}
          onClearPressed={() => this.setState({ patientName: '' })}
        />
        <View style={{ marginTop: 40, width: '100%' }}>
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
            <View style={styles.filterButton(false)}>
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

        {patientArray.length ? (
          <FlatList
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ paddingBottom: 200 }}
            data={patientArray}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.BLUE}
                refreshing={refreshing}
                onRefresh={() => this.handleOnRefersh()}
              />
            }
            extraData={patientArray}
            keyExtractor={(item, index) => index.toString()}
            onScroll={({ nativeEvent }) => {
              if (
                !this.scrollToEndNotified &&
                this.isCloseToBottom(nativeEvent)
              ) {
                this.scrollToEndNotified = true;
                this.handleOnEndReached();
              }
            }}
            renderItem={({ item, index }) => {
              const user = Store.getState().user.user;
              const {
                _id,
                status,
                sessionType,
                startDate,
                patient: { _id: _pid, firstname, lastname, profileImageS3Link },
              } = item;
              const genderLetter = item?.patient?.miniSurveyForm?.gender
                ? item?.miniSurveyForm?.gender == 'male'
                  ? 'M'
                  : 'F'
                : '';
              const webviewUri = getWebViewUrl(
                `appointment-details/myapp/${_id}/`,
              );
              console.log(webviewUri);
              return (
                <AppointmentCard
                  item={item}
                  status={status}
                  profileImageS3Link={profileImageS3Link}
                  sessionType={sessionType}
                  startDate={startDate}
                  firstname={firstname}
                  lastname={lastname}
                  genderLetter={genderLetter}
                  onPress={() => {
                    this.props.navigation.navigate('webview', {
                      uri: webviewUri,
                      title: 'Appointment Details',
                    });
                  }}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              height: Dimensions.get('window').height / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {fetching ? (
              <View>
                {/* <ActivityIndicator color={COLORS.BLUE} />
                  <Text style={commonStyles.Regular12}>Loading</Text> */}
              </View>
            ) : patientArray.length == 0 ? (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image source={images.nodatafound} style={styles.noDataImage} resizeMode="contain" />
                <Text style={commonStyles.Regular12}>No Records Found</Text>
              </View>
            ) : null}
          </View>
        )}
        <AppointmentFilter
          isVisible={showFilter}
          closeFilter={() => this.setState({ showFilter: false })}
          selectedFilter={filter}
          onClearPressed={filters => {
            // this.showLoader('');
            this.fetchDoctorsAppointments(filters);
          }}
          onDonePressed={filters => {
            // this.showLoader('');
            this.fetchDoctorsAppointments(filters);
          }}
        />
        {/* {this.progressLoader()} */}
      </View>
    );
  }
}

const STATE = state => ({ user: state.user.user });
export default connect(STATE)(Appointments);

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
    paddingHorizontal: 17,
  },
  searchImage: {
    width: getCalculated(15),
    height: getCalculated(15),
    resizeMode: 'contain',
  },
  close: {
    width: getCalculated(10),
    height: getCalculated(10),
    resizeMode: 'contain',
    marginRight: getCalculated(15),
  },
  datesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    width: '80%',
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
  filterIcon: {
    width: getCalculated(24),
    height: getCalculated(24),
    resizeMode: 'contain',
  },
  patientMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  userImage: {
    width: getCalculated(57),
    height: getCalculated(57),
    resizeMode: 'contain',
    borderRadius: 6,
  },
  patientDetailsView: { marginHorizontal: 10, width: '100%' },
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

    elevation: 4,
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});
