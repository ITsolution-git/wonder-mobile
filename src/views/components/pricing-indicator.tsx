import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from 'src/assets/styles/theme';

interface Props {
  rating: number;
}

class PricingIndicator extends React.Component<Props> {

  renderPricing = () => {
    const { rating } = this.props;
    const arr = [];
    for (let i = 0; i < rating; i++) {
      if (i <= rating) {
        arr.push(i);
      }
    }
    if (arr.length) {
      return arr.map((i: number) => (
        <Icon
          key={i}
          size={10}
          color={theme.colors.primary}
          name='usd'
        />
      ));
    }
    return;
  }

  render() {
    return <View style={styles.container}>{this.renderPricing()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default PricingIndicator;
