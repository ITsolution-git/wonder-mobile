import _ from 'lodash';
import React from 'react';
import { StyleSheet, View } from "react-native";
import { Text } from 'src/views/components/theme';
import Topic from 'src/types/topic';
import theme from 'src/assets/styles/theme';
import WonderImage from '../wonder-image';

interface WonderProps {
  topic: Topic;
  active?: boolean;
  size?: number;
}
const Wonder: React.SFC<WonderProps> = ({ topic, active, size = 80 }) => {
  const imageSize = (size / 2) * 0.75;
  const containerStyles = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <WonderImage
        style={{ height: imageSize, width: imageSize, marginBottom: 5 }}
        uri={topic.icon}
      />
      <Text style={styles.label}>{_.toUpper(topic.name)}</Text>
    </View>
  );
};

Wonder.defaultProps = {
  active: false,
  size: 80
};

export default Wonder;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    // shadowColor: theme.colors.primary,
    // shadowOpacity: 0.5,
  },
  label: {
    fontSize: 8
  }
});
