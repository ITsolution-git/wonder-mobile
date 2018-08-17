import _ from 'lodash';
import React from 'react';
import { Switch } from 'react-native';
import theme from '../../../assets/styles/theme';
import SwitchValueChange from '../../../types/switch-value-change';

interface Props {
  disabled?: boolean;
  onValueChange?: SwitchValueChange;
  value?: boolean;
  initialValue?: boolean;
}

class Toggle extends React.Component<Props> {

  static defaultProps = {
    onValueChange: _.noop,
    value: false
  };

  onChangeValue = (value: boolean) => {
    const { onValueChange } = this.props;
    if (onValueChange) {
      onValueChange(value);
    }
  }

  render() {
    const { disabled, value } = this.props;
    return (
      <Switch
        disabled={disabled}
        thumbTintColor={theme.colors.primaryLight}
        tintColor={theme.colors.primaryLight}
        onTintColor={theme.colors.primary}
        onValueChange={this.onChangeValue}
        value={value}
      />
    );
  }
}

export default Toggle;
