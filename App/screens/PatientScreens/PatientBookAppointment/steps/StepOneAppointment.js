import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  COLORS,
  commonStyles,
  getCalculated,
} from '../../../../components/Common';
import {Radio} from '../../../../components/Radio';
import {getDelegateUsers} from '../../../../networking/APIMethods';
import {displayErrorMsg, userId} from '../../../../utiles/common';
import ImageLoader from '../../../../components/ImageLoader';
import images from '../../../../assets/images';
import {capitalize, isNull} from 'lodash';
import {connect} from 'react-redux';
import {Store} from '../../../../../App';
import {
  UPDATE_ARRUSERS,
  UPDATE_MODE_TYPE_AUDIO,
  UPDATE_SET_INVITE_FAMILY,
  UPDATE_APPOINTMENTTYPE_NEW,
} from '../../../../redux/BookAppointmentReducer';

const StepOne = ({
  arrUsers,
  navigation,
  disableNext,
  inviteFamily,
  modeTypeAudio,
  appointmentTypeNew,
}) => {
  function udpateModeTypeAudio(bool) {
    Store.dispatch({
      type: UPDATE_MODE_TYPE_AUDIO,
      payload: bool,
    });
  }

  function updateInviteFamily(bool) {
    Store.dispatch({
      type: UPDATE_SET_INVITE_FAMILY,
      payload: bool,
    });
  }

  function updateAppointmentType(bool) {
    Store.dispatch({
      type: UPDATE_APPOINTMENTTYPE_NEW,
      payload: bool,
    });
  }

  function updateArrUsers(arr) {
    Store.dispatch({
      type: UPDATE_ARRUSERS,
      payload: arr,
    });
  }

  useEffect(() => {
    fetchDelegatedUsers();
  }, []);

  useEffect(() => {
    if (
      isNull(inviteFamily) ||
      isNull(modeTypeAudio) ||
      isNull(appointmentTypeNew) ||
      (arrUsers.filter(item => item.selected).length == 0 && inviteFamily)
    ) {
      disableNext(true);
    } else {
      disableNext(false);
    }
  }, [arrUsers, inviteFamily, modeTypeAudio, appointmentTypeNew]);

  function fetchDelegatedUsers() {
    const payload = {
      delegatedAccessUserId: userId(),
    };
    // setFetch(true);
    getDelegateUsers(
      payload,
      response => {
        // setFetch(false);
        const users = response.map(item => {
          return {
            ...item,
            selected: false,
          };
        });
        updateArrUsers(users);
        // let users = [];
        // response.forEach(element => {
        //   var item = arrUsers.find(n => n._id === element._id);
        //   if (item) {
        //     return Object.assign(item, {
        //       ...element,
        //       selected: false,
        //     });
        //   }
        //   users.push();
        // });
        // updateArrUsers(users);
      },
      error => {
        // setFetch(false);
        displayErrorMsg(error);
      },
    );
  }

  function handleUserSelection(item, index) {
    const users = arrUsers.map(ele => {
      if (ele._id == item._id) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {...ele};
    });
    updateArrUsers(users);
  }

  function renderItem({item, index}) {
    const {
      email,
      selected,
      lastname,
      firstname,
      contactnumber,
      profileImageS3Link,
      relationWithDelegatedUser,
    } = item;
    if (inviteFamily) {
      const checkBox = selected ? images.checkedactive : images.unchecked;
      return (
        <View style={[styles.userContainer, styles.shadow]}>
          <ImageLoader
            style={styles.userImage}
            url={{uri: profileImageS3Link}}
            placeholder={images.userdefault}
          />
          <View style={{width: '70%'}}>
            <View /* style={{width: '90%'}} */>
            <Text style={commonStyles.Regular18}>
              {firstname + ' ' + lastname}
            </Text>
            </View>
            <Text style={[commonStyles.Regular12Blue, {marginVertical: 5}]}>
              {capitalize(relationWithDelegatedUser)}
            </Text>
            <View style={styles.detailContainer}>
              <Image style={styles.imgEmail} source={images.email} />
              <Text style={commonStyles.RegularGrey11}>{email}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Image style={styles.imgCall} source={images.call} />
              <Text style={commonStyles.RegularGrey11}>
                {'(+1) ' + contactnumber}
              </Text>
            </View>
          </View>
          <Pressable
            style={{alignSelf: 'flex-end'}}
            onPress={() => handleUserSelection(item, index)}>
            <Image style={styles.checkMark} source={checkBox} />
          </Pressable>
        </View>
      );
    }
    return null;
  }

  function addDelegateAction() {
    navigation.navigate('AddDelegateUser', {
      fetchDelegateUsers: () => fetchDelegatedUsers(),
    });
  }

  function renderHeader() {
    return (
      <View>
        <Text style={styles.textHeader}>Book Appointment</Text>
        <Text style={styles.textTitle}>Appointment Type?</Text>
        <View style={styles.rowView}>
          <Radio
            isChecked={appointmentTypeNew}
            title={'New'}
            checkmarkAction={() => {
              updateAppointmentType(true);
            }}
          />
          <Radio
            isNegative={true}
            style={{marginLeft: 20}}
            isChecked={appointmentTypeNew}
            title={'Follow-up'}
            checkmarkAction={() => {
              updateAppointmentType(false);
            }}
          />
        </View>

        <Text style={styles.textTitle}>
          How would you like to connect with doctor?
        </Text>
        <View style={styles.rowView}>
          <Radio
            isChecked={modeTypeAudio}
            title={'Only Audio'}
            checkmarkAction={() => {
              udpateModeTypeAudio(true);
            }}
          />
          <Radio
            isNegative={true}
            style={{marginLeft: 20}}
            isChecked={modeTypeAudio}
            title={'Video'}
            checkmarkAction={() => {
              udpateModeTypeAudio(false);
            }}
          />
        </View>

        <Text style={styles.textTitle}>
          Would you like to Invite care taker / family member for consultation?
        </Text>
        <View style={styles.rowView}>
          <Radio
            isChecked={inviteFamily}
            title={'Yes'}
            checkmarkAction={() => {
              updateInviteFamily(true);
            }}
          />
          <Radio
            isNegative={true}
            style={{marginLeft: 20}}
            isChecked={inviteFamily}
            title={'No'}
            checkmarkAction={() => {
              updateInviteFamily(false);
            }}
          />
        </View>
        {inviteFamily ? (
          <View style={styles.delegateView}>
            <View style={styles.delegateRowView}>
              <Text style={styles.textHeader}>
                Select from My Delegate Users list
              </Text>
              <Pressable onPress={() => addDelegateAction()}>
                <Text style={commonStyles.blueButton}>+ Add Delegate</Text>
              </Pressable>
            </View>
            <Text style={commonStyles.Regular135}>
              Max 3-4 members can be Invited to the session. An invitation email
              will be sent for the Invited members
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {inviteFamily ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{width: '100%', paddingBottom: 200}}
          data={arrUsers}
          extraData={arrUsers}
          keyExtractor={item => item._id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHeader()}
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = ({bookedAppointment}) => {
  return {
    arrUsers: bookedAppointment.arrUsers,
    modeTypeAudio: bookedAppointment.modeTypeAudio,
    inviteFamily: bookedAppointment.inviteFamily,
    appointmentTypeNew: bookedAppointment.appointmentTypeNew,
  };
};

export default connect(mapStateToProps)(StepOne);

const styles = StyleSheet.create({
  container: {
    // alignItems: 'flex-start',
  },
  textHeader: {
    ...commonStyles.Bold15,
    width: '60%',
  },
  textTitle: {
    ...commonStyles.Medium135,
    marginTop: 25,
  },
  rowView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    alignSelf: 'center',
  },
  delegateRowView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  delegateView: {
    marginTop: 20,
  },
  userContainer: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginVertical: getCalculated(7),
    marginHorizontal: 2,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'space-around',
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
    // marginTop: getCalculated(4),
  },
  checkMark: {width: 20, height: 20, resizeMode: 'contain'},
});
