import _ from "lodash";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Button } from "react-native";
import {
  Text,
  Title,
  SubTitle,
  SmallText,
  Strong,
  IconButton,
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
}

class AppointmentItem extends React.Component<Props> {
  renderTitle = () => {
    const { item } = this.props;
    const { name, users, event_at, match } = item;

    const now = moment();
    if (moment(event_at).isSameOrAfter(now)) {
      return (
        <Title>
          {name} at <Strong>{moment(event_at).format("h:mma")}</Strong> with{" "}
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
          <SubTitle>{moment(item.event_at).format("Do, MMMM YYYY")}</SubTitle>
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
              <TextButton
                text="3125229305"
                style={{ fontSize: 10, color: 'lightblue', marginLeft: 10 }}
                onPress={() => callNumber('tel:+13125229305')}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 10,
              alignSelf: 'flex-end',
              textTransform: 'uppercase',
              color: item.state === 'confirmed' ? 'green' : 'red'
            }}
          >
            {item.state === 'confirmed' ? 'CONFIRM' : 'UNCONFIRMED'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
// btnStyle, text, onPress, style, align, color, size
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
  locationText: { marginLeft: 10 }
});
