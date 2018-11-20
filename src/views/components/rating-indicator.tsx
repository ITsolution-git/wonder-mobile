import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from 'src/assets/styles/theme';

interface Props {
  rating: number;
  containerStyle?: StyleProp<ViewStyle>;
}

class RatingIndicator extends React.Component<Props> {
  renderRating = () => {
    const { rating } = this.props;
    return [1, 2, 3, 4, 5].map((i: number) => (
      <Icon
        key={i}
        size={10}
        name='star'
        color={
          i <= rating ? theme.colors.primaryLight : theme.colors.textColorLight
        }
      />
    ));
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderRating()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default RatingIndicator;
