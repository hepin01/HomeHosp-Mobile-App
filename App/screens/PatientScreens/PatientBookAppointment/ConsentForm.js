/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import moment from 'moment';
import React from 'react';
import {Linking, Pressable, ScrollView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Checkmark} from '../../../components/Checkmark';
import {commonStyles, COLORS, getCalculated} from '../../../components/Common';
import {SmallButton} from '../../../components/SmallButton';
import {createAppointment} from '../../../networking/APIMethods';
import {getUTCIso} from '../../../utiles/common';
import Base from '../../Base/Base';

class ConsentForm extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isAgree: false,
      doctorsDetails: {
        _id: '62b453b6d2e7c1196f6f8cf5',
        preferredByPatients: [
          '62b45262d2e7c1196f6f8cd6',
          '60acce8f6150464e5c2b86a7',
          '62050f13af323c751df79330',
          '632c7c01a8797c496065e7f5',
          '621d9b3e387b42149ec87c0d',
        ],
        firstname: 'Shubhangi ',
        lastname: 'Provider',
        email: 'shubhangi+789@arkenea.com',
        userType: 'provider',
        providerSubType: ' Pediatric Rehabilitation Medicine',
        providerType: 'Physical Medicine and Rehabilitation',
        providerInformation: {
          gender: 'female',
          dob: '1988-06-13T18:30:00.000Z',
          about: 'This is the doctors profile ',
          city: 'Chicago',
          state: 'Illinois',
          zipcode: '60607',
          country: 'USA',
          prefix: null,
          language: [
            'Chinese',
            'English',
            'French and French Creole',
            'Russian',
          ],
        },
        profileImage: '62b453b6d2e7c1196f6f8cf5-1661776994139.jpeg',
        profileImageS3Link:
          'https://dev-homehosp.s3.amazonaws.com/user-profile-image/62b453b6d2e7c1196f6f8cf5-1661776994139.jpeg?AWSAccessKeyId=AKIASRNKJBHJ65QM7I6Y&Expires=1664426431&Signature=5hlhxkjhQe%2BMSunPwameZOFlBeE%3D',
      },
    };
  }

  componentDidMount() {}

  handleSubmit() {
    // this.showLoader('');
    const {objAppointment, selectedTimeSlots, appointmentDate} = this.props;
    const payload = {
      appointment: {
        ...objAppointment,
        status: 1,
        // slots: selectedTimeSlots,
        updatedAt: getUTCIso(moment()),
        date: getUTCIso(appointmentDate),
        // saveCardForFuture
      },
      timeZone: objAppointment.timeZone,
    };
    createAppointment(
      payload,
      response => {
        this.dismissLoader();
        this.props.navigation.navigate('AppointmentSuccess');
      },
      error => {
        this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  renderDoctorName = () => {
    const {
      doctorsDetails: {firstname, lastname},
    } = this.props;
    return (
      <Text style={commonStyles.Bold125}>
        Dr. {firstname} {lastname}
      </Text>
    );
  };

  renderBold = text => {
    return <Text style={commonStyles.Bold125}>{text}</Text>;
  };

  render() {
    const {isAgree} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.concent}>
          <Text style={styles.contentTitle}>PATIENT PORTAL</Text>
          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <Text>HomeHosp Inc</Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>CONSENT FOR TREATMENT</Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I have selected {this.renderDoctorName()} as my medical provider
              for myself and my minor children as identified to{' '}
              {this.renderDoctorName()}
              (referred to collectively as {this.renderBold(
                '"I", "me"',
              )} and {this.renderBold('"my"')}). I consent to the services,
              treatments, and procedures performed and ordered by my
              physician(s) and other health care providers, which may be
              performed during an episode of care, including, but not limited
              to, those rendered in person and via electronic means
              (collectively, {this.renderBold('Services')}). Such Services may
              include, but are not limited to, physical examination, laboratory
              procedures, x-ray examination, diagnostic procedures, medical,
              nursing, or surgical treatment or procedures, anesthesia, or other
              health care services, such as nutrition and medication advice,
              counseling, and consultation. I understand that my medical care
              and treatment may be provided by a variety of different types of
              health care providers, including physicians, allied health
              professionals, physician assistants, nurses, and counselors, which
              may include students and/or residents of these professions under
              appropriate clinical supervision. I understand that some of the
              health care providers that may become involved with my treatment
              (i) may not be employees of {this.renderDoctorName()}, (ii) may
              bill me separately for their services and may or may not be a
              participating provider with my health plan and/or (iii) may be
              providing Services that are not covered by my health plan. I
              acknowledge that medicine is not an exact science, my diagnosis
              and treatment may involve risk of injury or even death, and no
              guarantees can be made to me as to the results of examinations or
              treatments during any episode of care, and I elect to receive
              Services with full understanding of this information and these
              potential risks.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              CONSENT FOR TREATMENT THROUGH TELEMEDICINE
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I authorize {this.renderDoctorName()}, and health care providers
              and facilities affiliated with {this.renderDoctorName()}, to
              provide the Services to me through the use of telemedicine, which
              involves the provision of health care services using technology,
              including telephonic, chat, and interactive audio-video
              communications, in the course of my diagnosis, treatment, and
              medical care by a health care provider who is at a different
              physical location, and I consent to the receipt of such
              telemedicine services. I understand that telemedicine has many
              benefits, including providing timely access to health care and
              related services, as well as risks, including potential technology
              failures that could interrupt my service or treatment, and
              telehealth should not be used for emergency medical conditions. I
              further acknowledge and understand that professional services
              provided via telemedicine will not be covered by Medicare and may
              not be covered by other third-party payors, and I assume
              responsibility for paying all associated costs. Such non- covered
              expenses include telemedicine service charges if I have a Health
              Savings Account or as otherwise required by applicable law. I
              certify that at the time of my telemedicine visits I will be
              located in the U.S. state or territory that I indicated on the
              “Where are you located?” screen of the HomeHosp website or mobile
              application.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>FINANCIAL GUARANTEE</Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I hereby agree that I am unconditionally personally liable for all
              Services rendered to me or on my behalf by{' '}
              {this.renderDoctorName()}
              and its respective employees and independent contractors during my
              treatment at {this.renderDoctorName()}, whether or not such
              Services are covered by a third party insurance provider
              (in-network or out- of-network), Medicare, Medicaid, Tricare, or
              any other third party payors, to the fullest extent permitted by
              law and {this.renderDoctorName()} ’s other legal or contractual
              obligations. Payment is expected on or before the payment due date
              set forth in the statement or bill. I further acknowledge and
              agree that it is my responsibility to inquire about the costs of
              Services in advance when such costs are unclear to me. I agree to
              provide to
              {this.renderDoctorName()} proof of insurance and identification
              upon request, including potentially before an appointment or
              interaction through which {this.renderDoctorName()} provides
              Services.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              ASSIGNMENT OF INSURANCE BENEFITS & AUTHORIZATION TO FILE INSURANCE
              APPEAL
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I hereby assign to {this.renderDoctorName()} and any other
              providers who provide Services to me any and all rights and
              interests in my insurance benefits and/or entitlements under any
              applicable insurance plan or health plan, and agree to direct my
              insurance carrier or health plan administrator to make all such
              payments directly to {this.renderDoctorName()}. I will not attempt
              to cash or negotiate insurance checks sent directly to me or to
              the insured and further agree to promptly endorse and deliver to
              {this.renderDoctorName()} insurance checks, upon receipt, unless I
              have already paid {this.renderDoctorName()} in full for the
              Services associated with the checks. I am solely responsible for
              any and all applicable co-payments, co-insurance, deductibles,
              and/or charges for non-covered Services provided to me. I agree to
              provide up-to-date and accurate insurance information to Dr.
              Shubhangi Provider. I further authorize {this.renderDoctorName()}{' '}
              to act on my behalf in regard to filing any appeals for insurance.
              If I have any questions regarding this provision, I will contact{' '}
              {this.renderBold('+1')}.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              MEDICARE/MEDICAID PATIENT CERTIFICATION AND ASSIGNMENT OF BENEFIT
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              To the extent applicable, I certify that any information I provide
              in applying for payment under Title XVIII{' '}
              {this.renderBold('"Medicare"')} or Title XIV{' '}
              {this.renderBold('"Medicaid"')} of the Social Security Act is
              correct. I request payment of authorized benefits to be made on my
              behalf to {this.renderDoctorName()}
              or {this.renderDoctorName()}-affiliated physician or other
              provider by the Medicare or Medicaid program. I understand that
              Medicare and Medicaid may not pay for telehealth services provided
              to me at {this.renderDoctorName()}. I hereby attest that I have
              made an informed choice to receive telehealth services with the
              full knowledge and understanding that I will have to pay for these
              services myself if I have a Health Savings Account, and I may
              inquire about the costs of telehealth services in advance of the
              delivery of service if I feel the cost is unclear.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>REVOCATION</Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I understand and agree that this Consent for Treatment and
              Financial Authorization will remain in effect unless I revoke my
              consent in writing, except to the extent that{' '}
              {this.renderDoctorName()} has already taken action in reliance
              upon it. Written revocations must be sent to:{' '}
              {this.renderBold('+1')}. Such revocation will be effective upon
              receipt, but I agree to remain personally liable for all financial
              commitments incurred prior to such revocation. Any prior forms
              regarding consent to treatment or financial authorization that may
              have been executed are replaced by this Consent for Treatment and
              Financial Authorization. I further agree that this form, as
              acknowledged by me, is controlling in any disputes related to the
              above stated terms. If I am completing this document as an
              authorized representative of a patient, i.e., a parent, or other
              guarantor on behalf of a minor child or other patient for whom I
              have authority to act, I confirm by my acknowledgement that I am
              authorized to act on behalf of such patient receiving Services and
              will provide documentation confirming my delegated authority has
              been provided to {this.renderDoctorName()} prior to such patient
              receiving Services. I CERTIFY THAT I HAVE READ, UNDERSTAND, AND
              AGREE TO ALL OF THE TERMS AS INDICATED BY MY ACKNOWLEDGEMENT TO
              EACH SECTION IN THIS CONSENT FOR TREATMENT AND FINANCIAL
              AUTHORIZATION. I FURTHER CERTIFY THAT I AM THE PATIENT, AND/OR
              THAT I AM DULY AUTHORIZED BY THE PATIENT AS THE PATIENT’S
              REPRESENTATIVE, LEGAL GUARDIAN, OR OTHER GUARANTOR, AND BY MY
              ACKNOWLEDGEMENT, I ACCEPT ALL OF THE TERMS ON MY AND THEIR BEHALF
              AND AGREE THAT I/WE SHALL BE LEGALLY BOUND BY THEM. I UNDERSTAND
              THAT (1) THIS EXECUTED CONSENT FOR TREATMENT AND FINANCIAL
              AUTHORIZATION WILL BE AVAILABLE ELECTRONICALLY WITHIN THIS MOBILE
              APPLICATION, (2) A PRINTED COPY OF THIS EXECUTED CONSENT FOR
              TREATMENT AND FINANCIAL AUTHORIZATION CAN BE OBTAINED UPON REQUEST
              FROM {this.renderDoctorName()}, AND (3) {this.renderDoctorName()}{' '}
              MAY REQUEST THAT I EXECUTE A PRINTED COPY OF THIS ELECTRONIC
              CONSENT FOR TREATMENT AND FINANCIAL AUTHORIZATION FOR ITS RECORDS.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              ACKNOWLEDGEMENT OF RECEIPT OF NOTICE OF PRIVACY PRACTICES
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I agree to receive {this.renderDoctorName()}’s HIPAA Notice of
              Privacy Practices (available at https://www.homehosp.com )
              electronically and acknowledge receipt of{' '}
              {this.renderDoctorName()}’s Notice of Privacy Practices, which
              explains how {this.renderDoctorName()} may use and disclose
              (share) my health information. It also explains my health
              information rights.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              CONSENT TO USE AND DISCLOSURE OF SENSITIVE INFORMATION
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I hereby permit and provide my express consent for{' '}
              {this.renderDoctorName()} or third parties who work on behalf of{' '}
              {this.renderDoctorName()} to use, disclose, and/or release my
              health information, including, without limitation, Highly
              Confidential Information (which is defined below), for purposes of
              treatment, payment, health care operations, or other permitted
              purposes described below, to the fullest extent permitted by
              applicable law. “Highly Confidential Information” means
              information about (a) substance use disorder treatment, (b)
              genetic information or test results, (c) mental health or illness
              or developmental or intellectual disability, (d) psychiatric
              treatment, (e) HIV/AIDS testing or treatment or status, (f)
              communicable or blood borne diseases, (g) sexually transmitted
              diseases, (h) child or domestic abuse and neglect, (i) abuse of an
              adult with a disability, (j) sexual assault, (k) maternity records
              (including medical records of new mothers and newborns), (l)
              infertility or fertility assistance, IVF, or artificial
              insemination, and (m) any other type of information that is given
              special privacy protection under state or federal laws.{' '}
              {this.renderDoctorName()} may release my health information to any
              person or entity liable for payment on my behalf in order to
              verify coverage or payment questions, or for any other purpose
              related to benefit payment. {this.renderDoctorName()} may also
              release my health information to my employer’s designee when the
              services delivered are related to a claim under worker’s
              compensation. Without limiting anything set forth above, I hereby
              consent for {this.renderDoctorName()} to use and disclose any
              content of any record of my identity, diagnosis, prognosis, or
              treatment maintained in connection with the performance of any
              program or activity related to substance use education,
              prevention, training, treatment, rehabilitation, or research,
              including, without limitation, substance use disorder-related
              diagnoses, laboratory tests, encounter notes, therapy notes,
              treatments, medications, or claims, (a) to HomeHosp Inc (including
              its employees, agents, legal representatives, and contractors)
              (“Platform Provider”)] to facilitate my use of this app, to case
              managers who are employees, agents, or subcontractors of Platform
              Provider for case management and care coordination, and to my
              health plan to obtain payment for {this.renderDoctorName()}’s
              services and carry out its health care operations and/or (b) for
              purposes of treatment, payment, and health care operations as
              permitted by the Health Insurance Portability and Accountability
              Act and its implementing regulations (“HIPAA”), and I acknowledge
              that any information so disclosed may be redisclosed in accordance
              with HIPAA. I understand that I may revoke this consent at any
              time except to the extent that {this.renderDoctorName()} has taken
              action in reliance on this consent.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              CONSENT TO HEALTH INFORMATION EXCHANGE
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              {this.renderDoctorName()} participates in one or more Health
              Information Exchanges that share medical information to facilitate
              improved care through a comprehensive health record. This
              information is secure and only available to those providers
              involved in my care delivery. I agree that{' '}
              {this.renderDoctorName()} may allow access to my health
              information through the Health Information Exchange for treatment
              or other health care operations. This is a voluntary agreement. I
              understand that I may opt out at any time by contacting{' '}
              {this.renderDoctorName()}.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              CONSENT TO RELEASE OF PROTECTED HEALTH INFORMATION IN EMERGENCY
              SITUATIONS
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I understand that my protected health information (i.e., health
              information that individually identifies me as defined by
              applicable law) may be released as my {this.renderDoctorName()}{' '}
              provider determines appropriate in an emergency situation.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              CONSENT TO TELEPHONE COMMUNICATIONS
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I request to receive confidential communications from{' '}
              {this.renderDoctorName()}at the home, cell, and/or work phone
              numbers for me on record at {this.renderDoctorName()} and/or that
              I have provided to {this.renderDoctorName()} and consent to
              receiving voice messages regarding my protected health information
              at such numbers. I consent to receive requests from{' '}
              {this.renderDoctorName()}, or HomeHosp on behalf of{' '}
              {this.renderDoctorName()}, for HomeHosp app related user feedback
              at such numbers. I consent and agree to receive calls and text
              messages from or on behalf of {this.renderDoctorName()} and its
              partners and affiliates at such phone numbers. These calls and
              text messages may include (but are not limited to) those
              concerning my health care, my account, and insurance, and{' '}
              {this.renderDoctorName()}’s services, and may include marketing
              content. These calls and texts may be placed using automatic
              dialing or pre-recorded/artificial voice technology, and standard
              message or data rates may apply. I understand that my consent is
              voluntary and is not a required condition for receiving care from{' '}
              {this.renderDoctorName()}. I understand that I can unsubscribe at
              any time by contacting {this.renderBold('+1')} or replying “STOP”
              to a text message from {this.renderDoctorName()} or its applicable
              partner or affiliate. I consent and agree that any calls with{' '}
              {this.renderDoctorName()} may be monitored and/or recorded and
              that {this.renderDoctorName()} (or anyone acting on{' '}
              {this.renderDoctorName()}’s behalf) may contact me, from time to
              time, regarding my account (including for collections purposes or
              related to insurance coverage) or regarding my visits with my
              provider.
            </Text>
          </View>
          <View style={styles.contentSubTitle}>
            <Text style={styles.subTitle}>
              CONSENT TO RECEIVE ELECTRONIC COMMUNICATIONS
            </Text>
          </View>
          <View style={styles.contentContaint}>
            <Text style={commonStyles.Regular12}>
              I consent to receive electronic communications from{' '}
              {this.renderDoctorName()} and from HomeHosp on behalf of{' '}
              {this.renderDoctorName()} (e.g., via email, push notification,
              in-app messages, and by posting notices to the HomeHosp website or
              mobile application). I understand that these communications may
              include, but are not limited to, test results and other health
              care information, operational notices about my account (e.g.,
              payment authorizations, password changes, and other transactional
              information), and requests from {this.renderDoctorName()}, or
              HomeHosp on behalf of {this.renderDoctorName()}, for HomeHosp app
              related user feedback, and are part of my relationship with{' '}
              {this.renderDoctorName()} and HomeHosp. I agree that any notices,
              agreements, disclosures, or other communications that{' '}
              {this.renderDoctorName()}or HomeHosp sends to me electronically
              will satisfy any legal communication requirements, including, but
              not limited to, that such communications be in writing. I also
              understand that these communications may include promotional
              communications, including, but not limited to, newsletters,
              information about new services or suggested health screenings,
              special offers, surveys, and other news and information that
              {this.renderDoctorName()} or HomeHosp think may be of interest to
              me. I understand that I may opt out of receiving promotional
              emails at any time by following the unsubscribe instructions
              provided therein. I understand that if I opt out of receiving
              promotional communications from {this.renderDoctorName()} or
              HomeHosp, I may still receive transactional communications,
              including emails about my account or relationship with them. Where
              the HomeHosp app allows for the delivery of “push notifications”,
              I understand that I may opt out of receiving these notifications
              by changing the notification settings for the HomeHosp app on my
              device. By downloading and using the HomeHosp app, I understand
              and agree that I may also receive promotional messages, offers,
              news and information about {this.renderDoctorName()}, HomeHosp, or
              our respective business partners within the HomeHosp app itself. I
              understand that these “in app” messages are part of the HomeHosp
              app’s functionality and cannot be turned off. I understand that if
              I do not want to receive “in app” messages, offers, news, and
              information, I should not download or use the HomeHosp app. I
              CERTIFY THAT I HAVE READ, UNDERSTAND, AND AGREE TO ALL OF THE
              TERMS AS INDICATED BY MY ACKNOWLEDGEMENT TO EACH SECTION IN THESE
              PRIVACY CONSENTS. I FURTHER CERTIFY THAT I AM THE PATIENT, AND/OR
              THAT I AM DULY AUTHORIZED BY THE PATIENT AS THE PATIENT’S
              REPRESENTATIVE, LEGAL GUARDIAN, OR OTHER GUARANTOR, AND BY MY
              ACKNOWLEDGEMENT, I ACCEPT ALL OF THE TERMS ON MY AND THEIR BEHALF
              AND AGREE THAT I/WE SHALL BE LEGALLY BOUND BY THEM. I UNDERSTAND
              THAT (1) THESE EXECUTED PRIVACY CONSENTS WILL BE AVAILABLE
              ELECTRONICALLY WITHIN THIS MOBILE APPLICATION, (2) A PRINTED COPY
              OF THESE EXECUTED PRIVACY CONSENTS CAN BE OBTAINED UPON REQUEST
              FROM {this.renderDoctorName()}, AND (3) {this.renderDoctorName()}{' '}
              AND HOMEHOSP MAY REQUEST THAT I EXECUTE A PRINTED COPY OF THESE
              ELECTRONIC PRIVACY CONSENTS FOR THEIR RECORDS. By clicking “I
              agree,” I authorize HomeHosp to use my contact information to
              communicate with me about opportunities to share testimonials
              about my experience using HomeHosp or to participate in other
              HomeHosp promotional programs. I understand that I may refuse to
              agree to this authorization, and I may revoke this authorization
              at any time, and for any reason. I understand that such refusal or
              revocation will not affect the commencement, continuation, or
              quality of my treatment by the health care providers I connect
              with through HomeHosp. I acknowledge that this authorization will
              be valid for five years from the date on which I provide it unless
              I revoke the authorization sooner. I understand that I may revoke
              this authorization by contacting HomeHosp at
            </Text>
            <View style={styles.contentSubTitle}>
              <Text style={styles.subTitle}>
                {`HomeHosp Inc\n8275 S. Eastern Ave.,Suite 200\nLas Vegas, Nevada 89123\n`}
              </Text>
              <Pressable
                onPress={() => Linking.openURL('mailto:support@homehosp.com')}>
                <Text style={styles.mailTo}>support@homehosp.com</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        <Checkmark
          style={styles.checkMark}
          isChecked={isAgree}
          showCheckbox
          title={'Click to agree'}
          checkmarkAction={() => {
            this.setState({isAgree: !isAgree});
          }}
        />
        <Text style={styles.date}>
          {moment().format('MMM DD, YYYY, hh:mm:ss A')}
        </Text>
        <SmallButton
          buttonTitle={'Submit And Confirm Booking'}
          style={styles.btnDone(!isAgree)}
          disabled={!isAgree}
          buttonAction={() => this.handleSubmit()}
        />
        {this.progressLoader()}
      </View>
    );
  }
}
const mapStateToProps = ({bookedAppointment}) => {
  return {
    doctorsDetails: bookedAppointment.selectedDoctor,
    objAppointment: bookedAppointment.objAppointment,
    appointmentDate: bookedAppointment.appointmentDate,
    selectedTimeSlots: bookedAppointment.selectedTimeSlots,
  };
};
export default connect(mapStateToProps)(ConsentForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getCalculated(15),
    backgroundColor: COLORS.WHITE,
  },
  checkMark: {
    // margin: 15,
    width: '100%',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  btnDone: disabled => ({
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: getCalculated(12),
    paddingHorizontal: getCalculated(13),
    backgroundColor: disabled ? COLORS.LIGHT_GRAY : COLORS.BLUE,
  }),
  date: {
    ...commonStyles.Medium11,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  concent: {
    width: '100%',
    // height: '80%',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  contentTitle: {
    ...commonStyles.Bold125,
  },
  contentSubTitle: {
    marginTop: getCalculated(10),
  },
  contentContaint: {
    marginVertical: getCalculated(10),
  },
  subTitle: {
    ...commonStyles.Bold135,
    textAlign: 'center',
  },
  mailTo: {
    ...commonStyles.Bold135,
    textAlign: 'center',
    color: COLORS.BLUE
  },
});
