import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Title, SubTitle, SmallText, Strong, IconButton, TextButton } from '../theme';
import { DecoratedAppointment } from '../../../types/appointment';
import moment from 'moment-timezone';
import Avatar, { AvatarSize } from '../theme/avatar';
import theme from '../../../assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import TouchableOpacityOnPress from '../../../types/touchable-on-press';

interface Props {
  item: DecoratedAppointment;
  onPress?: Function;
}

class AppointmentItem extends React.Component<Props> {
  renderTitle = () => {
    const { item } = this.props;
    const { name, users, event_at, match = {} } = item;

    const now = moment();
    if (moment(event_at).isSameOrAfter(now)) {
      return (
        <Title>{name} at <Strong>{moment(event_at).format('h:mma')}</Strong> with {match.first_name}</Title>
      );
    }
    return (
      <Title>{name} with {users[0].first_name}</Title>
    );
  }

  render() {
    const { item, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={() => { if (onPress) { onPress(item); } }}>
        <View style={styles.imageContainer}>
          <Avatar
            circle
            uri={item.match.images.length ? item.match.images[0].url : null}
            size={AvatarSize.md}
          />
          <TextButton text="Leave Review" style={{ marginTop: 10, fontSize: 10 }} />
        </View>
        <View style={styles.contentContainer}>
          {this.renderTitle()}
          <SubTitle>{moment(item.event_at).format('Do, MMMM YYYY')}</SubTitle>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={24} color={theme.colors.textColorLight} />
            <SmallText style={styles.locationText}>{item.location}</SmallText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <IconButton
              icon="comments"
              size={24}
              iconSize={24}
              primary={theme.colors.primaryLight}
              secondary="transparent"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default AppointmentItem;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  imageContainer: {
    paddingRight: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 2,
    justifyContent: 'center'
  },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 10 }
});
