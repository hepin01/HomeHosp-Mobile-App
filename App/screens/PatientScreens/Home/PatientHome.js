/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { commonStyles, getCalculated, COLORS } from '../../../components/Common';
import images from '../../../assets/images';
import { SmallButton } from '../../../components/SmallButton';
import { connect } from 'react-redux';
import ImageLoader from '../../../components/ImageLoader';
import {
  addFirebaseTokenToUser,
  getUserProfile,
  getUserStripePayments,
  listDoctors,
  toggleProviderPrefference,
} from '../../../networking/APIMethods';
import { displayErrorMsg, userId } from '../../../utiles/common';
import moment from 'moment';
import { RefreshControl } from 'react-native';
import SearchBar from '../../../components/SearchBar';
import Base from '../../Base/Base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PaymentPendingAlert from '../../../components/PaymentPendingAlert';

const defaultPayload = {
  search: '',
  insurance: null,
  language: null,
  providerType: null,
  providerSubType: null,
  gender: null,
  affiliation: null,
  limit: 100,
  page: 1,
  isOnline: null,
  isNew: null,
};
class PatientHome extends Base {
  constructor(props) {
    super(props);
    this.state = {
      fetch: false,
      searchQuery: '',
      arrProviders: [],
      numOfResults: 0,
      filterEnable: false,
      payload: defaultPayload,
      refreshing: false,
      showNotice: false,
      moreThenThree: false,
    };
  }

  componentDidMount() {
    this.fetchStripePayments(() => {
      addFirebaseTokenToUser(
        this.props.deviceToken,
        response => { },
        err => console.log(err),
      );
    });

    this.setFocusListener();
  }

  componentWillUnmount() {
    this.removeFocusListener();
  }

  setFocusListener() {
    this.focus = this.props.navigation.addListener('focus', () => {
      console.log('focus');
      this.fetchUserInfo();
    });
  }

  removeFocusListener() {
    if (this.focus) this.focus();
  }
  fetchStripePayments(completion) {
    // this.showLoader();
    getUserStripePayments(
      ({ data }) => {
        // this.dismissLoader();
        if (data.length !== 0) {
          this.setState(
            {
              showNotice: true,
              moreThenThree: data.length == 3,
            },
            () => {
              completion && completion();
            },
          );
        }
      },
      e => {
        console.log(e);
        // this.dismissLoader();
        completion && completion();
      },
    );
  }

  fetchUserInfo() {
    if (!!this.focus) {
      this.setFocusListener();
    } else {
      console.log('already focused');
    }
    // this.showLoader();
    getUserProfile(
      response => {
        // this.dismissLoader();
        const {
          user: {
            miniSurveyForm: { selectspecialist, selectvendor, viewadds },
          },
        } = response;
        const payload = this.state.filterEnable
          ? this.state.payload
          : {
            ...defaultPayload,
            providerType: selectspecialist || [],
          };
        this.setState({ payload: payload }, () => {
          this.fetchDocList();
        });
      },
      error => {
        displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  }

  fetchDocList = (didMount = false) => {
    const { payload } = this.state;
    // this.showLoader();
    listDoctors(
      payload,
      response => {
        // this.dismissLoader();
        const { doctors, numOfResults } = response;
        this.setState({ numOfResults: numOfResults });
        if (doctors.length) {
          if (payload.page !== 1) {
            this.setState(prevState => ({
              arrProviders: [...prevState.arrProviders, ...doctors],
              refreshing: false,
            }));
          } else {
            this.setState({
              arrProviders: [...doctors],
              refreshing: false,
            });
          }
        } else {
          // displayErrorMsg(
          //   'No providers found. Try changing your search filters.',
          // );
          // this.setState({payload: defaultPayload, refreshing: false}, () =>
          //   this.fetchDocList(),
          // );
          this.setState({
            arrProviders: doctors,
            refreshing: false,
          });
        }
      },
      error => {
        console.log(error);
        // this.dismissLoader();
        this.setState({ refreshing: false });
        displayErrorMsg(error);
      },
    );
  };

  togglePreferedDoctor = (providerId, preferred) => {
    // this.showLoader();
    const payload = {
      userId: userId(),
      providerId: providerId,
      preferred: preferred,
    };
    toggleProviderPrefference(
      payload,
      response => {
        // this.dismissLoader();
        this.setState(
          prevState => ({
            payload: {
              ...prevState.payload,
              page: parseInt(prevState.payload.page),
            },
          }),
          () => this.fetchDocList(),
        );
      },
      error => {
        this.setState({ refreshing: false });
        displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  };

  okayClicked() {
    const { payload, searchQuery } = this.state;
    const temp = {
      ...payload,
      search: searchQuery.trim(),
    };
    this.setState({ payload: temp }, () => this.fetchDocList());
  }

  handleOnEndReached = () => {
    const { numOfResults, arrProviders } = this.state;
    if (numOfResults !== arrProviders.length) {
      this.setState(
        prevState => ({
          payload: {
            ...prevState.payload,
            page: parseInt(prevState.payload.page + 1),
          },
        }),
        () => this.fetchDocList(),
      );
    }
  };

  handleFilterPressed = () => {
    console.log('removeing focus listner');
    this.removeFocusListener();
    this.props.navigation.navigate('HomeFilter', {
      currentPayload: this.state.payload,
      filerList: (payload, filterEnable) =>
        this.setState({ payload: payload, filterEnable: filterEnable }, () =>
          this.fetchDocList(),
        ),
    });
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => this.fetchDocList());
  };

  renderDoctor = ({ item, index }) => {
    const {
      _id,
      firstname,
      lastname,
      profileImageS3Link,
      providerType,
      providerSubType,
      onlineEnabled,
      insuranceEnabled,
      preferredByPatients,
    } = item;
    const genderLetter =
      item?.providerInformation?.gender == 'male' ? 'M' : 'F';
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('DoctorInfo', {
            doctorDetails: item,
            viewOnly: true,
          });
        }}
        style={styles.eRequestContainer}>
        <View style={styles.eReqSubContainer}>
          <View style={{}}>
            <ImageLoader
              style={styles.imgProfile}
              url={{ uri: profileImageS3Link }}
              placeholder={images.userdefault}
            />

          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              borderColor: preferredByPatients.includes(userId()) ? COLORS.BLUE : COLORS.LIGHTER_GREY,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 15,
              height: getCalculated(25),
              paddingHorizontal: 10
            }}
            onPress={() =>
              this.togglePreferedDoctor(
                _id,
                !preferredByPatients.includes(userId()),
              )
            }>
            {preferredByPatients.includes(userId()) ? (
              <Image
                resizeMethod="resize"
                resizeMode="cover"
                style={styles.imgStar}
                source={images.staractiveicon}
              />
            ) : (
              <Image
                resizeMethod="resize"
                resizeMode="cover"
                style={styles.imgStar}
                source={images.stardeactiveicon}
              />
            )}
            <Text style={commonStyles.RegularGrey11}>Preferred Doctor</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 3,
            paddingVertical: getCalculated(10),
            paddingHorizontal: getCalculated(15),
            // marginLeft:
            //   Platform.OS == 'ios' ? getCalculated(15) : getCalculated(20),
            //   alignItems: 'center',
          }}>
          <Text style={commonStyles.Bold18}>
            {'Dr. ' + firstname + ' ' + lastname + ' '}
            <Text style={commonStyles.Regular10Blue}>
              {genderLetter +
                (item?.providerInformation?.dob
                  ? '(' +
                  moment().diff(item?.providerInformation?.dob, 'years') +
                  ')'
                  : '')}
            </Text>
          </Text>
          <View style={{ marginTop: 5 }}>
            <Text
              style={commonStyles.Regular10Blue}>{`${providerType}`}</Text>
          </View>
        </View>
        <View style={[styles.cardBody, {}]}>
          {item?.providerInformation?.city ? (
            <View style={{ flexDirection: 'row', width: "100%" }}>
              <Image style={styles.imgMap} source={images.map} />
              <Text numberOfLines={2} style={commonStyles.RegularGrey11}>
                {`${item?.providerInformation?.city},${item?.providerInformation?.state}`}
              </Text>
            </View>
          ) : null}

        </View>
        <View style={[styles.cardBody, {}]}>
          {item?.agencyName ? (
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Image style={styles.imgMap} source={images.buildingicon} />
              <Text style={[commonStyles.RegularGrey11, { width: '90%' }]}>
                {`${item?.agencyName}`}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.cardBody, {
          backgroundColor: COLORS.BLURBG,
          paddingVertical: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        }]}>
          {onlineEnabled ? (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
              <Image
                resizeMethod="resize"
                resizeMode="cover"
                style={styles.imgCard}
                source={images.cardicon}
              />
              <Text
                style={{
                  ...commonStyles.Regular115Blue,
                  maxWidth: Platform.OS == 'ios' ? '100%' : '70%',
                }}>
                Online
                {insuranceEnabled ? (
                  <Text style={{ ...commonStyles.Regular115Blue }}>
                    /Insurance
                  </Text>
                ) : null}
              </Text>
            </View>
          ) : insuranceEnabled ? (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
              <Image
                resizeMethod="resize"
                resizeMode="cover"
                style={styles.imgCard}
                source={images.cardicon}
              />
              <Text style={commonStyles.RegularGrey11}>Insurance</Text>
            </View>
          ) : null}


        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { user } = this.props;
    const {
      fetch,
      numOfResults,
      arrProviders,
      filterEnable,
      refreshing,
      showNotice,
      moreThenThree,
    } = this.state;

    return (
      <View style={styles.container}>
        {this.progressLoader()}
        <PaymentPendingAlert
          visible={showNotice}
          setShowModal={bool => this.setState({ showNotice: bool })}
          moreThanThree={moreThenThree}
        />
        <View style={commonStyles.increasedNavBar} />
        <SearchBar
          placeholder="Search provider by location"
          onSubmitEditing={() => this.okayClicked()}
          style={[styles.welcomeView, commonStyles.shadow]}
          onChangeText={text => this.setState({ searchQuery: text })}
          onClearPressed={() =>
            this.setState({
              searchQuery: '',
              payload: defaultPayload,
            })
          }
        />
        {/* </View> */}
        <View style={styles.contentContainerStyle}>
          <Text style={[commonStyles.Regular18, { width: '90%' }]}>
            {'Welcome, '}
            <Text style={commonStyles.Bold18}>
              {user.firstname + ' ' + user.lastname}
            </Text>
          </Text>
          <View style={{ marginBottom: getCalculated(11) }}>
            <Text style={commonStyles.Regular12}>
              We're super excited to have you on board
            </Text>
          </View>
          <View style={styles.listheader}>
            <View style={{ marginVertical: getCalculated(11) }}>
              <Text style={commonStyles.Regular12}>
                {numOfResults} Records Found
              </Text>
            </View>
            <Pressable onPress={() => this.handleFilterPressed()}>
              {filterEnable ? (
                <Image
                  resizeMethod="resize"
                  resizeMode="contain"
                  style={styles.filterEnable}
                  source={images.filterwithcirle}
                />
              ) : (
                <Image
                  resizeMethod="resize"
                  resizeMode="contain"
                  style={styles.filterDisable}
                  source={images.filtericon}
                />
              )}
            </Pressable>
          </View>
          {arrProviders.length ? (
            <FlatList
              data={arrProviders}
              extraData={arrProviders}
              refreshing={refreshing}
              refreshControl={
                <RefreshControl
                  tintColor={COLORS.BLUE}
                  refreshing={refreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }
              showsVerticalScrollIndicator={false}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 200 }}
              onEndReachedThreshold={0.5}
              onEndReached={({ distanceFromEnd }) => {
                if (distanceFromEnd >= 0) {
                  this.handleOnEndReached();
                }
              }}
              keyExtractor={item => item._id}
              renderItem={this.renderDoctor}
            />
          ) : (
            <View style={styles.ListEmptyComponent}>
              <Image source={images.patientnodatafound} style={styles.noDataImage} resizeMode="contain" />
              <Text style={commonStyles.Regular12}>No Records Found</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
  showDayOne() {
    return (
      <View style={styles.dayOnewView}>
        <Image style={styles.illustration} source={images.illustration}></Image>
        <Text style={[commonStyles.Regular135, styles.stepInsideText]}>
          {
            'We will be fetching providers as per your set preferences during sign up. Then you can go ahead & edit the search criteria through Filter.'
          }
        </Text>
        <SmallButton
          style={styles.stepInsideButton}
          buttonTitle={'Okay'}
          buttonAction={() => {
            this.okayClicked();
          }}
        />
      </View>
    );
  }
}

const STATE = state => ({
  user: state.user.user,
  deviceToken: state.user.deviceToken,
});
export default connect(STATE)(PatientHome);

const styles = StyleSheet.create({
  container: { ...commonStyles.container },
  welcomeView: {
    width: '90%',
    height: getCalculated(55),
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    borderRadius: 6,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getCalculated(20),
  },
  userImage: {
    width: getCalculated(41),
    height: getCalculated(41),
    borderRadius: 7,
    resizeMode: 'cover',
  },
  illustration: {
    alignSelf: 'center',
    width: getCalculated(200),
    resizeMode: 'contain',
  },
  dayOnewView: {
    width: '90%',
  },
  stepInsideText: {
    alignSelf: 'center',
    margin: 20,
    textAlign: 'center',
  },
  stepInsideButton: {
    width: 'auto',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  searchImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  contentContainerStyle: {
    marginTop: 40,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: getCalculated(17),
  },
  eRequestContainer: {
    width: '99%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    marginVertical: getCalculated(10),
    // paddingVertical: getCalculated(18),
    // paddingHorizontal: getCalculated(15),
    ...commonStyles.shadow,
  },
  eReqSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: getCalculated(15),
    marginTop: getCalculated(15)
    // backgroundColor: "red"
    // alignItems: 'center',
    // padding: 30,
  },
  imgProfile: {
    width: getCalculated(50),
    height: getCalculated(50),
    borderRadius: getCalculated(60),
    alignSelf: 'center',
  },
  cardBody: {
    paddingVertical: getCalculated(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getCalculated(15),
  },
  imgMap: {
    height: getCalculated(16),
    width: getCalculated(12),
    marginRight: getCalculated(12),
  },
  imgCard: {
    height: getCalculated(14),
    width: getCalculated(20),
    marginRight: getCalculated(6),
    tintColor: COLORS.BLUE
  },
  seperator: {
    height: 2,
    backgroundColor: '#ebf4f8',
  },
  bottom: {
    paddingTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imgClock: {
    width: getCalculated(15),
    height: getCalculated(15),
    marginHorizontal: getCalculated(10),
  },
  listheader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  filterDisable: {
    width: getCalculated(17),
    height: getCalculated(17),
  },
  filterEnable: {
    width: getCalculated(39),
    height: getCalculated(39),
  },
  imgStar: {
    height: getCalculated(15),
    width: getCalculated(16),
    marginRight: getCalculated(5),
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
