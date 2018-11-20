import _ from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'src/views/components/theme';

import theme from 'src/assets/styles/theme';
import WonderImage from '../wonder-image';
import Topic from 'src/models/topic';

interface WonderProps {
  topic: Topic;
  active?: boolean;
  size?: number;
  labelStyles?: any;
}
<<<<<<< HEAD
const Wonder: React.SFC<WonderProps> = ({ labelStyles, topic, active, size = 80, noText }) => {
=======
const Wonder: React.SFC<WonderProps> = ({
  labelStyles,
  topic,
  active,
  size = 80
}) => {
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
  const imageSize = (size / 2) * 0.75;
  const containerStyles = {
    height: size,
    width: size,
    borderRadius: size / 2,
    backgroundColor: "transparent",
  };

  const wonderStyles = [styles.container, containerStyles];
  if (active) {
    wonderStyles.push(styles.selectedContainer);
  }

  return (
    <View style={wonderStyles}>
      <WonderImage
        style={{ height: imageSize, width: imageSize, marginBottom: 5 }}
        uri={topic.icon}
      />
      {noText ? null : <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        allowFontScaling={false}
        style={[styles.label, labelStyles && labelStyles]}
      >
        {_.toUpper(topic.name)}
      </Text>}
    </View>
  );
};

Wonder.defaultProps = {
  active: false,
  size: 80,
};

export default Wonder;

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    justifyContent: "center",
    alignItems: "center",
=======
    justifyContent: 'center',
    alignItems: 'center'
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    opacity: 0.8,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: theme.colors.primaryLight,
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  label: {
    fontSize: 6,
    textAlign: "center",
  },
});
