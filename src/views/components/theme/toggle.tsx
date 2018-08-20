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
const { primary, primaryLight } = theme.colors;
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
        thumbTintColor={disabled ? primaryLight : primary}
        tintColor={disabled ? primaryLight : primary}
        onTintColor={primaryLight}
        onValueChange={this.onChangeValue}
        value={value}
      />
    );
  }
}

export default Toggle;
