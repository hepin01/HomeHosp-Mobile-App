import {View} from 'moti';
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {
  CardField,
  useStripe,
  StripeProvider,
} from '@stripe/stripe-react-native';
import {
  COLORS,
  commonStyles,
  getCalculated,
  stripe,
} from '../../../../components/Common';
import {SmallButton} from '../../../../components/SmallButton';
import {TextFieldComponent} from '../../../../components/TextFieldComponent';
import {displayErrorMsg} from '../../../../utiles/common';

function AddCard({onPressSave, onPressCancel}) {
  const {createToken} = useStripe();
  const [cardDetils, setCardDetils] = useState({});
  const [nameOnCard, setNameOnCard] = useState('');

  const createCardToken = () => {
    const data = {
      ...cardDetils,
      type: 'Card',
      name: nameOnCard,
      currency: 'USD',
    };
    createToken(data)
      .then(response => {
        if (response?.error?.localizedMessage) {
          displayErrorMsg(response?.error?.localizedMessage);
        }
        if (response?.token?.id) {
          onPressSave(response?.token?.id);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View style={{}}>
      <StripeProvider
        publishableKey={stripe.publishableKey}
        // merchantIdentifier="merchant.identifier" // required for Apple Pay
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <TextFieldComponent
          style={styles.txtFiled}
          value={nameOnCard}
          placeholder={'Name on card'}
          onChangeText={text => setNameOnCard(text)}
          onSubmitEditing={() => {}}
          autoCapitalize="words"
          maxLength={100}
          blurOnSubmit={true}
        />
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: 'Card Number',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={styles.container}
          onCardChange={cardDetails => {
            setCardDetils(cardDetails);
          }}
          onFocus={focusedField => {
            console.log('focusField', focusedField);
          }}
        />
        <View style={styles.rowBtnView}>
          <SmallButton
            style={styles.saveBtn(!cardDetils.complete)}
            buttonTitle={'Save'}
            buttonAction={() => createCardToken()}
            disabled={!cardDetils.complete}
          />
          <SmallButton
            style={styles.resetBtn}
            buttonTitle={'Cancel'}
            buttonAction={() => onPressCancel()}
          />
        </View>
      </StripeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '98%',
    height: 50,
    marginTop: getCalculated(35),
    alignSelf: 'center',
    ...commonStyles.shadow,
  },
  rowBtnView: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  saveBtn: disbale => ({
    width: getCalculated(70),
    alignSelf: 'center',
    marginHorizontal: 10,
    backgroundColor: disbale ? COLORS.LIGHTER_GREY : COLORS.BLUE,
  }),
  resetBtn: {
    width: getCalculated(70),
    alignSelf: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    marginHorizontal: 10,
  },
  txtFiled: {
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
  },
});
export default AddCard;
