import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';

import {COLORS, getCalculated} from './Common';
import images from '../assets/images';

const ImageLoader = props => {
  const {url, placeholder} = props;
  const [loading, setLoading] = useState(false);
  const [imagerURI, setImageURI] = useState(placeholder);

  useEffect(() => {
    if (url?.uri?.length) setImageURI(url);
  }, [url]);

  const handleonError = e => {
    setLoading(false);
    setImageURI(placeholder);
  };

  return (
    <View>
      <Image
        {...props}
        source={imagerURI}
        style={[{backgroundColor: COLORS.WHITE}, {...props.style}]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={({error}) => handleonError(error)}
      />
      {loading ? (
        <ActivityIndicator
          animating={loading}
          style={styles.loader}
          hidesWhenStopped={loading}
          color={COLORS.BLUE}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  img: {
    height: getCalculated(57),
    width: getCalculated(57),
  },
});

export default  React.memo(ImageLoader);
