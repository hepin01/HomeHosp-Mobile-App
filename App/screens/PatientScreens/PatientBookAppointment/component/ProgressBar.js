import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  commonStyles,
  COLORS,
  getCalculated,
} from '../../../../components/Common';
// const containerWidth = (Dimensions.get('screen').width * 0.08) *2;
const containerWidth = Dimensions.get('screen').width * 0.08;
// const containerWidth = 30;
const ProgressBar = ({currentStep, showFindProvider = true}) => {
  const findProvider = {
    id: 4,
    stepTitle: 4,
    step: 5,
    label: 'Find Providers',
    isCompleted: false,
  };
  const steps = [
    {
      id: 1,
      stepTitle: 1,
      step: 1,
      label: 'Appointment',
      isCompleted: true,
    },
    {
      id: 2,
      stepTitle: 2,
      step: 2,
      label: 'Intake Form',
      isCompleted: false,
    },
    {
      id: 3,
      stepTitle: 3,
      step: 4,
      label: 'Payment Info',
      isCompleted: false,
    },
  ];
  const [arrSteps, setArrSteps] = useState(steps);

  useEffect(() => {
    const newSteps = steps;
    if (showFindProvider) {
      newSteps.push(findProvider);
    }
    const modSteps = newSteps.map(item => {
      if (currentStep >= item.step) {
        return {
          ...item,
          isCompleted: true,
        };
      }
      return item;
    });
    setArrSteps(modSteps);
  }, [currentStep]);

  const lastIndex = arrSteps.length - 1;
  function numberContainer(item, index) {
    const {id, step, label, isCompleted, stepTitle} = item;
    const activeLeftSegment = currentStep >= item.step;
    const activeRightSegment =
      currentStep !== item.step && currentStep >= item.step;
    return (
      <View key={id.toString()}>
        <View style={styles.stepContainer}>
          <View style={styles.connectors}>
            {index != 0 ? (
              <View style={styles.line(activeLeftSegment)} />
            ) : (
              <View style={styles.emptyView} />
            )}
            <View style={styles.numberContainer(isCompleted)}>
              <Text style={styles.textStep}>{stepTitle}</Text>
            </View>
            {lastIndex != index ? (
              <View style={styles.line(activeRightSegment)} />
            ) : (
              <View style={styles.emptyView} />
            )}
          </View>
          <View style={{}}>
            <Text style={styles.textStepLabel(isCompleted)}>{label}</Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {arrSteps.map((item, index) => {
        return numberContainer(item, index);
      })}
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberContainer: active => ({
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    width: getCalculated(21),
    height: getCalculated(21),
    backgroundColor: active ? COLORS.BLUE : COLORS.LIGHT_GRAY,
  }),
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStep: {
    ...commonStyles.Regular11White,
  },
  textStepLabel: active => ({
    flexWrap: 'wrap',
    textAlign: 'center',
    marginTop: getCalculated(6),
    ...commonStyles.RegularDark11,
    color: active ? COLORS.BLUE : COLORS.LIGHT_GRAY,
    fontSize: getCalculated(10),
  }),
  line: active => ({
    width: containerWidth,
    height: 2,
    backgroundColor: active ? COLORS.BLUE : COLORS.LIGHT_GRAY,
  }),
  connectors: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    width: containerWidth,
  },
});
