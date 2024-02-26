import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import {Loader} from '../../components/Loader';
import {displayErrorMsg, userId} from '../../utiles/common';
import {listDoctors} from '../../networking/APIMethods';
import ImageLoader from '../../components/ImageLoader';
import images from '../../assets/images';
import moment from 'moment';
import {RefreshControl} from 'react-native';

const DoctorsList = ({navigation: {navigate}, route: {params}}) => {
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
    isOnline: null,
    isNew: null,
    idNotEqualTo: userId(),
  };
  const [arrDocs, setArrDocs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [payload, setPayload] = useState(defaultPayload);
  const [filterEnable, setFilterEnable] = useState(false);

  useEffect(() => {
    fetchDocList();
  }, [payload]);

  const fetchDocList = () => {
    setFetching(true);
    listDoctors(
      payload,
      response => {
        setFetching(false);
        setRefreshing(false);
        const {doctors} = response;
        if (doctors.length) {
          if (payload.page !== 1) {
            setArrDocs([...arrDocs, ...doctors]);
          } else {
            setArrDocs(doctors);
          }
        }
      },
      error => {
        setFetching(false);
        setRefreshing(false);
        displayErrorMsg(error);
      },
    );
  };

  const handleFilterPressed = () => {
    setFilterEnable(!filterEnable);
    navigate('DoctorsListFilter', {
      currentPayload: payload,
      filerList: payload => setPayload(payload),
    });
  };

  const handleOnEndReached = () => {
    console.log('onEndreach');
    setPayload({
      ...payload,
      page: payload.page + 1,
    });
  };
  const handleOnRefresh = () => {
    setFetching(true);
    setRefreshing(true);
    fetchDocList();
  };

  const renderDoctor = ({item, index}) => {
    const {
      _id,
      firstname,
      lastname,
      profileImageS3Link,
      providerType,
      providerSubType,
    } = item;
    const genderLetter = item?.providerInformation?.gender
      ? item?.miniSurveyForm?.gender == 'male'
        ? 'M'
        : 'F'
      : '';
    return (
      <View style={styles.eRequestContainer}>
        <View style={styles.eReqSubContainer}>
          <View style={{flex: 1}}>
            <ImageLoader
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.imgProfile}
              url={{uri: profileImageS3Link}}
              placeholder={images.userdefault}
            />
          </View>
          <View
            style={{
              flex: 3,
              marginLeft:
                Platform.OS == 'ios' ? getCalculated(15) : getCalculated(20),
              //   alignItems: 'center',
            }}>
            <Text style={commonStyles.Bold18}>
              {firstname + ' ' + lastname + ' '}
              <Text style={commonStyles.Regular115Blue}>
                {genderLetter +
                  (item?.providerInformation?.dob
                    ? '(' +
                      moment().diff(item?.providerInformation?.dob, 'years') +
                      ')'
                    : '')}
              </Text>
            </Text>
            <Text
              style={
                commonStyles.Regular115Blue
              }>{`${providerType},\n${providerSubType}`}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          {item?.providerInformation?.city ? (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Image style={styles.imgMap} source={images.map} />
              <Text style={commonStyles.RegularGrey11}>
                {`${item?.providerInformation?.city},\n${item?.providerInformation?.state}`}
              </Text>
            </View>
          ) : null}
          {item?.agencyName ? (
            <View style={{flexDirection: 'row', flex: 1}}>
              <Image style={styles.imgMap} source={images.buildingicon} />
              <Text style={commonStyles.RegularGrey11}>
                {`${item?.agencyName}`}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.seperator} />
        <Pressable
          style={styles.bottom}
          onPress={() =>
            navigate('SessionSlots', {appId: params.appId, doctorId: _id})
          }>
          <Image
            resizeMethod="resize"
            resizeMode="contain"
            style={styles.imgClock}
            source={images.clock2}
          />
          <Text style={commonStyles.MediumBlue135}>Check Availability</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {fetching && <Loader />}
      <View style={styles.noteContianer}>
        <Text style={commonStyles.Regular135}>
          <Text style={commonStyles.Bold135}>Note: </Text>
          Payment of the E-consulation must be carried out Offline*
        </Text>
      </View>
      <FlatList
        data={arrDocs}
        extraData={arrDocs}
        style={{paddingBottom: 200}}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        onEndReached={({distanceFromEnd}) => {
          if (distanceFromEnd >= 0) {
            handleOnEndReached();
          }
        }}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.BLUE}
            refreshing={refreshing}
            onRefresh={() => handleOnRefresh()}
          />
        }
        ListHeaderComponent={() => (
          <View style={styles.listheader}>
            <Text style={commonStyles.RegularDark11}>
              {arrDocs.length + ' Records Found'}
            </Text>
            <Pressable onPress={() => handleFilterPressed()}>
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
        )}
        keyExtractor={item => item._id}
        renderItem={renderDoctor}
      />
    </View>
  );
};

export default DoctorsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCalculated(17),
    backgroundColor: COLORS.WHITE,
  },
  noteContianer: {
    flexDirection: 'row',
    marginBottom: getCalculated(15),
  },
  eRequestContainer: {
    width: '99%',
    alignSelf: 'center',
    borderRadius: 10.3,
    backgroundColor: COLORS.WHITE,
    ...commonStyles.shadow,
    marginVertical: getCalculated(10),
    paddingVertical: getCalculated(18),
    paddingHorizontal: getCalculated(15),
  },
  eReqSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 30,
  },
  imgProfile: {
    width: getCalculated(66),
    height: getCalculated(66),
    borderRadius: getCalculated(5),
    marginRight: getCalculated(30),
  },
  cardBody: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgMap: {
    height: getCalculated(16),
    width: getCalculated(12),
    marginRight: getCalculated(12),
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
});
