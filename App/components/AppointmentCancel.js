import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import {COLORS, commonStyles} from './Common';
import {SmallButton} from './SmallButton';

const AppointmentCancel = ({showResons, onSave, onCancel}) => {
  const providerReasons = [
    {id: 1, label: 'Patient was not available', selected: false},
    {id: 2, label: 'Has a caller id blocked', selected: false},
    {id: 3, label: 'Patient requested cancellation', selected: false},
    {id: 4, label: 'Technical difficulty', selected: false},
    {id: 5, label: 'Poor connection', selected: false},
    {id: 6, label: 'Busy with other appointment', selected: false},
    {id: 7, label: 'Other', selected: false},
  ];
  const [arrReaons, setArrReaons] = useState(providerReasons);

  useEffect(() => {
    if (showResons && arrReaons.some(item => item.selected)) {
      const temp = arrReaons.map(item => {
        if (item.selected) {
          return {
            ...item,
            selected: false,
          };
        }
        return item;
      });
      setArrReaons(temp);
    }
  }, [showResons]);

  const handleResonSelection = element => {
    const temp = arrReaons.map(item => {
      if (item.id == element.id) {
        return {
          ...element,
          selected: !element.selected,
        };
      } else if (item.selected) {
        return {
          ...item,
          selected: false,
        };
      }
      return item;
    });
    setArrReaons(temp);
  };

  const renderReason = item => {
    const {id, label, selected} = item;
    return (
      <Pressable
        key={id.toString()}
        style={styles.containerReason}
        onPress={() => handleResonSelection(item)}>
        {renderRadioBox(selected)}
        <Text style={commonStyles.Regular12}>{label}</Text>
      </Pressable>
    );
  };

  const renderRadioBox = (selected = false) => {
    return (
      <View style={styles.outerCircle(selected)}>
        {selected ? <View style={styles.innerCircle(selected)} /> : null}
      </View>
    );
  };

  const saveReson = () => {
    const selected = arrReaons.find(item => item.selected);
    onSave(selected.label);
  };
  const disableButton = !arrReaons.some(item => item.selected);
  return (
    <ReactNativeModal isVisible={showResons || false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.Bold15}>Appointment Cancellation</Text>
        </View>
        <Text style={commonStyles.Medium125}>
          Please provide reason for appointment Cancellation
        </Text>
        {arrReaons.map(item => renderReason(item))}
        <View style={styles.btnContainer}>
          <SmallButton
            buttonTextStyle={{color: COLORS.BLUE}}
            style={styles.btnClear}
            buttonTitle={'Cancel'}
            buttonAction={() => onCancel()}
          />
          <SmallButton
            style={styles.btnDone(disableButton)}
            buttonTitle={'Save'}
            buttonAction={() => saveReson()}
            disabled={disableButton}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default AppointmentCancel;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
  },
  containerReason: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerCircle: selected => ({
    borderWidth: 1,
    width: 30,
    height: 30,
    marginRight: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: selected ? '#ff8a48' : COLORS.DARK_GRAY,
  }),
  innerCircle: selected => ({
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: selected ? '#ff8a48' : COLORS.WHITE,
    borderColor: selected ? '#ff8a48' : COLORS.DARK_GRAY,
  }),
  btnContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnDone: disabled => ({
    marginTop: 50,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
    backgroundColor: disabled ? COLORS.LIGHT_GRAY : COLORS.BLUE,
  }),
  btnClear: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BLUE,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
