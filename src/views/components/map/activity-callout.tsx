import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, WebView } from 'react-native';
import { Text } from 'src/views/components/theme';

import PricingIndicator from 'src/views/components/pricing-indicator';
import Activity from 'src/models/activity';

interface Props {
  activity: Activity;
  // onPress: TouchableOpacityOnPress;
}

class ActivityCallout extends React.Component<Props> {
  renderImage = () => {
    const { activity } = this.props;
    if (activity.image_url && activity.image_url.length) {
      return (
        <View flex={2}>
          {<Image source={{ uri: activity.image_url }} style={{ flex: 1 }} />}
        </View>
      );
    }
  }
  render() {
    const { activity } = this.props;
    return (
      <View style={styles.container}>
        {this.renderImage()}
        <View flex={3} style={styles.body}>
          <Text style={styles.title}>{activity.name}</Text>
          <Text style={styles.address}>{activity.location.join('\n')}</Text>
          <Text style={styles.address}>{activity.price_level}</Text>
          {/* <Text style={styles.address}>{activity.distance.toFixed(2)}</Text> */}
          <PricingIndicator rating={activity.price_level} />
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
    flexDirection: 'row'
  },
  body: {
    paddingHorizontal: 10
  },
  title: {
    fontSize: 12
  },
  address: {
    fontSize: 11
  }
});
