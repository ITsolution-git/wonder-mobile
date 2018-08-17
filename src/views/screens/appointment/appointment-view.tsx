import React from 'react';
import { connect } from "react-redux";
import Screen from '../../components/screen';
import { DecoratedAppointment } from '../../../types/appointment';
import { Title, Text } from '../../components/theme';
import { ScrollView } from 'react-native';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

interface AppointmentViewProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: DecoratedAppointment;
}

class AppointmentViewScreen extends React.Component<AppointmentViewProps> {
  static navigationOptions = ({ navigation }) => {
    const appointment: DecoratedAppointment = navigation.getParam('appointment', {});
    return {
      title: appointment.match.first_name
    };
  }
  render() {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam('appointment', {});
    return (
      <Screen horizontalPadding={20}>
        <Title>Appointment</Title>
        <Text>This still needs to be designed, so here is the appointment data in the meantime</Text>
        <ScrollView
          style={{ flex: 1, borderTopColor: '#DDD', borderTopWidth: 3, paddingTop: 20 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <Text>{JSON.stringify(appointment, null, 2)}</Text>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect()(AppointmentViewScreen);
