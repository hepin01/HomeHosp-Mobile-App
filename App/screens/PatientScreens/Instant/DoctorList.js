import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, commonStyles, getCalculated } from '../../../components/Common';
import SearchBar from '../../../components/SearchBar';
import { Loader } from '../../../components/Loader';
import { arrDoctors } from './DummyData';
import images from '../../../assets/images';
import ProviderCell from './ProviderCell';
import { getInstantConsultationProviders, toggleProviderPrefference } from '../../../networking/APIMethods';
import { displayErrorMsg, userId } from '../../../utiles/common';

const defaultPayload = {
  search: '',
  insurance: null,
  language: null,
  providerType: null,
  providerSubType: null,
  gender: null,
  affiliation: null,
  limit: 100,
  pageNo: 1,
};

const DoctorList = props => {
  const [loading, setLoading] = useState(false);
  const [arrDoctor, setArrDoctor] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [numOfRecords, setNumOfRecords] = useState(0);
  const [filterEnable, setFilterEnable] = useState(false);
  const [payload, setPayload] = useState(defaultPayload);

  useEffect(() => {
    docList();
  }, [payload]);

  function docList() {
    setLoading(true);
    try {
      getInstantConsultationProviders(
        payload,
        ({ data: { numOfResults, doctors } }) => {
          setLoading(false);
          setArrDoctor(doctors);
          setNumOfRecords(numOfResults);
        },
        error => {
          setLoading(false);
          displayErrorMsg(error);
        },
      );
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function searchProvider() {
    setPayload(prevState => ({
      ...prevState,
      search: searchQuery,
    }));
  }

  function handleFilterPressed() {
    props.navigation.navigate('HomeFilter', {
      currentPayload: payload,
      filerList: (payload, filterEnable) => {
        setPayload(payload);
        setFilterEnable(filterEnable);
      },
    });
  }

  function togglePreferredDoctor(providerId, preferred) {
    setLoading(true);
    const payload = {
      userId: userId(),
      providerId: providerId,
      preferred: preferred,
    };
    toggleProviderPrefference(
      payload,
      response => {
        setLoading(false);
        docList();
      },
      error => {
        setLoading(false);
        displayErrorMsg(error);
      },
    );
  }

  function handleOnPressProvider(item) {
    props.navigation.navigate('SelectAppType', {
      doctorDetails: item,
    });
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={loading} />
      <SearchBar
        placeholder="Search provider"
        onSubmitEditing={() => searchProvider()}
        onChangeText={text => setSearchQuery(text)}
        onClearPressed={() => setSearchQuery('')}
      />
      <View style={styles.listHeader}>
        <View style={{ marginVertical: getCalculated(11) }}>
          <Text style={commonStyles.Regular12}>
            {numOfRecords} Records Found
          </Text>
        </View>
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
      {arrDoctor.length ? (
        <FlatList
          data={arrDoctor}
          extraData={arrDoctor}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 200 }}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <ProviderCell
              item={item}
              index={index}
              handleOnPressProvider={() => handleOnPressProvider(item)}
              togglePreferredDoctor={(providerId, preferred) => togglePreferredDoctor(providerId, preferred)}
            />
          )}
        />
      ) : (
        <View style={styles.ListEmptyComponent}>
          <Image source={images.patientnodatafound} style={styles.noDataImage} resizeMode="contain" />
          <Text style={commonStyles.Medium135}>No Records Found</Text>
        </View>
      )}
    </View>
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCalculated(15),
    backgroundColor: COLORS.WHITE,
  },
  searchBox: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginVertical: getCalculated(10),
  },
  filterDisable: {
    width: getCalculated(17),
    height: getCalculated(17),
  },
  filterEnable: {
    width: getCalculated(39),
    height: getCalculated(39),
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
