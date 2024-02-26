import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import SearchBar from '../../components/SearchBar';

import PatientCell from './PatientCell';
import {FlatList} from 'react-native-gesture-handler';
import {AlertModal} from '../../components/AlertModal';
import {
  getPatientsForInstantConsultation,
  requestPatientForInstantConsultation,
} from '../../networking/APIMethods';
import {
  displayErrorMsg,
  getCurrentTimezone,
  getUTCIso,
} from '../../utiles/common';
import {Loader} from '../../components/Loader';
import moment from 'moment';
import {SuccessModal} from '../../components/SuccessModal';
import images from '../../assets/images';

const SentRequest = ({navigation: {pop}}) => {
  const [loading, setLoading] = useState(true);
  const [arrPatient, setArrPatient] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getPatientList();
  }, []);

  function getPatientList() {
    setLoading(true);
    const payload = {
      searchQuery: searchQuery,
      startDate: getUTCIso(moment()),
    };
    getPatientsForInstantConsultation(
      payload,
      ({data}) => {
        setLoading(false);
        setTotalCount(data.length);
        setArrPatient(data);
      },
      error => {
        setLoading(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  function sendRequest() {
    setAlertVisible(false);
    if (selectedItem) {
      setLoading(true);
      const payload = {
        patientId: selectedItem?._id,
        timeZone: getCurrentTimezone(),
        startDate: getUTCIso(moment()),
      };
      requestPatientForInstantConsultation(
        payload,
        response => {
          setLoading(false);
          setShowSuccess(true);
        },
        error => {
          setLoading(false);
          console.log(error);
          displayErrorMsg(error);
        },
      );
    } else {
      setLoading(false);
      displayErrorMsg('Oops! Something went wrong. Please try again.');
    }
  }

  function handleOnItemPressed(item) {
    setAlertVisible(true);
    setSelectedItem(item);
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={loading} />
      <View style={styles.searchView}>
        <SearchBar
          placeholder="Search by Patient’s Name"
          onSubmitEditing={() => getPatientList()}
          onChangeText={text => setSearchQuery(text)}
          onClearPressed={() => setSearchQuery('')}
        />
      </View>
      <View style={styles.searchView}>
        <Text style={commonStyles.Regular12}>{totalCount} Records Found</Text>
      </View>
      <FlatList
        data={arrPatient}
        style={{width: '100%'}}
        contentContainerStyle={{paddingBottom: 200}}
        renderItem={({item, index}) => (
          <PatientCell
            item={item}
            onItemPressed={() => handleOnItemPressed(item)}
          />
        )}
      />
      {alertVisible ? (
        <AlertModal
          title="Send Invite"
          message="Do you want to send Instant Consultation invite to this patient?"
          leftButtonAction={() => sendRequest()}
          leftButtonTitle="Yes"
          rightButtonTitle="Cancel"
          rightButtonAction={() => setAlertVisible(false)}
        />
      ) : null}
      {showSuccess ? (
        <SuccessModal
          image={images.successwithcircle}
          title={'Success'}
          message={'Request sent successfully.'}
          buttonAction={() => {
            setShowSuccess(false);
            pop();
          }}
          rightButtonTitle="Okay"
          // closeBtnAction={() => {
          //   setShowSuccess(false);
          //   pop();
          // }}
        />
      ) : null}
    </View>
  );
};

export default SentRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  searchView: {
    padding: 15,
  },
});
