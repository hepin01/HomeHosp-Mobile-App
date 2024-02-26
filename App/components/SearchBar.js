import {Image, Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from './Common';
import images from '../assets/images';

const SearchBar = ({
  style,
  onChangeText,
  placeholder = 'Search',
  onClearPressed,
  textInputProps,
  onSubmitEditing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  // useEffect(() => {
  //   onChangeText(searchQuery);
  // }, [searchQuery]);

  return (
    <View style={[styles.container, style]}>
      <Pressable>
        <Image
          resizeMethod={'resize'}
          resizeMode={'contain'}
          style={styles.img}
          source={images.search}
        />
      </Pressable>
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <TextInput
          value={searchQuery}
          returnKeyType={'search'}
          style={styles.textInput}
          allowFontScaling={false}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={'#98a0ab'}
          onChangeText={text => {
            setSearchQuery(text.trim());
            onChangeText(text);
          }}
          {...textInputProps}
        />
      </View>
      {/* <Pressable
        onPress={() => {
          setSearchQuery('');
          onClearPressed();
        }}>
        <Image
          resizeMethod={'resize'}
          resizeMode={'contain'}
          style={styles.imgClear}
          source={images.close}
        />
      </Pressable> */}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.65,
    elevation: 5,
    width: '100%',
    height: getCalculated(46.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 17,
  },
  img: {
    width: getCalculated(15),
    height: getCalculated(15),
  },
  imgClear: {
    width: getCalculated(10),
    height: getCalculated(10),
  },
  textInput: {
    ...commonStyles.Regular125,
    marginLeft: 15,
  },
});
