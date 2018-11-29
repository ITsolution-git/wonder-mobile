import _ from 'lodash';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Title, SubTitle, SmallText, Strong, TextButton } from '../theme';

import moment from 'moment-timezone';
import Avatar, { AvatarSize } from 'src/views/components/theme/avatar';
import theme from 'src/assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DecoratedAppointment } from 'src/models/appointment';

import api, { BASE_URL } from 'src/services/api';
import SvgUri from 'react-native-svg-uri';

interface Props {
  item: DecoratedAppointment;
  onPress?: Function;
  callNumber: Function;
}

class AppointmentItem extends React.PureComponent<Props> {
  renderTitle = () => {
    const { item } = this.props;
    const { name, users, event_at, match } = item;

    const now = moment();
    if (moment(event_at).isSameOrAfter(now)) {
      return (
         <Title>
          {_.get(item, 'topic.name', null)}
           at{' '}
          <Strong>{moment(event_at).format('h:mma')}</Strong> with{' '}
          {match.first_name}
        </Title>

      );
    }
    return (
        <Title>{_.get(item, 'topic.name', null)}  with {match.first_name}</Title>
    );
  }

  render() {
    const { item, onPress, callNumber, isPast } = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (onPress) {
            onPress(item);
          }
        }}
      >
        <View style={styles.imageContainer}>
          <Avatar
            circle
            uri={_.get(item, 'match.images[0].url', null)}
            size={AvatarSize.md}
          />
          {isPast &&
                <TextButton
                  text='Leave review'
                  style={styles.reviewBtn}
                  onPress={() => onPress(item)}
                />
           }
        </View>
        <View style={styles.contentContainer}>
          <View style={{ flexDirection: 'row' }}>

          {this.renderTitle()}

          </View>
          <SubTitle>{moment(item.event_at).format('MMMM Do')}</SubTitle>
          <View style={styles.locationRow}>
            <View>
              <Icon
                name='map-marker'
                size={24}
                color={theme.colors.textColorLight}
              />
            </View>
            <View>
              <SmallText style={styles.locationText}>{item.name} - {item.location}</SmallText>
              {item.phone !== null && (
                <TextButton
                  text={item.phone}
                  style={styles.phoneText}
                  onPress={() => callNumber(`tel:${item.phone}`)}
                />
              )}
            </View>
          </View>
          <Text
            style={[
              styles.status,
              {
                color: item.state === 'confirmed' ? 'green' : 'red'
              }
            ]}
          >
            {item.state === 'invited' ? 'unconfirmed' : item.state}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default AppointmentItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  locationRow: { flexDirection: 'row' },
  locationText: { marginLeft: 10 },
  phoneText: {
    fontSize: 10,
    color: 'rgb(0, 122, 255)',
    marginLeft: 10
  },
  status: {
    fontSize: 10,
    alignSelf: 'flex-end'
  },
  reviewBtn: { fontSize: 11, marginTop: 3 },
  iconMargin: {marginRight: 5, marginLeft: 5}
});
