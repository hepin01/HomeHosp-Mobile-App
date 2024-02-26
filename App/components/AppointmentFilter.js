import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import SelectDropdown from 'react-native-select-dropdown';
import {SmallButton} from './SmallButton';
import {COLORS, commonStyles, getCalculated} from './Common';
import images from '../assets/images';
import {capitalize} from 'lodash';
import {SelectiveDropdown} from './SelectiveDropdown';

const AppointmentFilter = ({
  isVisible,
  onClearPressed,
  onDonePressed,
  selectedFilter,
  closeFilter,
}) => {
  const arrTypes = [
    {
      label: 'Both',
      selected: false,
    },
    {
      label: 'Audio',
      selected: false,
    },
    {
      label: 'Video',
      selected: false,
    },
  ];
  const defaultFilter = {
    status: 'all',
    filter: 'upcoming',
    sessionType: 'all',
    from: null,
    to: null,
    patientName: '',
    limit: 30,
    offset: 0,
  };
  const [hideFilter, setHideFilter] = useState(true);
  const [arrStatus, setArrStatus] = useState([
    'All',
    'Cancelled',
    'Completed',
    'Pending',
    'Upcoming',
  ]);
  const [selectedStatus, setSelectedStatus] = useState('Upcoming');
  const [arrCommunicationType, setArrCommunicationType] = useState([
    {
      label: 'Both',
      selected: false,
    },
    {
      label: 'Audio',
      selected: false,
    },
    {
      label: 'Video',
      selected: false,
    },
  ]);
  const [arrConsultationTypes, setArrConsultationTypes] = useState([
    {
      label: 'Both',
      selected: false,
    },
    {
      label: 'Instant',
      selected: false,
    },
    {
      label: 'Regular',
      selected: false,
    },
  ]);
  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    const {sessionType, filter} = selectedFilter;
    setFilter(selectedFilter);
    setSelectedStatus(capitalize(filter));
    const tempCommunication = arrCommunicationType.map((item, index) => {
      if (item.label == 'Both' && sessionType == 'all') {
        return {
          ...item,
          selected: true,
        };
      } else if (item.label == 'Audio' && sessionType == 'telephonic') {
        return {
          ...item,
          selected: true,
        };
      } else if (item.label == 'Video' && sessionType == 'video') {
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
    setArrCommunicationType(tempCommunication);
  }, [selectedFilter]);

  const clearFilter = () => {
    setArrCommunicationType([
      {
        label: 'Both',
        selected: true,
      },
      {
        label: 'Audio',
        selected: false,
      },
      {
        label: 'Video',
        selected: false,
      },
    ]);
    setArrConsultationTypes([
      {
        label: 'Both',
        selected: false,
      },
      {
        label: 'Audio',
        selected: false,
      },
      {
        label: 'Video',
        selected: false,
      },
    ]);
    setSelectedStatus('Upcoming');
    onClearPressed(defaultFilter);
  };

  const onDone = () => {
    let session = 'all';
    const selectedMode = arrCommunicationType.filter(item => item.selected);

    if (selectedMode.length == 1) {
      if (selectedMode[0].label == 'Audio') {
        session = 'telephonic';
      } else if (selectedMode[0].label == 'Video') {
        session = 'video';
      }
    }
    const selectedFilter = {
      ...defaultFilter,
      filter: selectedStatus.toLowerCase(),
      sessionType: session.toLowerCase(),
    };
    onDonePressed(selectedFilter);
  };

  const handleCommunicationTypeChange = (index, item) => {
    let tempItem = item;
    console.log(item, arrCommunicationType);
    const modType = arrCommunicationType.map(item => {
      if (tempItem.label == item.label) {
        return {
          ...item,
          selected: !item.selected,
        };
      } else {
        return {
          ...item,
          selected: false,
        };
      }
    });
    setArrCommunicationType(modType);
  };

  const handleConsultationTypeChange = (index, item) => {
    let tempFilterOptions = [...arrConsultationTypes];
    let tempItem = item;
    tempItem.selected = !tempItem.selected;
    tempFilterOptions.splice(index, 1, item);
    setArrConsultationTypes(tempFilterOptions);
  };

  const renderType = (item, index, handle) => {
    return (
      <Pressable
        onPress={() => handle(index, item)}
        style={styles.renderTypes}
        key={index.toString()}>
        <Text style={[commonStyles.Regular135, {flex: 1}]}>{item.label}</Text>
        <View>
          {item.selected ? (
            <Image
              resizeMethod="scale"
              resizeMode="contain"
              style={styles.imgSelectImg}
              source={images.selected}
            />
          ) : (
            <Image
              resizeMethod="scale"
              resizeMode="contain"
              style={styles.imgSelectImg}
              source={images.unselected}
            />
          )}
        </View>
        <Text>{item.selected}</Text>
      </Pressable>
    );
  };

  return (
    <ReactNativeModal
      testID={'modal'}
      isVisible={isVisible}
      swipeDirection={['down']}
      onSwipeComplete={() => closeFilter()}
      onBackButtonPress={() => closeFilter()}
      onBackdropPress={() => closeFilter()}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View style={styles.manageScrollContainer}>
        <View style={styles.rowView}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.modalBar} />
          </View>
          <Text style={commonStyles.Bold18}>{'Appointment Filters'}</Text>
        </View>
        <View style={{marginTop: getCalculated(12)}}>
          <Text style={{...commonStyles.Bold135, alignSelf: 'flex-start'}}>
            {'Appointment Status'}
          </Text>
          <SelectiveDropdown
            list={arrStatus}
            value={selectedStatus || 'Select'}
            onSelect={(selectedItem, index) => {
              setSelectedStatus(selectedItem);
            }}
          />
        </View>
        <View
          style={{
            marginTop: getCalculated(9),
          }}>
          <Text
            style={[
              commonStyles.Bold135,
              {alignSelf: 'flex-start', marginBottom: getCalculated(6)},
            ]}>
            {'Appointment Mode'}
          </Text>
          <View>
            {arrCommunicationType.map((item, index) =>
              renderType(item, index, handleCommunicationTypeChange),
            )}
          </View>
        </View>
        <View
          style={{
            marginTop: getCalculated(9),
          }}>
          <View style={styles.btnContainer}>
            <SmallButton
              buttonTextStyle={{color: COLORS.BLUE}}
              style={styles.btnClear}
              buttonTitle={'Clear'}
              buttonAction={() => clearFilter()}
            />
            <SmallButton
              style={styles.btnDone}
              buttonTitle={'Done'}
              buttonAction={() => onDone()}
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default AppointmentFilter;

const styles = StyleSheet.create({
  manageScrollContainer: {
    padding: 15,
    height: '80%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: COLORS.WHITE,
  },
  rowTxtStyle: {textAlign: 'left', alignSelf: 'center'},
  btnTxtStyle: hasLenght => ({
    textAlign: 'left',
    marginLeft: 0,
    height: '60%',
    color: hasLenght ? COLORS.DARK_GRAY : COLORS.LIGHT_GRAY,
  }),
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
  renderTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imgSelectImg: {
    height: 19,
    width: 19,
  },
  btnContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnDone: {
    marginTop: 50,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  btnClear: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BLUE,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
});
