import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  COLORS,
  commonStyles,
  getCalculated,
} from '../../../../components/Common';
import images from '../../../../assets/images';
import {cardsBrand} from '../../../../utiles/common';

const Card = ({cardData, onPressCard}) => {
  const {id, brand, last4, exp_month, exp_year, selected} = cardData;
  const cardBrandImg = cardsBrand[brand.toLowerCase()] || images.logosmall;
  const isCardSelected = selected
    ? images.radiobuttonactive
    : images.radiodeactive;
  return (
    <Pressable
      onPress={() => onPressCard(cardData)}
      style={styles.cardContainer}
      key={id.toString()}>
      <View style={styles.cardHeader}>
        <Image
          resizeMethod="resize"
          style={styles.cardBrand[cardBrandImg]}
          source={cardBrandImg}
        />
        <Image style={styles.radio} source={isCardSelected} />
      </View>
      <View style={{marginVertical: getCalculated(15)}}>
        <Text
          style={
            commonStyles.Regular135
          }>{`****     ****     ****     ${last4}`}</Text>
      </View>
      <View>
        <Text style={commonStyles.Regular125}>
          {'Expires On - ' + exp_month + '/' + exp_year}
        </Text>
      </View>
    </Pressable>
  );
};

export default React.memo(Card);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10.3,
    padding: getCalculated(11),
    backgroundColor: COLORS.width,
    ...commonStyles.shadow,
    ...commonStyles.shadowCard,
    width: '98%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBrand: {
    visa: {
      width: getCalculated(52),
      height: getCalculated(16),
    },
    mastercard: {
      width: getCalculated(43),
      height: getCalculated(26),
    },
    'diners club': {
      width: getCalculated(43),
      height: getCalculated(26),
    },
    'american express': {
      width: getCalculated(43),
      height: getCalculated(26),
    },
    unionpay: {
      width: getCalculated(43),
      height: getCalculated(26),
    },
    jcb: {
      width: getCalculated(43),
      height: getCalculated(26),
    },
    discover: {
      width: getCalculated(43),
      height: getCalculated(26),
    },
  },
  radio: {
    width: getCalculated(16),
    height: getCalculated(16),
  },
});
