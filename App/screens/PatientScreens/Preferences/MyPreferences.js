/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import images from '../../../assets/images';
import { AlertModal } from '../../../components/AlertModal';
import { commonStyles, COLORS, getCalculated } from '../../../components/Common';
import { SelectiveDropdown } from '../../../components/SelectiveDropdown';
import { SuccessModal } from '../../../components/SuccessModal';
import {
  getLanguages,
  getPreferredProviders,
  toggleProviderPrefference,
} from '../../../networking/APIMethods';
import { displayErrorMsg, userId } from '../../../utiles/common';
import Base from '../../Base/Base';
import PreferencesCell from './PreferencesCell';

class MyPreferences extends Base {
  constructor(props) {
    super(props);
    this.state = {
      languagesArray: [],
      languages: [],
      doctorsArray: [],
      showSuccess: false,
      showAlert: false,
      qaItemId: null,
      fetch: true,
      refreshing: false,
    };
  }
  componentDidMount() {
    this.getLanguages();
    this.fetchReferredProviders();
  }

  getLanguages() {
    // this.showLoader('');
    getLanguages(
      response => {
        var langs = [];
        response.map((item, index) => (langs = [...langs, item]));
        this.setState({ languages: langs });
        // this.dismissLoader();
      },
      error => {
        // this.dismissLoader();
      },
    );
  }

  fetchReferredProviders() {
    this.showLoader('');
    this.setState({ fetch: true }, () => {
      const payload = {
        userId: userId(),
        language: this.state.languagesArray,
      };
      getPreferredProviders(
        payload,
        response => {
          this.dismissLoader();
          this.setState({
            fetch: false,
            refreshing: false,
            doctorsArray: response,
          });
        },
        error => {
          this.dismissLoader();
          this.setState({ fetch: false, refreshing: false });
          displayErrorMsg(error);
        },
      );
    });
  }

  removePreferedDoctor = () => {
    this.setState({ fetch: true }, () => {
      const payload = {
        userId: userId(),
        providerId: this.state.qaItemId,
        preferred: false,
      };
      toggleProviderPrefference(
        payload,
        response => {
          this.setState({ showSuccess: true });
        },
        error => {
          this.setState({ fetch: false, refreshing: false });
          displayErrorMsg(error);
        },
      );
    });
  };

  checkAvailability(item, index) {
    this.props.navigation.navigate('SessionSlots', {
      doctorDetails: item,
    });
  }

  deleteItem() {
    this.setState(
      {
        showAlert: false,
      },
      () => {
        this.removePreferedDoctor();
      },
    );
  }

  QuickActions(index, qaItem) {
    return (
      <Pressable
        style={styles.qaContainer}
        onPress={() => {
          this.setState({
            showAlert: true,
            qaItemId: qaItem?._id,
          });
        }}>
        <View style={styles.button}>
          <View>
            <Image style={styles.deleteIcon} source={images.deleteicon} />
          </View>
        </View>
      </Pressable>
    );
  }

  showLanguagesAdded() {
    const { languagesArray } = this.state;
    let langs = languagesArray?.map((element, index) => {
      return (
        <View style={[styles.specialityTst, styles.shadow]} key={index}>
          <Text
            style={[commonStyles.Medium125, { marginRight: 10 }]}
            key={index + 1}>
            {element}
          </Text>
          <Pressable
            onPress={() => {
              const reducedArr = [...languagesArray];
              reducedArr.splice(index, 1);
              this.setState({ languagesArray: reducedArr }, () =>
                this.fetchReferredProviders(),
              );
            }}
            style={styles.closeBtn}
            key={index + 2}>
            <Image style={styles.closeBtnImage} source={images.closemerged} />
          </Pressable>
        </View>
      );
    });
    return <View style={styles.languageView}>{langs}</View>;
  }

  render() {
    const {
      fetch,
      languages,
      languagesArray,
      doctorsArray,
      showSuccess,
      showAlert,
      qaItemId,
    } = this.state;
    return (
      <View style={commonStyles.container}>
        <SwipeableFlatList
          style={styles.flatList}
          maxSwipeDistance={100}
          contentContainerStyle={{ paddingBottom: 200 }}
          renderQuickActions={({ index, item }) => this.QuickActions(index, item)}
          shouldBounceOnMount={true}
          data={doctorsArray}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={{ width: '100%', marginBottom: 10 }}>
              <Text style={[commonStyles.Bold15, styles.titleStyle]}>
                {'First Preferred Language'}
              </Text>
              <Text style={[commonStyles.Regular12, styles.labelStyle]}>
                {'Select Languages'}
              </Text>
              <SelectiveDropdown
                style={{ marginHorizontal: 15 }}
                list={languages.map((item, index) => item?.fullName)}
                value={'Select'}
                onSelect={(selectedItem, index) => {
                  if (!languagesArray.includes(selectedItem)) {
                    this.setState(
                      {
                        languagesArray: [...languagesArray, selectedItem],
                      },
                      () => this.fetchReferredProviders(),
                    );
                  }
                }}
              />
              {this.showLanguagesAdded()}
              <Text style={[commonStyles.Bold15, styles.titleStyle]}>
                {'My Preferred Doctors'}
              </Text>
              <Text style={[commonStyles.Regular135, styles.titleStyle]}>
                {
                  'The system will prefer to connect you with your preferred doctors for the appointment based on their availability.'
                }
              </Text>
            </View>
          )}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.docCellView, styles.shadow]} key={index}>
                <PreferencesCell
                  data={item}
                  onPressCell={() => { }}
                  onCheck={() => {
                    this.checkAvailability(item, index);
                  }}
                />
              </View>
            );
          }}
          ListEmptyComponent={() => {
            if (!fetch && doctorsArray.length == 0) {
              return (
                <View style={styles.ListEmptyComponent}>
                  <Image source={images.patientnodatafound} style={styles.noDataImage} resizeMode="contain" />
                  <Text style={commonStyles.Medium135}>No Records Found</Text>
                </View>
              );
            }
            return null;
          }}
        />

        {showSuccess && (
          <SuccessModal
            image={images.userremovedcircle}
            title={'Success'}
            message={'Doctor have been removed successfully'}
            rightButtonTitle={'Okay'}
            buttonAction={() =>
              this.setState({ showSuccess: false }, () =>
                this.fetchReferredProviders(),
              )
            }
          />
        )}
        {showAlert && qaItemId ? (
          <AlertModal
            title="Remove Doctor?"
            message="Are you sure you want to remove the doctor from your preferred list?"
            leftButtonAction={() => {
              this.setState({ showAlert: false });
            }}
            leftButtonTitle="No"
            rightButtonAction={() => {
              this.deleteItem();
            }}
            rightButtonTitle="Yes"
            closeBtnAction={() => {
              this.setState({ showAlert: false });
            }}
          />
        ) : null}
        {this.progressLoader()}
      </View>
    );
  }
}

export default MyPreferences;

const styles = StyleSheet.create({
  flatList: { width: '100%' },
  titleStyle: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.DARK_GRAY,
  },
  labelStyle: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.LIGHTER_GREY,
  },
  saveBtn: { width: getCalculated(60), alignSelf: 'center', marginTop: 20 },
  languageView: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 20,
    alignSelf: 'center',
  },
  specialityTst: {
    width: 'auto',
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 'auto',
    margin: 7,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
  },
  closeBtnImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 3,
    right: 0,
    width: 20,
    height: 20,
  },
  docCellView: {
    width: '90%',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 7,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.65,
    elevation: 5,
  },
  qaContainer: {
    height: '92%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginRight: 20,
  },
  button: {
    width: '30%',
    // borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.DELETEBG,
  },
  deleteIcon: {
    resizeMode: 'contain',
    resizeMethod: 'resize',
    width: getCalculated(18),
    height: getCalculated(23),
  },
  ListEmptyComponent: {
    width: '100%',
    height: Dimensions.get('screen').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});
