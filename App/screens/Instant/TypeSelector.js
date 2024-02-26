import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';

const TypeSelector = ({arrTypes, handleTypePressed}) => {
  const [type, setType] = useState([]);
  useEffect(() => {
    setType(arrTypes);
  }, [arrTypes]);

  return (
    <View style={styles.typeContainer}>
      {arrTypes.map((item, index) => {
        return (
          <Pressable
            key={item.id.toString()}
            onPress={() => handleTypePressed(item, index)}
            style={item.selected ? styles.typeButtonSelected : null}>
            <Text
              style={
                item.selected
                  ? commonStyles.Regular11White
                  : commonStyles.Regular12Blue
              }>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default TypeSelector;

const styles = StyleSheet.create({
  typeContainer: {
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    width: '98%',
    marginTop: getCalculated(14),
    marginBottom: getCalculated(5),
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: COLORS.BLUE,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 20,
  },
});
