import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, WebView } from "react-native";
import { Text } from "src/views/components/theme";

import PricingIndicator from "src/views/components/pricing-indicator";
import Activity from "src/models/activity";
import Wonder from "../../components/theme/wonder/wonder";
import api, { BASE_URL } from "src/services/api";
import SvgUri from "react-native-svg-uri";

interface Props {
  activity: Activity;
  // onPress: TouchableOpacityOnPress;
}

class ActivityCallout extends React.Component<Props> {
  renderImage = () => {
    const { activity } = this.props;
    if (activity.image_url && activity.image_url.length) {
      return (
        <View flex={2} style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6, overflow: "hidden" }}>
          {<Image source={{ uri: activity.image_url }} style={{ flex: 1 }} />}
        </View>
      );
    }
  }
  render() {
    const { activity } = this.props;

    return (
      <View style={{ height: 110, width: 300, flexDirection: "row", padding: 0, justifyContent: "space-between", borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
        {this.renderImage()}
        <View flex={3} style={{ flexDirection: "row", backgroundColor: "#fff", borderRadius: 6 }}>
          <View style={{ flex: 4, padding: 4 }}>
            <Text style={styles.title}>{activity.name}</Text>
            <Text style={styles.address}>{activity.location.join("\n")}</Text>
            <Text style={styles.address}>{activity.price_level}</Text>
            <Text style={styles.address}>{activity.distance.toFixed(2)}</Text>
            <PricingIndicator rating={activity.price_level} />
          </View>
          <View style={{ flex: 1, padding: 4, alignItems: "center", justifyContent: "space-between", borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
            <SvgUri
              height={18}
              width={18}
              source={{ uri: `${BASE_URL}/${activity.topic.icon}` }}
            />
            <Text style={styles.address}>16m</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default ActivityCallout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 250,
    maxHeight: 100,
    flexDirection: "row",
  },
  body: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 14,
    marginBottom: 3,
  },
  address: {
    fontSize: 11,
    lineHeight: 12,
  },
});

    // <View style={styles.container}>
    //     {this.renderImage()}
    //     <View flex={3} style={styles.body}>
          // <Wonder
          //   topic={activity.topic}
          //   size={60}
          //   noText={true}
          // />
    //       <Text style={styles.title}>{activity.name}</Text>
          // <Text style={styles.address}>{activity.location.join("\n")}</Text>
          // <Text style={styles.address}>{activity.price_level}</Text>
          // {/* <Text style={styles.address}>{activity.distance.toFixed(2)}</Text> */}
          // <PricingIndicator rating={activity.price_level} />
    //     </View>
    //   </View>
