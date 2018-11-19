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
    return [1, 2, 3, 4, 5].map((i: number) => (
      <Icon
        key={i}
        size={10}
        color={i <= rating ? theme.colors.primary : theme.colors.textColor}
        name='usd'
      />
    ));
  };

  render() {
    return <View style={styles.container}>{this.renderPricing()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PricingIndicator;
