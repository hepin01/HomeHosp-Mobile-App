import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS} from './Common';
import Base from '../screens/Base/Base';

const RowHeight = 40.0;

class Dropdown extends Base {
  constructor(props) {
    super(props);

    const {options, selected, style} = this.props;
    this.state = {
      modalVisible: false,
      arrItems: options,
      selectedItem: selected,
      modalW: style.width,
      modalH: style.height,
      bottomY: 0,
      modalY: 0,
    };

    this.viewSelect = React.createRef();
    this.modalHeight1 = new Animated.Value(170);
  }

  componentWillReceiveProps(newProps) {
    const {options, selected, style} = newProps;

    this.setState({
      arrItems: options,
      selectedItem: selected,
      modalW: style.width,
      modalH: style.height,
    });
  }

  recurringSelected() {
    Animated.timing(this.modalHeight1, {
      toValue: this.state.modalVisible ? 0 : 170,
      duration: 400,
      easing: Easing.linear,
    });
  }

  toggleModal() {
    const {showBelow, maxVisible, options, rowStyle} = this.props;

    this.viewSelect.measure((originX, originY, width, height, pageX, pageY) => {
      const visibleRows = Math.min(maxVisible, options.length);
      const screenHeight = Dimensions.get('window').height;

      const modalHeight = visibleRows * (rowStyle.height || RowHeight) + 3;
      let modalOffsetY = pageY - (modalHeight / 2 - height / 2);

      if (showBelow) {
        modalOffsetY = pageY + height;
      }

      let bottomSpace = screenHeight - (modalOffsetY + modalHeight);
      const minGap = 30;

      if (bottomSpace < minGap) {
        modalOffsetY =
          screenHeight - (modalHeight + 30 + (showBelow ? height : 0));
        bottomSpace = minGap + (showBelow ? height : 0);
      }
      if (modalOffsetY < minGap) {
        modalOffsetY = minGap;
        bottomSpace = screenHeight - (modalOffsetY + modalHeight);
      }
      modalOffsetY += 5;
      const finalWidth = width + 4;
      this.setState(prevState => ({
        modalVisible: !prevState.modalVisible,
        modalW: finalWidth,
        modalH: modalHeight,
        modalY: modalOffsetY,
        bottomY: bottomSpace,
      }));
      this.recurringSelected();
    });
  }

  itemClicked(item, index) {
    const {onSelectItem, rowValueExtractor} = this.props;
    const displayText = rowValueExtractor(item, index);
    this.setState({selectedItem: displayText}, () => {
      setTimeout(() => {
        const props = {
          onSelectItem: onSelectItem(item, index),
        };
        PropTypes.checkPropTypes(
          myPropTypes,
          props,
          'onSelectItem',
          'Dropdown',
        );
        this.setState({modalVisible: false});
      }, 200);
    });
  }

  renderModal() {
    const {
      modalVisible,
      arrItems,
      selectedItem,
      bottomY,
      modalY,
      modalW,
      modalH,
      noItem,
    } = this.state;
    const {
      rowKeyExtractor,
      rowValueExtractor,
      overlayStyle,
      rowStyle,
      selectedRowStyle,
      rowTextStyle,
      selectedRowTextStyle,
      onDropdownClose,
      separatorStyle,
    } = this.props;
    return (
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        style={styles.modal}>
        <View style={commonStyles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              onDropdownClose();
              this.setState({modalVisible: false});
            }}>
            <View style={styles.shadow}>
              <Animated.View
                style={[
                  styles.modalContent,
                  overlayStyle,
                  {
                    marginBottom: bottomY,
                    marginTop: modalY,
                    width: modalW,
                    height: this.modalHeight1,
                  },
                ]}>
                {arrItems.length > 0 ? (
                  <FlatList
                    keyboardShouldPersistTaps="always"
                    data={arrItems}
                    style={[styles.listContent]}
                    keyExtractor={(item, index) => {
                      return rowKeyExtractor(item, index);
                    }}
                    // ItemSeparatorComponent={() => {
                    //     return <View style={[styles.viewSeparator, separatorStyle]} />
                    // }}
                    renderItem={({item, index}) => {
                      const displayText = rowValueExtractor(item, index);
                      return (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => this.itemClicked(item, index)}>
                          <View style={[styles.cellContainer, rowStyle]}>
                            <View
                              style={{
                                width: 3,
                                height: '100%',
                                backgroundColor:
                                  displayText === selectedItem
                                    ? '#0274be'
                                    : 'white',
                                marginLeft: 0,
                              }}></View>
                            <Text
                              style={[
                                styles.cellText,
                                displayText === selectedItem
                                  ? selectedRowTextStyle
                                  : rowTextStyle,
                              ]}>
                              {displayText}
                            </Text>
                          </View>
                          <View
                            style={[styles.viewSeparator, separatorStyle]}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : (
                  <Text
                    style={[
                      styles.cellText,
                      rowTextStyle,
                      {textAlign: 'center', alignSelf: 'center', marginTop: 55},
                    ]}>
                    {'No Result Found'}{' '}
                  </Text>
                )}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }

  render() {
    const {modalVisible, selectedItem} = this.state;
    const {
      style,
      inputTextStyle,
      leftIcon,
      rightIcons,
      placeholder,
      rightIconStyle,
    } = this.props;
    return (
      <View
        style={style}
        onLayout={nativeEvent => {}}
        ref={input => {
          this.viewSelect = input;
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.toggleModal()}
          style={styles.btnToggle}>
          <Image source={leftIcon} style={styles.leftIcon} />
          <Text
            style={[
              styles.inputText,
              inputTextStyle,
              {
                color: selectedItem.length > 0 ? '#333333' : '#aaaaaa',
                textAlignVertical: 'center',
              },
            ]}>
            {selectedItem.length > 0 ? selectedItem : placeholder}
          </Text>
          <Image
            source={modalVisible ? rightIcons[1] : rightIcons[0]}
            style={[styles.rightIcon, rightIconStyle]}
          />
        </TouchableOpacity>
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
    shadowOpacity: 0.51,
    shadowRadius: 1.16,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
  },
  modalContent: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: COLORS.WHITE,
    overflow: 'hidden',
    marginLeft: 6,
  },
  viewSeparator: {
    height: 1,
    backgroundColor: 'rgb(220,220,220)',
  },
  listContent: {
    width: '100%',
    height: '100%',
  },
  cellContainer: {
    flex: 1,
    height: RowHeight,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  cellText: {
    textAlign: 'left',
    fontSize: 14,
    marginLeft: 12,
    textAlignVertical: 'center',
  },
  btnToggle: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputText: {
    marginTop: Platform.OS == 'ios' ? 15 : 0,
    fontSize: 15,
  },
  leftIcon: {
    resizeMode: 'contain',
    width: 12,
    height: 12,
  },
  rightIcon: {
    right: 10,
    position: 'absolute',
    width: 15,
    resizeMode: 'contain',
  },
});

const myPropTypes = {
  showBelow: PropTypes.bool,
  maxVisible: PropTypes.number,
  options: PropTypes.any,
  selected: PropTypes.string,
  onSelectItem: PropTypes.func,
  onDropdownClose: PropTypes.func,
  rowKeyExtractor: PropTypes.func,
  rowValueExtractor: PropTypes.func,
  leftIcon: PropTypes.string,
  rightIcons: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  rowStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  selectedRowStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  rowTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  selectedRowTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  overlayStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  inputTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  rightIconStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default Dropdown;
