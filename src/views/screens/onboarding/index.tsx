import React from 'react';
import { View, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { Text } from 'src/views/components/theme';
import SwipeView from 'src/views/components/swipeview';
import Assets from 'src/assets/images';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import WonderAppState from 'src/models/wonder-app-state';
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
            <View style={styles.halfCircleFooterContainer}>
              <View style={styles.halfCircleFooter}>
                <View style={{height: 24, alignItems: 'center', flexDirection: 'row'}}>
                <Text adjustsFontSizeToFit style={[styles.body, {marginRight: 2}]}>Welcome to</Text>
                    <Image
                        source={Assets.Logo.DARK}
                        resizeMode="contain"
                        style={{ width: 90, marginBottom: 4 }}
                    />
                </View>
                <Text adjustsFontSizeToFit style={styles.body}>
                  We make it easy to connect you{'\n'} with people that enjoy the activities{'\n'} that you do.</Text>
              </View>
            </View>
          </SwipeView.Slide>
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_2}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooterContainer}>
              <View style={styles.halfCircleFooter}>
                <Text adjustsFontSizeToFit style={styles.body}>{'Browse, match, and chat\nwith people nearby.'}</Text>
              </View>
            </View>
          </SwipeView.Slide>
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_3}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooterContainer}>
              <View style={styles.halfCircleFooter}>
                  <Text adjustsFontSizeToFit style={styles.body}>View and schedule activities</Text>
                  <View style={{height: 24, alignItems: 'center', flexDirection: 'row'}}>
                      <Text adjustsFontSizeToFit style={[styles.body, {marginRight: 2}]}>with your</Text>
                      <Image
                          source={Assets.Logo.DARK}
                          resizeMode="contain"
                          style={{ width: 90, marginBottom: 2 }}
                      />
                    <Text adjustsFontSizeToFit style={[styles.body, {marginLeft: 2}]}>matches!</Text>
                  </View>
              </View>
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
    lineHeight: Platform.select({
        ios: () => 24,
        android: () => 30,
    })(),
    fontSize: 13,
    marginLeft: 5,
    marginRight: 5,
    textAlignVertical: 'center',
      alignItems: 'center',
      flexDirection: 'row'
  },
  halfCircleFooter: {
    width: Platform.select({
        ios: () => DEVICE_WIDTH,
        android: () => DEVICE_WIDTH * 0.77,
    })(),
    borderTopLeftRadius: DEVICE_WIDTH / 1.5,
    borderTopRightRadius: DEVICE_WIDTH / 1.5,
    overflow: 'hidden',
    transform: [{scaleX: 1.3}],
    // borderTopLeftRadius: DEVICE_HEIGHT * 0.4,
    // borderTopRightRadius: DEVICE_HEIGHT * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: DEVICE_HEIGHT * 0.45,
    minHeight: 260,
    paddingTop: 45,
    paddingHorizontal: 25,
    alignItems: 'center'
  },
    halfCircleFooterContainer: {
      height: DEVICE_HEIGHT * 0.45,
      minHeight: 280,
      paddingTop: Platform.select({
          ios: () => 55,
          android: () => 35,
      })(),
      paddingHorizontal: 25,
      width: DEVICE_WIDTH,
      overflow: 'hidden',
      alignItems: 'center'
  }
});
