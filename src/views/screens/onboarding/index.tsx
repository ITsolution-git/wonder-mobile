import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Text } from '../../components/theme';
import SwipeView from '../../components/swipeview';
import Assets from '../../../assets/images';
import { NavigationScreenProp, NavigationParams, NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import WonderAppState from '../../../types/wonder-app-state';
import { Dispatch } from 'redux';
import images from '../../../assets/images';
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const mapState = (state: WonderAppState) => ({});
const mapDispatch = (dispatch: Dispatch) => ({});
class Onboarding extends React.Component<Props> {

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SwipeView
          onComplete={() => navigation.navigate('Register')}
          onSkip={() => navigation.navigate('Register')}
        >
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_1}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooter}>
              <Text style={styles.body}>
                Welcome to <Image source={images.Logo.DARK} resizeMode="contain" style={{ width: 100, height: 24 }} />{'\n'}
                We make it easy to connect you with people that enjoy the activities that you do.</Text>
            </View>
          </SwipeView.Slide>
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_2}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooter}>
              <Text style={styles.body}>{'Browse, match, and chat\nwith people nearby.'}</Text>
            </View>
          </SwipeView.Slide>
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_3}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooter}>
              <Text style={styles.body}>View and schedule activities{'\n'}with your <Image source={images.Logo.DARK} resizeMode="contain" style={{ width: 100, height: 24 }} /> matches!</Text>
            </View>
          </SwipeView.Slide>
        </SwipeView>
      </View>
    );
  }
}

export default connect(mapState, mapDispatch)(Onboarding);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 5,
  },
  body: {
    textAlign: 'center',
    color: '#000',
    lineHeight: 24
  },
  halfCircleFooter: {
    width: '100%',
    // borderTopLeftRadius: DEVICE_HEIGHT * 0.4,
    // borderTopRightRadius: DEVICE_HEIGHT * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: DEVICE_HEIGHT * 0.4,
    paddingTop: 55,
    paddingHorizontal: 25
  }
});