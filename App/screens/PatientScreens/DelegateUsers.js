import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SwipeableFlatList from 'react-native-swipeable-list';

import {getCalculated, commonStyles, COLORS} from '../../components/Common';
import {displayErrorMsg, userId} from '../../utiles/common';
import {
  addNewDelegateUser,
  getDelegateUsers,
  removeDelegateUser,
} from '../../networking/APIMethods';
import {Loader} from '../../components/Loader';
import images from '../../assets/images';
import ImageLoader from '../../components/ImageLoader';
import {capitalize} from 'lodash';
import {AlertModal} from '../../components/AlertModal';
import {SuccessModal} from '../../components/SuccessModal';

const DelegateUsers = ({navigation}) => {
  const [fetch, setFetch] = useState(true);
  const [arrUsers, setArrUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  useEffect(() => {
    navigation.addListener('focus', () => fetchDelegatedUsers());
  }, []);

  function fetchDelegatedUsers() {
    const payload = {
      delegatedAccessUserId: userId(),
    };
    setFetch(true);
    getDelegateUsers(
      payload,
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

  function deleteItem({_id}) {
    setShowConfirmDelete(true);
    const payload = {
      userId: userId(),
      delegatedId: _id,
    };
    setItemToDelete(payload);
  }

  function handleRightButtonAction() {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  }

  function handleLefttButtonAction() {
    if (!!itemToDelete) {
      deleteUser();
    }
  }

  function deleteUser() {
    setFetch(true);
    removeDelegateUser(
      itemToDelete,
      response => {
        setFetch(false);
        setItemToDelete(null);
        setShowConfirmDelete(false);
        fetchDelegatedUsers();
        setShowSuccessModal(true);
      },
      error => {
        setFetch(false);
        setItemToDelete(null);
        displayErrorMsg(error);
        setShowConfirmDelete(false);
      },
    );
  }

  function handleOnRefresh() {
    setRefreshing(true);
    fetchDelegatedUsers();
  }

  function addNewUser() {
    if (arrUsers.length >= 5) {
      Alert.alert('Error', 'You can add upto 5 delegate users.');
    } else {
      navigation.navigate('AddDelegateUser');
    }
  }

  function QuickActions(index, qaItem) {
    return (
      <Pressable style={styles.qaContainer} onPress={() => deleteItem(qaItem)}>
        <View style={styles.button}>
          <Image style={styles.deleteIcon} source={images.deleteicon} />
        </View>
      </Pressable>
    );
  }

  function renderItem({item, index}) {
    const {
      email,
      lastname,
      firstname,
      contactnumber,
      profileImageS3Link,
      relationWithDelegatedUser,
    } = item;
    return (
      <View style={[styles.userContainer, styles.shadow]}>
        <ImageLoader
          style={styles.userImage}
          url={{uri: profileImageS3Link}}
          placeholder={images.userdefault}
        />
        <View>
          <View style={styles.customWidth}>
            <Text
              style={[
                commonStyles.Regular18,
                styles.customWidth,
              ]}>
              {firstname + ' ' + lastname}
            </Text>
          </View>

          <Text style={[commonStyles.Regular12Blue, {marginVertical: 5}]}>
            {capitalize(relationWithDelegatedUser)}
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
            <Image style={styles.imgCall} source={images.call} />
            <Text
              style={[
                commonStyles.RegularGrey11,
                styles.customWidth,
              ]}>
              {'(+1) ' + contactnumber}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.container}>
        {/* <Loader modalVisible={fetch} /> */}
        <View style={styles.header}>
          <Text style={commonStyles.Bold15}>My Delegates</Text>
          <Pressable onPress={() => addNewUser()}>
            <Text style={commonStyles.Regular12Blue}>+ Add Delegate</Text>
          </Pressable>
        </View>
        <View style={styles.titleText}>
          <Text style={commonStyles.Regular135}>
            The below users can be Invited to session by confirming in Intake
            form.
          </Text>
        </View>
        <SwipeableFlatList
          maxSwipeDistance={100}
          style={{width: '100%'}}
          showVerti
          contentContainerStyle={{paddingBottom: 200, width: '100%'}}
          renderQuickActions={({index, item}) => QuickActions(index, item)}
          shouldBounceOnMount={true}
          data={arrUsers}
          keyExtractor={item => item._id.toString()}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              tintColor={COLORS.BLUE}
              refreshing={refreshing}
              onRefresh={() => handleOnRefresh}
            />
          }
          renderItem={renderItem}
        />
      </View>
      <AlertModal
        showClose={false}
        title={'Confirm'}
        leftButtonAction={handleLefttButtonAction}
        rightButtonAction={handleRightButtonAction}
        modalVisible={showConfirmDelete && !!itemToDelete}
        message={'Are you sure you want to remove this user?'}
      />
      <AlertModal
        showClose={false}
        modalVisible={showSuccessModal}
        leftButtonAction={() => setShowSuccessModal(false)}
        renderItem={
          <View style={styles.alertContainer}>
            <Image style={styles.alertImg} source={images.userremovedcircle} />
            <Text style={[commonStyles.Medium16, {margin: 15}]}>
              {'Success'}
            </Text>
            <Text style={commonStyles.Regular135}>
              {'Delegated user removed successfully!'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default DelegateUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingVertical: getCalculated(15),
    width: '92%',
  },
  customWidth: {
    width: Platform.OS == 'android' ? '82%' : '90%',
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  titleText: {
    marginVertical: getCalculated(10),
  },
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: getCalculated(10),
    marginRight: 5,
    borderRadius: 6,
  },
  button: {
    height: '100%',
    width: '30%',
    // borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.DELETEBG,
  },
  contentContainerStyle: {
    // flexGrow: 1,
  },
  deleteIcon: {
    resizeMode: 'contain',
    resizeMethod: 'resize',
    width: getCalculated(18),
    height: getCalculated(23),
  },
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
  userImage: {
    width: getCalculated(57),
    height: getCalculated(57),
    resizeMode: 'contain',
    borderRadius: 6,
    marginRight: getCalculated(14),
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
    width: Platform.OS == 'android' ? '82%' : '90%',
    // marginTop: getCalculated(4),
  },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCalculated(15),
  },
  alertImg: {
    resizeMode: 'contain',
    resizeMethod: 'resize',
    height: getCalculated(60),
    width: getCalculated(60),
  },
});
