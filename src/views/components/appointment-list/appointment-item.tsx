import _ from "lodash";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import {
  Text,
  Title,
  SubTitle,
  SmallText,
  Strong,
  TextButton,
} from "../theme";

import moment from "moment-timezone";
import Avatar, { AvatarSize } from "src/views/components/theme/avatar";
import theme from "src/assets/styles/theme";
import Icon from "react-native-vector-icons/FontAwesome";
import { DecoratedAppointment } from "src/models/appointment";

interface Props {
  item: DecoratedAppointment;
  onPress?: Function;
  callNumber: Function;
}

class AppointmentItem extends React.Component<Props> {
  renderTitle = () => {
    const { item } = this.props;
    const { name, users, event_at, match } = item;

    const now = moment();
    if (moment(event_at).isSameOrAfter(now)) {
      return (
        <Title>
          {_.get(item, "topic.name", null)} at <Strong>{moment(event_at).format("h:mma")}</Strong> with{" "}
          {match.first_name}
        </Title>
      );
    }
    return (
      <Title>
        {name} with {match.first_name}
      </Title>
    );
  }

  render() {
    const { item, onPress, callNumber } = this.props;

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
            uri={_.get(item, "match.images[0].url", null)}
            size={AvatarSize.md}
          />
        </View>
        <View style={styles.contentContainer}>
          {this.renderTitle()}
          <SubTitle>{moment(item.event_at).format("Do, MMMM")}</SubTitle>
          <View style={styles.locationRow}>
            <View>
              <Icon
                name="map-marker"
                size={24}
                color={theme.colors.textColorLight}
              />
            </View>
            <View>
              <SmallText style={styles.locationText}>{item.location}</SmallText>
              {item.phone && <TextButton
                text={item.phone}
                style={styles.phoneText}
                onPress={() => callNumber(`tel:${item.phone}`)}
              />}
            </View>
          </View>
          <Text
            style={[styles.status, {
              color: item.state === 'confirmed' ? 'green' : 'red'
            }]}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    paddingRight: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 2,
    justifyContent: "center"
  },
  locationRow: { flexDirection: "row" },
  locationText: { marginLeft: 10 },
  phoneText: {
    fontSize: 10,
    color: Platform.OS === 'ios' ? 'rgb(0, 122, 255)' : '#16a085',
    marginLeft: 10
  },
  status: {
    fontSize: 10,
    alignSelf: 'flex-end',
  }
});
