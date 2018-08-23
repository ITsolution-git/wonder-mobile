import React from 'react';
import _ from 'lodash';
import { Modal, View, ModalProps, StyleSheet, Platform, ScrollView } from 'react-native';
import { Text, TextArea, Title, SubTitle, Strong, Label, PrimaryButton, TextButton } from '../theme';

import Avatar from '../theme/avatar';
import { Card, CardItem, Body, Content } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import theme from 'src/assets/styles/theme';
import BooleanToggle from '../theme/boolean-toggle';
import StarRatingInput from '../theme/star-rating-input';
import { DecoratedAppointment } from 'src/models/appointment';
import User from 'src/models/user';

interface AppointmentReviewModalProps extends ModalProps {
  currentUser: User;
  appointment: DecoratedAppointment;
}

interface AppointmentReviewModalState {
  // isModalOpen: boolean;
}

class AppointmentReviewModal extends React.Component<AppointmentReviewModalProps, AppointmentReviewModalState> {
  state: AppointmentReviewModalState = {
    // isModalOpen: false
  };

  render() {
    const { appointment, currentUser, ...rest } = this.props;
    return (
      <Modal {...rest} animationType="fade" transparent>
        <LinearGradient colors={[theme.colors.cottonCandyBlue, theme.colors.cottonCandyPink]} style={styles.modal}>
          <Content>
            <Card style={styles.container}>
              <CardItem header style={styles.header}>
                <Title style={{ textAlign: 'center' }}>
                  We are <Strong>Wonder&apos;N</Strong>{'\n'}how your date went?
                </Title>

                <View style={styles.userAvatarContainer}>
                  <Avatar circle size="md" uri={_.get(appointment, 'match.images[0].url', null)} />
                  <SubTitle style={{ textAlign: 'center' }}>{appointment.match.first_name}</SubTitle>
                </View>
              </CardItem>
              <CardItem>
                <View style={styles.body}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Did {appointment.match.first_name} Flake?</Text>
                    <BooleanToggle />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Hows was {appointment.name}?</Text>
                    <StarRatingInput />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Did {appointment.match.first_name} look like their photos?</Text>
                    <BooleanToggle />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Did {appointment.match.first_name} fib about anything? (Height, Weight, etc.)
                    </Text>
                    <BooleanToggle />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Do you want to setup another wonder with {appointment.match.first_name}?
                    </Text>
                    <BooleanToggle />
                  </View>
                  <View style={[styles.row, { alignItems: undefined }]}>
                    <TextArea
                      placeholder="Tell us more! How&apos;d it go?"
                      style={{ flex: 1, minHeight: 150 }}
                    />
                  </View>
                </View>
              </CardItem>
              <CardItem footer style={styles.footer}>
                <View>
                  <Label style={{ textAlign: 'center' }}>
                    All feedback is anonymous and used to improve Wonder for you!
                  </Label>
                </View>
                <PrimaryButton title="Submit" onPress={_.noop} />
                <TextButton style={{ marginTop: 10 }} text="Cancel" onPress={this.props.onRequestClose} />
              </CardItem>
            </Card>
          </Content>
        </LinearGradient>
      </Modal>
    );
  }
}

export default AppointmentReviewModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5
  },
  header: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'column',
    alignItems: 'center'
  },
  footer: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    flexDirection: 'column'
  },
  userAvatarContainer: {
    marginTop: 15
  },
  body: {},
  label: {
    textAlign: 'center'
  },
  row: {
    width: '100%',
    alignItems: 'center'
  }
});
