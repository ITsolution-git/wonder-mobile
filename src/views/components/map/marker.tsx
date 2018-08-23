import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from 'src/assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  icon?: string;
  title: string;
}

class Marker extends React.Component<Props> {
  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <Icon name="map-marker" size={12} color={theme.colors.textColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.textColor,
    borderRadius: 14,
    height: 28,
    width: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Marker;