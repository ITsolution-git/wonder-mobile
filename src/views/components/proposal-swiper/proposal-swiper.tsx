import _ from "lodash";
import React from "react";
import { DeckSwiper } from "native-base";
import { Text, Title, WonderImage, SubTitle, IconButton } from "../theme";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Modal,
  TouchableHighlight
} from "react-native";

import moment from "moment-timezone";
// import Icon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Entypo";

import Images from "src/assets/images";

import LinearGradient from "react-native-linear-gradient";
import Wonder from "../theme/wonder/wonder";
import Proposal from "src/models/proposal";
import ProfileImage from "src/models/profile-image";
import Topic from "src/models/topic";
import Candidate from "src/models/candidate";

import VideoPlayer from "react-native-video-player";
import theme from "src/assets/styles/theme";

const deviceHeight = Dimensions.get("window").height;

interface Props {
  proposal: Proposal | null;
  onSwipeLeft: Function;
  onSwipeRight: Function;
}

interface CardDetailsOverlayProps {
  candidate: Candidate;
}

interface CardDetailsOverlayState {
  showDetails: boolean;
  animation: Animated.Value;
  contentHeight: number;
}

class CardDetailsOverlay extends React.Component<
  CardDetailsOverlayProps,
  CardDetailsOverlayState
> {
  state = {
    contentHeight: 0,
    showDetails: false,
    imageCount: 0,
    showVideoPlayer: false,
    animation: new Animated.Value(0)
  };

  toggleDetails = () => {
    const showDetails = !this.state.showDetails;
    const { contentHeight } = this.state;
    const fromValue = showDetails ? 0 : contentHeight;
    const toValue = showDetails ? contentHeight : 0;
    this.state.animation.setValue(fromValue);
    Animated.timing(this.state.animation, {
      toValue,
      duration: 100
    }).start();
    this.setState({ showDetails });
  };

  getTopics = () => {
    const { candidate, currentUser } = this.props;
    const candidateTopics = candidate.topics;
    const userTopics = currentUser.topics;

    return (
      <View style={{ flexDirection: "row" }}>
        {candidate &&
          candidateTopics.map(x => {
            if (userTopics) {
              if (userTopics.find(i => i.name === x.name)) {
                return (
                  <Wonder key={x.name} topic={x} size={60} active={true} />
                );
              } else {
                return (
                  <Wonder key={x.name} topic={x} size={60} active={false} />
                );
              }
            }
          })}
      </View>
    );
  };

  getNextPhoto = () => {
    const { candidate } = this.props;
    const { imageCount } = this.state;
    if (imageCount.count < candidate.images.length - 1) {
      this.setState({ imageCount: this.state.imageCount + 1 });
    } else {
      this.setState({ imageCount: 0 });
    }
  };

  render() {
    const { showDetails } = this.state;
    const { candidate } = this.props;
    const details = (
      <React.Fragment>
        <Text color="#FFF">
          {candidate.occupation}
          {"\n"}
          {candidate.school}
        </Text>
        {!!candidate.about && <Text color="#FFF">{candidate.about}</Text>}
      </React.Fragment>
    );
    const person = {
      images: [
        {
          url:
            "https://pixabay.com/get/ef30b60e29f21c22d2524518b7444795ea76e5d004b014429df5c27dafebb4_340.jpg"
        }
      ]
    };
    return (
      <TouchableWithoutFeedback
        style={styles.cardOverlayContainer}
        onPress={() => this.getNextPhoto()}
      >
        <WonderImage
          background
          uri={_.get(
            person,
            `images[${this.state.imageCount}].url`,
            Images.WELCOME
          )}
          style={styles.container}
        >
          <View style={{ alignSelf: "flex-end", padding: 10 }}>
            <View style={{ alignItems: "center" }}>
              {/* {candidate.images.map(c => (
                <Text>Image</Text>
              ))} */}
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.textColor,
                  margin: 4
                }}
              />
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.primary,
                  margin: 4
                }}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <IconButton
                size={44}
                icon={"video-camera"}
                onPress={() => this.setState({ showVideoPlayer: true })}
                primary={theme.colors.textColor}
                secondary="transparent"
              />
            </View>
          </View>
          <LinearGradient
            style={styles.textContainer}
            colors={["transparent", "rgb(22,22,22)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.3]}
          >
            <View flex={1}>
              <Title style={{ fontSize: 24 }} color="#FFF">
                {[
                  candidate.first_name,
                  moment().diff(candidate.birthdate, "years")
                ].join(", ")}
              </Title>
              <SubTitle style={{ fontSize: 16 }} color="#FFF">
                {"Los Angelas, CA"}
              </SubTitle>
              <View>{this.getTopics()}</View>
              <Animated.View style={{ height: this.state.animation }}>
                {details}
              </Animated.View>
              <View
                style={{ position: "absolute", bottom: -deviceHeight }}
                onLayout={(event: any) =>
                  this.setState({
                    contentHeight: event.nativeEvent.layout.height
                  })
                }
              >
                {details}
              </View>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <IconButton
                size={44}
                icon={showDetails ? "chevron-down" : "chevron-up"}
                onPress={this.toggleDetails}
                primary="#FFF"
                secondary="transparent"
              />
            </View>
          </LinearGradient>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showVideoPlayer}
            onRequestClose={() => console.log("yo")}
          >
            <IconButton
              size={44}
              icon={showDetails ? "chevron-down" : "chevron-up"}
              onPress={() => this.setState({ showVideoPlayer: false })}
              primary="#FFF"
              secondary="transparent"
            />
            <View style={{ flex: 1 }}>
              <View>
                <VideoPlayer
                  disableFullscreen={false}
                  autoplay
                  videoHeight={2}
                  videoWidth={1}
                  video={{
                    uri:
                      "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
                  }}
                />
                <Text>Hello World!</Text>

                <TouchableHighlight
                  onPress={() => this.setState({ showVideoPlayer: false })}
                >
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </WonderImage>
      </TouchableWithoutFeedback>
    );
  }
}

class ProposalSwiper extends React.Component<Props> {
  renderProfileImage = (images?: ProfileImage[]) => {
    if (images && images.length) {
      return (
        <View style={styles.noImageContainer}>
          <WonderImage
            style={{ width: "100%", height: "100%" }}
            uri={images[0].url}
            resizeMode="cover"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.noImageContainer}>
          <Icon name="user" color="#CCC" size={100} />
        </View>
      );
    }
  };

  renderCard = (proposal: Proposal) => (
    <CardDetailsOverlay
      candidate={proposal.candidate}
      currentUser={this.props.currentUser}
    />
  );

  render() {
    const { proposal, onSwipeLeft, onSwipeRight } = this.props;
    const data = [proposal];
    // TODO: prefetch one more proposal
    if (proposal) {
      return (
        <DeckSwiper
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          dataSource={data}
          renderItem={this.renderCard}
        />
      );
    } else {
      return (
        <View style={styles.noMatchesContainer}>
          <Title style={[styles.messageText, styles.titleText]}>
            Looks like you&apos;re out of people...
          </Title>
          <Text style={styles.messageText}>Check back soon!</Text>
        </View>
      );
    }
  }
}

export default ProposalSwiper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EEE",
    justifyContent: "space-between",
    height: Dimensions.get("window").height - 60
  },
  textContainer: {
    padding: 20,
    flexDirection: "row"
  },
  noMatchesContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: "#EEE",
    justifyContent: "center"
  },
  titleText: {
    fontSize: 24
  },
  messageText: {
    textAlign: "center"
  },
  noImageContainer: {
    flex: 1,
    height: 300,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center"
  },
  cardOverlayContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

// {candidate.topics &&
//   candidate.topics.map((topic: Topic) => (
//     <Wonder key={topic.name} topic={topic} size={60} active={false} />
//   ))}

{
  /* <WonderImage</WonderImage></WonderImage>
          background
          uri={_.get(
            candidate,
            `images[${this.state.imageCount}].url`,
            Images.WELCOME
          )}
          style={styles.container}
        > */
}
