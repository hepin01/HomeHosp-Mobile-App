import { Dimensions, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ReactNativeModal from 'react-native-modal';
import { COLORS, commonStyles, getCalculated } from '../../../components/Common';
import moment from 'moment';
import ImageLoader from '../../../components/ImageLoader';
import images from '../../../assets/images';
import { SmallButton } from '../../../components/SmallButton';
import MinCounter from '../../Instant/MinCounter';
import BottomButtons from './BottomButtons';
import TryAgain from './TryAgain';

const PatientRequestCard = ({
    received,
    dob,
    item,
    status,
    intakeId,
    profileImageS3Link,
    sessionType,
    firstname,
    lastname,
    genderLetter,
    paymentSuccessFull,
    isIntakeFormFilled,
    connectCall,
    makePayment,
    resendRequest,
    onRequestResent,
    onPress,
    onToggle,
    onLoading
}) => {
    return (
        <View
            style={{
                paddingHorizontal: getCalculated(5),
                alignSelf: 'center',
                width: Dimensions.get('screen').width / 1.08,
            }}
        >
            <View
                style={[
                    styles.shadow,
                    status == 4 ? { backgroundColor: "rgba(0, 0, 0, 0.1)" } : null
                ]}>
                <View style={[styles.patientMainView]}>
                    <View style={{ borderRadius: 10, justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                        <ImageLoader
                            style={styles.userImage}
                            url={{ uri: profileImageS3Link }}
                            placeholder={images.userdefault}
                        />
                    </View>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            {(status == 4 || status == 6) && (<Text style={styles.txtReqStatus}>{'Request Status:'}</Text>)}

                            <Pressable
                                disabled={!(status == 1 && isIntakeFormFilled && !received)}
                                onPress={() => onPress()} style={[styles.statusbg, {
                                    backgroundColor: status == 0 ? COLORS.BLURBG :
                                        status == 1 ? COLORS.GREENBG :
                                            status == 2 ? COLORS.REDBG :
                                                status == 3 ? COLORS.YELLOWBG :
                                                    status == 4 ? COLORS.WHITE :
                                                        status == 5 ? COLORS.GRAYBG :
                                                            status == 6 ? COLORS.YELLOWBG :
                                                                paymentSuccessFull ? COLORS.BLURBG :
                                                                    null
                                }]}>
                                {item?.instant && (
                                    <Image
                                        style={styles.instantIcon}
                                        source={images.instanticon}
                                    />
                                )}

                                <Text
                                    style={[
                                        commonStyles.RegularLight11,
                                        {
                                            color:
                                                status == 3
                                                    ? COLORS.Orange
                                                    : status == 2
                                                        ? COLORS.RED : status == 6 ? COLORS.Orange
                                                            : status == 4 ? COLORS.LIGHTER_GREY :
                                                                status == 1
                                                                    ? COLORS.GREEN
                                                                    : status == 0
                                                                        ? COLORS.BLUE :
                                                                        paymentSuccessFull ? COLORS.BLUE
                                                                            : COLORS.LIGHTER_GREY,
                                        },
                                    ]}>
                                    {status == 0 ? 'In Process' : null}
                                    {status == 1 ? 'Accepted' : null}
                                    {status == 2 ? 'Rejected' : null}
                                    {status == 3 ? 'In Progress' : null}
                                    {status == 4 ? 'Expired' : null}
                                    {status == 5 ? 'Completed' : null}
                                    {status == 6 ? 'Payment pending' : null}

                                </Text>
                            </Pressable>
                        </View>
                        {sessionType == 'telephonic' && (
                            <View style={styles.audioIconBg}>
                                <Image
                                    style={styles.audioIcon}
                                    source={images.audio}
                                />
                            </View>
                        )}
                        {sessionType == 'video' && (
                            <View style={styles.audioIconBg}>
                                <Image
                                    style={styles.audioIcon}
                                    source={images.video}
                                />
                            </View>
                        )}
                    </View>
                </View>
                <View >
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 15,
                            paddingBottom: 10,
                        }}>
                        <Text style={commonStyles.Medium18}>
                            {'Dr. ' + firstname + ' ' + lastname + ', '}
                            <Text style={commonStyles.Regular115Blue}>
                                {dob
                                    ? genderLetter + '(' + moment().diff(dob, 'years') + ')'
                                    : ''}
                            </Text>
                        </Text>
                    </View>


                    {(received && status == 1 && !intakeId) ? (
                        <View style={styles.bottonLine}>
                            <BottomButtons
                                data={item}
                                onStatusChange={status => onToggle(status)}
                            />
                        </View>
                    ) : null}


                    {(!received && status == 4) ? (
                        <View style={styles.bottonLine}>
                            <TryAgain onPressTryAgain={() => resendRequest()} />
                        </View>
                    ) : null}

                    {(!received && status == 1 && !intakeId) ? (
                        <View style={styles.bottonLine}>
                            <BottomButtons data={item} onStatusChange={() => onRequestResent()} />
                        </View>
                    ) : null}

                    {(intakeId && status == 1) && (
                        <View style={styles.bottonLine}>
                            <SmallButton
                                buttonTitle={'Connect'}
                                whiteBg={false}
                                buttonAction={() => connectCall()}
                                style={styles.connectBtn}
                            />
                        </View>
                    )}

                    {status == 6 && (
                        <View style={styles.bottonLine}>
                            <SmallButton
                                buttonTitle={'Pay $' + item?.price}
                                whiteBg={false}
                                buttonAction={() => makePayment()}
                                style={styles.payBtn}
                            />
                        </View>
                    )}


                    {(received && status == 0) && (
                        <MinCounter
                            data={item}
                            onStatusChange={status => onToggle(status)}
                            setLoading={bool => onLoading(bool)}
                        />
                    )}
                </View>
            </View >
        </View >
    );
};

export default PatientRequestCard;

const styles = StyleSheet.create({
    shadow: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.BORDERBG,
        // elevation: 5,
    },
    patientMainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: getCalculated(5),
        paddingRight: 10,
        paddingTop: 10
    },
    userImage: {
        width: getCalculated(41),
        height: getCalculated(41),
        borderRadius: 40,
    },

    instantIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        alignSelf: 'center',
        // marginTop: -2,
        // marginLeft: 10,
    },
    audioIconBg: {
        alignSelf: "flex-end",
        borderRadius: 4,
    },
    audioIcon: { width: 18, height: 18, resizeMode: 'contain' },
    statusbg: { marginTop: 2, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" },
    bottonLine: {
        backgroundColor: COLORS.BLURBG,
        width: "100%",
        paddingHorizontal: 15,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    line: {
        height: 2,
        width: '100%',
        backgroundColor: '#ebf4f8',
        // marginTop: getCalculated(11),
        // marginBottom: getCalculated(8),
    },
    note: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    info: {
        width: getCalculated(18),
        height: getCalculated(18),
    },
    txtNote: {
        ...commonStyles.RegularLight11,
        width: '90%',
        alignSelf: 'center',
        marginLeft: getCalculated(6),
    },
    connectBtn: { width: '50%', height: 40, alignSelf: 'flex-start' },
    payBtn: { width: '30%', height: 40, alignSelf: 'flex-start' },
    buttonTextStyle: { fontSize: 12 },
    txtReqStatus: {
        marginTop: 6,
        paddingRight: 5,
        fontSize: 13
    },

});
