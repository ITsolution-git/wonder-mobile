import React from "react";
import _ from "lodash";
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
<<<<<<< HEAD
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { IconButton } from "../../components/theme";
import VideoPlayer from "react-native-video-player";
import theme from "../../../assets/styles/theme";
import Topic from "../../../models/topic";
import Wonder from "../../components/theme/wonder/wonder";
import WonderImage from "../../components/theme/wonder-image";
import Color from "color";
import {
  DecoratedConversation,
} from "src/models/conversation";
const { height } = Dimensions.get("window");
=======
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IconButton } from '../../components/theme';
import VideoPlayer from 'react-native-video-player';
import theme from '../../../assets/styles/theme';
import Topic from '../../../models/topic';
import Wonder from '../../components/theme/wonder/wonder';
import WonderImage from '../../components/theme/wonder-image';
import Color from 'color';
import { DecoratedConversation } from 'src/models/conversation';
const { height } = Dimensions.get('window');
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a

const gradient = [
  lighten(theme.colors.primaryLight, 0.5),
  lighten(theme.colors.primary, 0.5)
];

function lighten(color: string, value: number) {
  return Color(color)
    .fade(value)
    .toString();
}

interface Props {
  currentUser: {
<<<<<<< HEAD
    topics: Topic[],
=======
    topics: Topic[];
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
  };
  conversation: DecoratedConversation;
  visible: boolean;
  onRequestClose: () => void;
  showVideo: boolean;
  openProfileModal: () => void;
  toggleVideo: () => void;
  showDetails: boolean;
  toggleDetails: () => void;
}

const ProfileModalChat = (props: Props) => {
  const {
    currentUser,
    conversation,
    visible,
    onRequestClose,
    showVideo,
    openProfileModal,
    toggleVideo
  } = props;

  const { partner } = conversation;

  const renderDistance = () => {
    return (
      <Text allowFontScaling={false} style={styles.distanceText}>
<<<<<<< HEAD
        {conversation.partner.distance && _.get(conversation.partner, "partner.distance", 0).toFixed(0)} miles
        </Text>
=======
        {conversation.partner.distance &&
          _.get(conversation.partner, 'partner.distance', 0).toFixed(0)}{' '}
        miles
      </Text>
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
    );
  };

  const getTopics = () => {
    const candidate = conversation.partner;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;

    return (
      <View style={{ flexDirection: 'row' }}>
        {candidate &&
          candidateTopics.map((x: Topic) => {
            if (userTopics) {
              const active: boolean = !!userTopics.find(
                (i: Topic) => i.name === x.name
              );
              return (
                <View style={{ marginRight: 5 }} key={x.name}>
                  <Wonder
                    labelStyles={{ color: "#333" }}
                    topic={x}
                    size={60}
                    active={active}
                  />
                </View>
              );
            }
          })}
      </View>
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <LinearGradient colors={gradient} style={styles.modalContainer}>
        <View style={styles.modalInnerContainer}>
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            style={styles.topGradient}
          >
            <View style={styles.iconContainer}>
              {partner.video ? (
                <View>
                  {showVideo ? (
                    <IconButton
                      size={35}
                      icon={'camera'}
                      onPress={toggleVideo}
                      primary={theme.colors.primaryLight}
                      secondary='transparent'
                    />
                  ) : (
                    <IconButton
                      size={35}
                      icon={'video-camera'}
                      onPress={toggleVideo}
                      primary={theme.colors.primaryLight}
                      secondary='transparent'
                    />
                  )}
                </View>
              ) : (
                <View />
              )}
              <IconButton
                size={35}
                icon={'close'}
                onPress={openProfileModal}
<<<<<<< HEAD
                primary={"#fff"}
                secondary="transparent"
=======
                primary={'#fff'}
                secondary='transparent'
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
              />
            </View>
          </LinearGradient>
          <View style={styles.scrollContainer}>
<<<<<<< HEAD
            <ScrollView >
              {partner.video && showVideo ? <View style={styles.containerHeight}>
                <VideoPlayer
                  customStyles={{ videoWrapper: styles.videoStyles }}
                  videoHeight={Platform.OS === "ios" ? height / 3 * 2 * 4.74 : height * 2.58}
                  pauseOnPress={true}
                  disableFullscreen={true}
                  autoplay={true}
                  video={{
                    uri: `${partner.video}`,
                  }}
                />
              </View> :
=======
            <ScrollView>
              {partner.video && showVideo ? (
                <View style={styles.containerHeight}>
                  <VideoPlayer
                    customStyles={{ videoWrapper: styles.videoStyles }}
                    videoHeight={
                      Platform.OS === 'ios'
                        ? (height / 3) * 2 * 4.74
                        : height * 2.58
                    }
                    pauseOnPress={true}
                    disableFullscreen={true}
                    autoplay={true}
                    video={{
                      uri: `${partner.video}`
                    }}
                  />
                </View>
              ) : (
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
                <View style={styles.imageContainer}>
                  {partner.images.map((i, index) => {
                    if (index === 0) {
                      return (
                        <View key={i.url}>
                          <WonderImage
                            background
                            style={styles.containerHeight}
                            uri={i.url}
                          >
                            <LinearGradient
                              colors={["transparent", "rgba(0,0,0,0.5)"]}
                              style={[styles.imageTopGradient]}
                            >
                              <View>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.firstNameText}
                                >
                                  {partner.first_name}, {partner.age}
                                </Text>
                                <Text style={{ marginLeft: 5 }}>
                                  {renderDistance()}
                                </Text>
                              </View>
                            </LinearGradient>
                          </WonderImage>
                          <View style={styles.infoContainer}>
                            {getTopics()}
                            <Text
                              allowFontScaling={false}
                              style={styles.occupationText}
                            >
                              {!!partner.occupation && partner.occupation}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={styles.genericText}
                            >
                              {!!partner.school && partner.school}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={styles.genericText}
                            >
                              {!!partner.about && partner.about}
                            </Text>
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <WonderImage
                          key={i.url}
                          style={styles.regularImageStyles}
                          uri={i.url}
                        />
                      );
                    }
                  })}
                </View>
              )}
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
    justifyContent: "flex-end",
  },
  modalInnerContainer: {
<<<<<<< HEAD
    position: "relative", height: height / 3 * 2,
    borderRadius: 10, backgroundColor: "#f1f1f1",
=======
    position: 'relative',
    height: (height / 3) * 2,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    padding: 5,
    zIndex: 999,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  iconContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
  },
<<<<<<< HEAD
  scrollContainer: { borderRadius: 10, overflow: "hidden" },
  containerHeight: { height: height / 3 * 2, zIndex: 1, justifyContent: "flex-end" },
  imageContainer: { borderRadius: 10, overflow: "hidden" },
  videoStyles: { backgroundColor: "black", borderRadius: 10, overflow: "hidden" },
=======
  scrollContainer: { borderRadius: 10, overflow: 'hidden' },
  containerHeight: {
    height: (height / 3) * 2,
    zIndex: 1,
    justifyContent: 'flex-end'
  },
  imageContainer: { borderRadius: 10, overflow: 'hidden' },
  videoStyles: {
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden'
  },
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
  imageTopGradient: {
    padding: 10,
    zIndex: 999
  },
  firstNameText: {
    fontSize: 26,
    color: "#fff",
    marginLeft: 5,
    marginBottom: 2,
    fontWeight: "800",
  },
<<<<<<< HEAD
  regularImageStyles: { height: height / 3 * 2, zIndex: 1 },
  topicsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  schoolText: { color: "#fff", marginLeft: 5, fontSize: 12 },
  distanceText: { color: "#fff", fontSize: 13, marginLeft: 2 },
  detailsChevron: { justifyContent: "flex-end" },
  occupationText: { marginLeft: 5, fontSize: 16, fontWeight: "bold", marginTop: 10, color: "#333" },
  genericText: { marginLeft: 5, fontSize: 12, lineHeight: 18, color: "#333" },
  infoContainer: { backgroundColor: "#fff", padding: 10 },
=======
  regularImageStyles: { height: (height / 3) * 2, zIndex: 1 },
  topicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  schoolText: { color: '#fff', marginLeft: 5, fontSize: 12 },
  distanceText: { color: '#fff', fontSize: 13, marginLeft: 2 },
  detailsChevron: { justifyContent: 'flex-end' },
  occupationText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333'
  },
  genericText: { marginLeft: 5, fontSize: 12, lineHeight: 18, color: '#333' },
  infoContainer: { backgroundColor: '#fff', padding: 10 }
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
});
