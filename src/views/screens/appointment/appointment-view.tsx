import _ from 'lodash';
import React from 'react';
import { connect } from "react-redux";
import Screen from 'src/views/components/screen';

import { Title, Text, SubTitle, BaseButton } from 'src/views/components/theme';
import { ScrollView, View, StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import AppointmentReviewModal from 'src/views/components/modals/appointment-review-modal';

import { selectCurrentUser } from 'src/store/selectors/user';
import { Dispatch } from 'redux';
import Avatar from 'src/views/components/theme/avatar';
import User from 'src/models/user';
import { DecoratedAppointment } from 'src/models/appointment';
import WonderAppState from 'src/models/wonder-app-state';

interface AppointmentViewProps {
  currentUser: User;
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: DecoratedAppointment;
}

interface AppointmentViewState {
  isModalOpen: boolean;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({

});

class AppointmentViewScreen extends React.Component<AppointmentViewProps> {
  static navigationOptions = ({ navigation }) => {
    const appointment: DecoratedAppointment = navigation.getParam('appointment', {});
    return {
      title: appointment.match.first_name
    };
  }

  state: AppointmentViewState = {
    isModalOpen: false
  };

  openReviewModal = () => {
    this.setState({ isModalOpen: true });
  }

  closeReviewModal = () => {
    this.setState({ isModalOpen: false });
  }

  render() {
    const { navigation, currentUser } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam('appointment', {});
    return (
      <Screen horizontalPadding={20}>
        <ScrollView
          style={{ flex: 1, paddingTop: 20 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Avatar circle size="lg" uri={_.get(appointment, 'match.images[0].url', null)} />
            <Title>{appointment.match.first_name}</Title>
          </View>
          <Title>{appointment.name}</Title>
          <SubTitle>{appointment.location}</SubTitle>
          <BaseButton title="Leave Review" onPress={this.openReviewModal} />
        </ScrollView>
        <AppointmentReviewModal
          onRequestClose={this.closeReviewModal}
          visible={this.state.isModalOpen}
          currentUser={currentUser}
          appointment={appointment}

        />
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(AppointmentViewScreen);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center'
  }
});