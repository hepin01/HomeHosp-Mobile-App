import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import images from '../../../assets/images';
import {
  getAgencyUsers,
  getLanguages,
  getSpecialities,
} from '../../../networking/APIMethods';
import {
  displayErrorMsg,
  getInsuranceList,
  userId,
} from '../../../utiles/common';
import {SmallButton} from '../../../components/SmallButton';
import {SelectiveDropdown} from '../../../components/SelectiveDropdown';
import {Loader} from '../../../components/Loader';

const DoctorsListFilter = ({navigation, route: {params}}) => {
  const initalPayload = {
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
  };
  var subProviderRef = React.createRef();
  const [fetching, setFetching] = useState(true);

  const [selectedAgency, setSelectedAgency] = useState('');

  const [location, setLocation] = useState('');

  const [selectedInsurance, setSelectedInsurance] = useState([]);

  const [arrLanguages, setArrLanguages] = useState([]);
  const [arrSelectedLanguage, setArrSelectedLanguage] = useState([]);

  const [arrProviderType, setArrProviderType] = useState([]);
  const [selecteProvider, setSelecteProvider] = useState('');

  const [arrProviderSubType, setArrProviderSubType] = useState([]);
  const [selectedProviderSubType, setSelectedProviderSubType] = useState('');

  const [payload, setPayload] = useState(params.currentPayload);
  const [arrGender, setArrGender] = useState([
    {
      id: 1,
      gender: 'Male',
      selected: false,
    },
    {
      id: 2,
      gender: 'Female',
      selected: false,
    },
  ]);

  useEffect(() => {
    fetchlanguage();
    fetchProviderType();
    setInitailValues();
  }, []);

  useEffect(() => {
    const tempLanguage = arrSelectedLanguage.map(item => {
      return item;
    });
    let gender = arrGender.find(item => item.selected);
    if (gender) {
      gender = gender.gender.toLowerCase();
    } else {
      gender = null;
    }
    setPayload({
      ...payload,
      gender: gender,
      search: location.trim(),
      language: tempLanguage,
    });
  }, [location, arrSelectedLanguage, arrGender]);

  function setInitailValues() {
    const {currentPayload} = params;
    console.log(currentPayload);
    let tempGender = null;
    if (currentPayload) {
      const {search, language, gender, insurance} = currentPayload;
      setLocation(search || '');
      setSelectedInsurance(insurance || []);
      setArrSelectedLanguage(language || []);

      if (gender) {
        const tempGender = arrGender.map(item => {
          if (item.gender.toLowerCase() == gender) {
            return {
              ...item,
              selected: true,
            };
          }
          return {
            ...item,
            selected: false,
          };
        });
        setArrGender(tempGender);
      }
      setPayload(currentPayload);
    }
  }

  function fetchlanguage() {
    setFetching(true);
    getLanguages(
      response => {
        setFetching(false);
        const lang = response.filter(
          item => item.status.toLowerCase() == 'active',
        );
        setArrLanguages(lang);
      },
      error => {
        setFetching(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  function fetchProviderType() {
    // setFetching(true);
    getSpecialities(
      response => {
        setFetching(false);
        const data = response.specialties;
        setArrProviderType(data);
        const {currentPayload} = params;
        console.log(currentPayload);
        if (currentPayload) {
          const {providerType, providerSubType} = currentPayload;
          if (providerType?.length) {
            const type = data.find(item => item.provider == providerType);
            setArrProviderSubType(type?.Specialties || []);
            setSelecteProvider(providerType);
          } else {
            setSelecteProvider('Select');
          }
          if (providerSubType) {
            setSelectedProviderSubType(providerSubType);
          }
        }
      },
      error => {
        setFetching(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  function handleDeleteLang(index) {
    const temp = [...arrSelectedLanguage];
    temp.splice(index, 1);
    setArrSelectedLanguage(temp);
  }

  function handleDeleteInsurance(index) {
    const temp = [...selectedInsurance];
    temp.splice(index, 1);
    setSelectedInsurance(temp);
  }

  function handleGenderChange(i) {
    let temp = [...arrGender];
    temp = temp.map((item, index) => {
      if (i == index) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {
        ...item,
        selected: false,
      };
    });
    setArrGender(temp);
  }

  function handleDone() {
    params?.filerList(payload, true);
    navigation.pop();
  }

  function handleClear() {
    params?.filerList(initalPayload, false);
    navigation.pop();
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        padding: getCalculated(15),
      }}>
      <Loader modalVisible={fetching} />
      <View>
        <Text style={styles.filterLabel}>Location</Text>
        <View style={styles.dropDown}>
          <TextInput
            placeholder={'City, State or Zip'}
            value={location}
            style={{
              paddingVertical: getCalculated(11),
              paddingHorizontal: getCalculated(16),
            }}
            onChangeText={text => setLocation(text)}
          />
        </View>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.filterLabel}>Insurance</Text>
        <SelectiveDropdown
          list={getInsuranceList()}
          value={selectedInsurance[selectedInsurance.length - 1] || 'Select'}
          onSelect={(selectedItem, index) => {
            if (!selectedInsurance.includes(selectedItem)) {
              setPayload({
                ...payload,
                insurance: [selectedItem, ...selectedInsurance],
              });
              setSelectedInsurance([selectedItem, ...selectedInsurance]);
            }
          }}
        />
      </View>
      {selectedInsurance?.length ? (
        <View
          style={[
            styles.fieldContainer,
            {flexWrap: 'wrap', flexDirection: 'row'},
          ]}>
          {selectedInsurance.map((item, index) => (
            <Pressable
              key={index.toString()}
              style={styles.selectedlaguage}
              onPress={() => handleDeleteInsurance(index)}>
              <Text style={commonStyles.Regular12}>{item}</Text>
              <Image style={styles.close} source={images.closeicon} />
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.fieldContainer}>
        <Text style={{...commonStyles.Bold125, alignSelf: 'flex-start'}}>
          Gender
        </Text>
        <View style={styles.genderOptions}>
          {arrGender.map((item, index) => {
            const check = item.selected ? images.selected : images.unselected;
            return (
              <Pressable
                key={index.toString()}
                style={styles.genderOption}
                onPress={() => handleGenderChange(index)}>
                <Image
                  resizeMethod="resize"
                  resizeMode="contain"
                  style={styles.imgCheck}
                  source={check}
                />
                <Text style={commonStyles.RegularBlack115}>{item.gender}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.filterLabel}>Select Languages</Text>
        {arrLanguages.length ? (
          <SelectiveDropdown
            list={arrLanguages.map(item => {
              return item.fullName;
            })}
            value={selectedAgency.fullName || 'Select'}
            onSelect={(selectedItem, index) => {
              //   setSelectedLang(selectedItem);
              if (arrSelectedLanguage.indexOf(selectedItem) == -1) {
                setArrSelectedLanguage([...arrSelectedLanguage, selectedItem]);
              } else {
                displayErrorMsg('Language already selected.');
              }
            }}
          />
        ) : null}
      </View>
      {arrSelectedLanguage?.length ? (
        <View
          style={[
            styles.fieldContainer,
            {flexWrap: 'wrap', flexDirection: 'row'},
          ]}>
          {arrSelectedLanguage.map((item, index) => (
            <Pressable
              key={index.toString()}
              style={styles.selectedlaguage}
              onPress={() => handleDeleteLang(index)}>
              <Text style={commonStyles.Regular12}>{item}</Text>
              <Image style={styles.close} source={images.closeicon} />
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.fieldContainer}>
        <Text style={styles.filterLabel}>Select Provider Types</Text>
        {arrProviderType.length ? (
          <SelectiveDropdown
            list={arrProviderType.map(item => {
              return item.provider;
            })}
            value={
              selecteProvider
                ? selecteProvider?.provider || selecteProvider
                : 'Select'
            }
            onSelect={(item, index) => {
              const selectedItem = arrProviderType.find(
                ele => ele.provider == item,
              );
              setSelecteProvider(selectedItem);
              setSelectedProviderSubType('');
              // reset sub provider dropdown
              subProviderRef?.reset();
              setArrProviderSubType(selectedItem.Specialties || []);
              setPayload({
                ...payload,
                providerType: [selectedItem.provider] || '',
              });
            }}
          />
        ) : null}
      </View>
      {arrProviderSubType.length ? (
        <View style={styles.fieldContainer}>
          <Text style={styles.filterLabel}>Select Provider Sub Types</Text>
          <SelectiveDropdown
            list={arrProviderSubType}
            getRef={ref => (subProviderRef = ref)}
            value={selectedProviderSubType || 'Select'}
            onSelect={(selectedItem, index) => {
              setPayload({
                ...payload,
                providerSubType: selectedItem.trim() || '',
              });
              setSelectedProviderSubType(selectedItem);
            }}
          />
        </View>
      ) : null}
      <View style={styles.btnContainer}>
        <SmallButton
          buttonTextStyle={{color: COLORS.BLUE}}
          style={styles.btnClear}
          buttonTitle={'Clear'}
          buttonAction={() => handleClear()}
        />
        <SmallButton
          style={styles.btnDone}
          buttonTitle={'Done'}
          buttonAction={() => handleDone()}
        />
      </View>
    </ScrollView>
  );
};

export default DoctorsListFilter;

const styles = StyleSheet.create({
  ddBtnStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'center',
  },
  ddStyle: {width: '90%', borderRadius: 6, marginTop: -4},
  dropdownView: {
    marginTop: 7,
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    borderRadius: 4,
    alignSelf: 'center',
    height: getCalculated(40),
  },
  rowTxtStyle: {textAlign: 'left', alignSelf: 'center'},
  btnTxtStyle: hasLenght => ({
    textAlign: 'left',
    marginLeft: 0,
    height: '60%',
    color: hasLenght ? COLORS.DARK_GRAY : COLORS.LIGHT_GRAY,
  }),
  dropDown: {
    // width: 580,
    // height: 79,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#98a0ab',
  },
  filterLabel: {
    ...commonStyles.RegularGrey11,
    marginBottom: getCalculated(7),
  },
  fieldContainer: {marginVertical: getCalculated(7)},
  selectedlaguage: {
    borderRadius: 7.7,
    paddingVertical: getCalculated(10),
    paddingHorizontal: getCalculated(20),
    backgroundColor: '#ffffff',
    ...commonStyles.shadow,
    flexDirection: 'row',
    marginHorizontal: getCalculated(2),
    marginVertical: getCalculated(5),
  },
  close: {
    marginLeft: getCalculated(5),
    width: getCalculated(13),
    height: getCalculated(13),
  },
  genderOptions: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: getCalculated(11),
    // justifyContent: 'space-between',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: getCalculated(25),
  },
  imgCheck: {
    width: getCalculated(20),
    height: getCalculated(20),
    marginRight: 5,
  },
  btnContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 200,
    marginTop: getCalculated(25),
  },
  btnDone: {
    alignSelf: 'center',
    marginLeft: getCalculated(13),
    backgroundColor: COLORS.BLUE,
  },
  btnClear: {
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: COLORS.BLUE,
    backgroundColor: COLORS.WHITE,
  },
});
