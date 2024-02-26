import {capitalize} from 'lodash';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import images from '../../assets/images';
import {getCalculated, commonStyles, COLORS} from '../../components/Common';
import ImageLoader from '../../components/ImageLoader';
import {Loader} from '../../components/Loader';
import {getProviderDetailForDelegateUser} from '../../networking/APIMethods';
import {webview} from '../../networking/Constats';
import {getWebViewUrl, userId} from '../../utiles/common';

const DelegateAccess = ({navigation: {navigate}}) => {
  const [fetch, setFetch] = useState(true);
  const [arrUsers, setArrUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getDelegateAccess();
  }, []);
  function getDelegateAccess() {
    if (!fetch) {
      setFetch(true);
    }
    getProviderDetailForDelegateUser(
      {userId: userId()},
      response => {
        setFetch(false);
        setRefreshing(false);
        setArrUsers(response);
      },
      error => {
        setFetch(false);
        setRefreshing(false);
        displayErrorMsg(error);
      },
    );
  }

  function renderItem({item, index}) {
    const {
      startDate,
      patient: {email, lastname, firstname, contactnumber, profileImageS3Link},
    } = item;
    const url = getWebViewUrl('delegate-details/' + item._id + '/');

    return (
      <Pressable
        onPress={() => {
          navigate(webview, {
            uri: url,
            title: 'Appointment Details',
          });
        }}
        style={[styles.userContainer, styles.shadow]}>
        <ImageLoader
          style={styles.userImage}
          url={{uri: profileImageS3Link}}
          placeholder={images.userdefault}
        />
        <View>
          <Text
            style={[
              commonStyles.Regular18,
              styles.customWidth,
            ]}>
            {firstname + ' ' + lastname}
          </Text>
          <View style={styles.detailContainer}>
            <Image style={styles.imgEmail} source={images.email} />
            <Text
              numberOfLines={2}
              style={[
                commonStyles.RegularGrey11,
                styles.customWidth,
              ]}>
              {email}
            </Text>
          </View>
          <View style={styles.detailContainer}>
            <View style={styles.detailContainer}>
              <Image style={styles.imgCall} source={images.call} />
              <Text
                style={[
                  commonStyles.RegularGrey11,
                  styles.customWidth,
                ]}>
                {'(+1) ' + contactnumber}
              </Text>
            </View>
            <View>
              <Image style={styles.arrowStyle} source={images.nextarrowblue} />
            </View>
          </View>
          <Text
            style={[
              commonStyles.RegularGrey11,
              styles.customWidth,
            ]}>
            {moment(startDate).format('MMM DD, YYYY  HH:MM A')}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={fetch} />
      <View>
        <Text style={commonStyles.Bold15}>Delegated Access</Text>
      </View>
      <View style={styles.titleText}>
        <Text style={commonStyles.Regular135}>
          Patients who have invited you to join session are displayed here.
        </Text>
      </View>
      <FlatList
        data={arrUsers}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {fetch == false && arrUsers.length == 0 ? (
              <Image
                style={styles.imgDelegate}
                source={images.delegatedgraphic}
              />
            ) : null}
          </View>
        }
      />
    </View>
  );
};

export default DelegateAccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCalculated(15),
    backgroundColor: COLORS.WHITE,
  },
  customWidth: {
    width: Platform.OS == 'android' ? '82%' : '90%',
  },
  titleText: {
    marginVertical: getCalculated(10),
  },
  imgDelegate: {},
  userContainer: {
    padding: getCalculated(10),
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginVertical: getCalculated(7),
    marginHorizontal: 2,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 6,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.65,
    elevation: 2,
  },
  imgEmail: {
    resizeMode: 'contain',
    width: getCalculated(16),
    marginRight: getCalculated(8),
  },
  imgCall: {
    resizeMode: 'contain',
    width: getCalculated(15),
    marginRight: getCalculated(6),
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Platform.OS == 'android' ? '85%' : '90%',
    // marginTop: getCalculated(4),
  },
  userImage: {
    width: getCalculated(57),
    height: getCalculated(57),
    resizeMode: 'contain',
    borderRadius: 6,
    marginRight: getCalculated(14),
  },
  arrowStyle: {
    alignSelf: 'center',
    width: 6,
    height: 11,
    position: 'absolute',
    right: 0,
  },
});
