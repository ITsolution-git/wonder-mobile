import * as React from 'react';
import * as Animatable from 'react-native-animatable';
import {
  ImageProperties,
  ImageStyle,
  StyleSheet,
  Image,
  View,
  Modal,
  TextInput
} from 'react-native';
import { colors } from '@assets';
import images from '@images';
import { Text, Button, PrimaryButton } from 'src/views/components/theme';

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary50
  },
  subContainer: {
    backgroundColor: colors.white,
    padding: 25,
    alignItems: 'center',
    width: '60%',
    borderRadius: 5
  },
  icon: {
    width: 65,
    height: 65,
    marginBottom: 10
  },
  text: {
    marginBottom: 15
  },
  textPadding: {
    paddingHorizontal: 10
  }
});

interface IFirstTimeModalProps {
  icon: number;
  title: string;
  body: string;
  buttonTitle: string;
  visible: boolean;
  onPress: (data?: any) => any;
  onRequestClose: () => void;
  animationType?: 'slide' | 'fade';
  iconStyle?: ImageStyle;
  resizeMode?: ImageProperties['resizeMode'];
  renderWonderful: boolean;
}

class FirstTimeModal extends React.Component<IFirstTimeModalProps> {
  public static defaultProps: Partial<IFirstTimeModalProps> = {
    animationType: 'fade',
    resizeMode: 'contain',
    iconStyle: {},
    icon: images.LogoIcon,
    renderWonderful: true
  };

  private renderWonderfulText = (): React.ReactNode => {
    const { renderWonderful } = this.props;

    if (!renderWonderful) {
      return null;
    }

    return (
      <Text
        align={'center'}
        color={colors.primary}
        style={localStyles.textPadding}
        //   allowFontScaling={false}
      >
        {` Wonder'ful`}
        <Text align={'center'} color={colors.textColor}>
          "
        </Text>
      </Text>
    );
  }

  render(): React.ReactNode {
    const {
      title,
      buttonTitle,
      body,
      icon,
      iconStyle,
      visible,
      onRequestClose,
      animationType,
      resizeMode,
      onPress
    } = this.props;

    return (
      <Modal
        onRequestClose={onRequestClose}
        animationType={animationType}
        visible={visible}
        transparent={true}
      >
        <View style={localStyles.container}>
          <View style={localStyles.subContainer}>
            <Image
              source={icon}
              style={[localStyles.icon, iconStyle]}
              resizeMode={resizeMode}
            />
            <Text
              align={'center'}
              color={colors.black}
              //   allowFontScaling={false}
              style={localStyles.text}
            >
              {title}
            </Text>
            <Text
              style={[localStyles.text, localStyles.textPadding]}
              align={'center'}
              color={colors.textColor}
            >
              {body}
              {this.renderWonderfulText()}
            </Text>
            <PrimaryButton title={buttonTitle} onPress={onPress} />
          </View>
        </View>
      </Modal>
    );
  }
}

export { FirstTimeModal };
