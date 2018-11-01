import React from 'react';
import _ from 'lodash';
import { View, Text, Modal, Animated, ScrollView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IconButton } from "../../components/theme";
import VideoPlayer from "react-native-video-player";
import theme from '../../../assets/styles/theme';
import Topic from '../../../models/topic';
import Wonder from "../../components/theme/wonder/wonder";
import Color from 'color';
const { height } = Dimensions.get('window');

const gradient = [lighten(theme.colors.primaryLight, 0.5), lighten(theme.colors.primary, 0.5)];

function lighten(color: string, value: number) {
  return Color(color).fade(value).toString();
}

const ProfileModalChat = ({
  currentUser,
  conversation,
  visible,
  onRequestClose,
  showVideo,
  openProfileModal,
  toggleVideo,
  showDetails,
  toggleDetails,
  animation,
  onLayout,
}) => {
  const { partner } = conversation;

  const renderDistance = () => {
    return (
      <Text allowFontScaling={false} style={{ color: '#fff', fontSize: 13, marginLeft: 2 }}>
        {conversation.partner.distance && _.get(conversation.partner, 'partner.distance', 0).toFixed(0)} miles
        </Text>
    );
  };

  const getTopics = () => {
    const candidate = conversation.partner;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;

    return (
      <View style={{ flexDirection: "row" }}>
        {candidate &&
          candidateTopics.map((x: Topic) => {
            if (userTopics) {
              const active: boolean = !!userTopics.find((i: Topic) => i.name === x.name);
              return (
                <Wonder key={x.name} topic={x} size={60} active={active} />
              );
            }
          })}
      </View>
    );
  };

  const details = (
    <React.Fragment>
      <Text
        allowFontScaling={false}
        style={{
          color: '#fff',
          marginLeft: 5,
          lineHeight: 19,
          marginTop: 3,
          fontSize: 12
        }}
      >
        {partner.occupation}
        {"\n"}
        {partner.school}
      </Text>
      {!!partner.about && <Text style={{ color: '#fff', marginLeft: 5, fontSize: 12 }}>{partner.about}</Text>}
    </React.Fragment>
  );

  return (
    <Modal
      transparent={true}
      animationType='fade'
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <LinearGradient
        colors={gradient}
        style={styles.modalContainer}
      >
        <View
          style={styles.modalInnerContainer}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={styles.topGradient}
          >
            <View style={styles.iconContainer} >
              {partner.video ? <View>
                {showVideo ? <IconButton
                  size={35}
                  icon={"camera"}
                  onPress={toggleVideo}
                  primary={theme.colors.primaryLight}
                  secondary="transparent"
                /> : <IconButton
                    size={35}
                    icon={"video-camera"}
                    onPress={toggleVideo}
                    primary={theme.colors.primaryLight}
                    secondary="transparent"
                  />
                }
              </View> : <View />}
              <IconButton
                size={35}
                icon={"close"}
                onPress={openProfileModal}
                primary={theme.colors.primaryLight}
                secondary="transparent"
              />
            </View>

          </LinearGradient>
          <View style={styles.scrollContainer}>
            <ScrollView >
              {partner.video && showVideo ? <View style={styles.containerHeight}>
                <VideoPlayer
                  customStyles={{ videoWrapper: styles.videoStyles }}
                  videoHeight={height / 3 * 2 * 4.5}
                  pauseOnPress={true}
                  disableFullscreen={true}
                  autoplay={true}
                  video={{
                    uri: `${partner.video}`
                  }}
                />
              </View> :
                <View style={styles.imageContainer}>
                  {partner.images.map((i, index) => {
                    if (index === 0) {
                      return (
                        <ImageBackground
                          key={i.url}
                          style={styles.containerHeight}
                          source={{ uri: i.url }}
                        >
                          <LinearGradient
                            colors={['transparent', 'black']}
                            style={[styles.imageTopGradient, { height: showDetails ? 175 : 135 }]}
                          >
                            <View flex={1}>
                              <View>
                                <Text allowFontScaling={false} style={styles.firstNameText}>
                                  {partner.first_name}, {partner.age}
                                </Text>
                                <Text style={{ marginLeft: 5 }}>
                                  {renderDistance()}
                                </Text>

                              </View>
                              <View style={styles.topicsContainer}>
                                {getTopics()}
                                <View style={{ justifyContent: "flex-end" }}>
                                  <IconButton
                                    size={44}
                                    icon={showDetails ? "chevron-down" : "chevron-up"}
                                    onPress={toggleDetails}
                                    primary="#FFF"
                                    secondary="transparent"
                                  />
                                </View>
                              </View>

                              <Animated.View style={{ height: animation }}>
                                {details}
                              </Animated.View>
                              <View
                                style={{ position: "absolute", bottom: -height }}
                                onLayout={onLayout}
                              >
                                {details}
                              </View>
                            </View>
                          </LinearGradient>
                        </ImageBackground>

                      );
                    } else {
                      return (
                        <ImageBackground
                          key={i.url}
                          style={styles.regularImageStyles}
                          source={{ uri: i.url }}
                        />
                      );
                    }
                  })}
                </View>}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default ProfileModalChat;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    // marginLeft: 15,
    // marginRight: 15,
    justifyContent: 'flex-end',
    // marginBottom: 15,

  },
  modalInnerContainer: {
    position: 'relative', height: height / 3 * 2,
    borderRadius: 10, backgroundColor: '#f1f1f1',
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    padding: 5,
    zIndex: 999,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  iconContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scrollContainer: { borderRadius: 10, overflow: 'hidden' },
  containerHeight: { height: height / 3 * 2, zIndex: 1, justifyContent: 'flex-end' },
  imageContainer: { borderRadius: 10, overflow: 'hidden' },
  videoStyles: { backgroundColor: 'black', borderRadius: 10 },
  imageTopGradient: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // height: 145,
    padding: 10,
    zIndex: 999,
  },
  firstNameText: {
    fontSize: 26,
    color: '#fff',
    marginLeft: 5,
    marginBottom: 2
  },
  regularImageStyles: { height: height / 3 * 2, zIndex: 1 },
  occupationText: { color: '#fff', marginLeft: 5, lineHeight: 18, fontSize: 12 },
  topicsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  schoolText: { color: '#fff', marginLeft: 5, fontSize: 12 }
});
