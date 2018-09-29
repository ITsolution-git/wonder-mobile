import React from "react";
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView
} from "react-native";
import theme from "../../../assets/styles/theme";
import { PrimaryButton } from "src/views/components/theme";

interface Props {
  visible: boolean;
  onRequestClose: Function;
}

const PrivacyPolicyModal = (props: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}
      onRequestClose={() => props.onRequestClose}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 24,
              marginBottom: 10,
              color: theme.colors.textColor,
              fontWeight: "bold"
            }}
          >
            Privacy Policy
          </Text>
          <Text style={{ lineHeight: 20, color: theme.colors.textColor }}>
            Protecting your private information is our priority. This Statement
            of Privacy applies to getwonderapp.com and Wonder and governs data
            collection and usage. For the purposes of this Privacy Policy,
            unless otherwise noted, all references to Wonder include
            getwonderapp.com. The Wonder website is a dating site. By using the
            Wonder website, you consent to the data practices described in this
            statement. Collection of your Personal Information   Wonder may also
            collect anonymous demographic information, which is not unique to
            you, such as your: We do not collect any personal information about
            you unless you voluntarily provide it to us. However, you may be
            required to provide certain personal information to us when you
            elect to use certain products or services available on the Site.
            These may include: (a) registering for an account on our Site; (b)
            entering a sweepstakes or contest sponsored by us or one of our
            partners; (c) signing up for special offers from selected third
            parties; (d) sending us an email message; (e) submitting your credit
            card or other payment information when ordering and purchasing
            products and services on our Site. To wit, we will use your
            information for, but not limited to, communicating with you in
            relation to services and/or products you have requested from us. We
            also may gather additional personal or non-personal information in
            the future.   Use of your Personal Information Wonder collects and
            uses your personal information to operate its website(s) and deliver
            the services you have requested. Wonder may also use your personally
            identifiable information to inform you of other products or services
            available from Wonder and its affiliates.   Sharing Information with
            Third Parties Wonder does not sell, rent or lease its customer lists
            to third parties.   Wonder may, from time to time, contact you on
            behalf of external business partners about a particular offering
            that may be of interest to you. In those cases, your unique
            personally identifiable information (e-mail, name, address,
            telephone number) is transferred to the third party. Wonder may
            share data with trusted partners to help perform statistical
            analysis, send you email or postal mail, provide customer support,
            or arrange for deliveries. All such third parties are prohibited
            from using your personal information except to provide these
            services to Wonder, and they are required to maintain the
            confidentiality of your information.   Wonder may disclose your
            personal information, without notice, if required to do so by law or
            in the good faith belief that such action is necessary to: (a)
            conform to the edicts of the law or comply with legal process served
            on Wonder or the site; (b) protect and defend the rights or property
            of Wonder; and/or (c) act under exigent circumstances to protect the
            personal safety of users of Wonder, or the public.   Tracking User
            Behavior Wonder may keep track of the websites and pages our users
            visit within Wonder, in order to determine what Wonder services are
            the most popular. This data is used to deliver customized content
            and advertising within Wonder to customers whose behavior indicates
            that they are interested in a particular subject area. Automatically
            Collected Information Information about your computer hardware and
            software may be automatically collected by Wonder. This information
            can include: your IP address, browser type, domain names, access
            times and referring website addresses. This information is used for
            the operation of the service, to maintain quality of the service,
            and to provide general statistics regarding use of the Wonder
            website.   Use of Cookies The Wonder website may use "cookies" to
            help you personalize your online experience. A cookie is a text file
            that is placed on your hard disk by a web page server. Cookies
            cannot be used to run programs or deliver viruses to your computer.
            Cookies are uniquely assigned to you, and can only be read by a web
            server in the domain that issued the cookie to you. One of the
            primary purposes of cookies is to provide a convenience feature to
            save you time. The purpose of a cookie is to tell the Web server
            that you have returned to a specific page. For example, if you
            personalize Wonder pages, or register with Wonder site or services,
            a cookie helps Wonder to recall your specific information on
            subsequent visits. This simplifies the process of recording your
            personal information, such as billing addresses, shipping addresses,
            and so on. When you return to the same Wonder website, the
            information you previously provided can be retrieved, so you can
            easily use the Wonder features that you customized.   You have the
            ability to accept or decline cookies. Most Web browsers
            automatically accept cookies, but you can usually modify your
            browser setting to decline cookies if you prefer. If you choose to
            decline cookies, you may not be able to fully experience the
            interactive features of the Wonder services or websites you visit.
            Links This website contains links to other sites. Please be aware
            that we are not responsible for the content or privacy practices of
            such other sites. We encourage our users to be aware when they leave
            our site and to read the privacy statements of any other site that
            collects personally identifiable information.   Security of your
            Personal Information Wonder secures your personal information from
            unauthorized access, use, or disclosure. Wonder uses the following
            methods for this purpose:    - SSL Protocol   When personal
            information (such as a credit card number) is transmitted to other
            websites, it is protected through the use of encryption, such as the
            Secure Sockets Layer (SSL) protocol.   We strive to take appropriate
            security measures to protect against unauthorized access to or
            alteration of your personal information. Unfortunately, no data
            transmission over the Internet or any wireless network can be
            guaranteed to be 100% secure. As a result, while we strive to
            protect your personal information, you acknowledge that: (a) there
            are security and privacy limitations inherent to the Internet which
            are beyond our control; and (b) security, integrity, and privacy of
            any and all information and data exchanged between you and us
            through this Site cannot be guaranteed.   Children Under Thirteen
            Wonder does not knowingly collect personally identifiable
            information from children under the age of thirteen. If you are
            under the age of thirteen, you must ask your parent or guardian for
            permission to use this website.   Opt-Out &amp; Unsubscribe from
            Third Party Communications We respect your privacy and give you an
            opportunity to opt-out of receiving announcements of certain
            information. Users may opt-out of receiving any or all
            communications from third-party partners of Wonder by contacting us
            here: - Web page: www.getwonderapp.com/contactus - Email:
            contactus@getwonderapp.com - Phone: _________________   E-mail
            Communications From time to time, Wonder may contact you via email
            for the purpose of providing announcements, promotional offers,
            alerts, confirmations, surveys, and/or other general communication.
            In order to improve our Services, we may receive a notification when
            you open an email from Wonder or click on a link therein.   If you
            would like to stop receiving marketing or promotional communications
            via email from Wonder, you may opt out of such communications by
            unsubscribe@getwonderapp.com. External Data Storage Sites We may
            store your data on servers provided by third party hosting vendors
            with whom we have contracted.   Changes to this Statement Wonder
            reserves the right to change this Privacy Policy from time to time.
            We will notify you about significant changes in the way we treat
            personal information by sending a notice to the primary email
            address specified in your account, by placing a prominent notice on
            our site, and/or by updating any privacy information on this page.
            Your continued use of the Site and/or Services available through
            this Site after such modifications will constitute your: (a)
            acknowledgment of the modified Privacy Policy; and (b) agreement to
            abide and be bound by that Policy.   Contact Information Wonder
            welcomes your questions or comments regarding this Statement of
            Privacy. If you believe that Wonder has not adhered to this
            Statement, please contact Wonder at:   Wonder 4500 Woodman Avenue
            C301 Sherman Oaks, California 91423   Email Address:
            integriteecorp@gmail.com   Telephone number: 3106016743   Effective
            as of July 21, 2018  {" "}
          </Text>
          <View style={{ margin: 10 }}>
            <PrimaryButton title="Close" onPress={props.onRequestClose} />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 20,
    marginTop: 60
  }
});
