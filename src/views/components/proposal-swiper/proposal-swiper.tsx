import _ from "lodash";
import React from "react";
import { connect } from 'react-redux';
import { DeckSwiper } from "native-base";
import { Text, Title, WonderImage, SubTitle, IconButton } from "../theme";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Image,
  Alert
} from "react-native";

import moment from "moment-timezone";
import Icon from "react-native-vector-icons/Entypo";
import Topic from "src/models/topic";
import Images from "src/assets/images";

import LinearGradient from "react-native-linear-gradient";
import Wonder from "../theme/wonder/wonder";
import Proposal from "src/models/proposal";
import User from "src/models/user";
import ProfileImage from "src/models/profile-image";
import Candidate from "src/models/candidate";

import googleMaps, { GoogleGeoLocation } from "../../../services/google-maps";
import MatchAvailableMedia from "../../components/proposal-swiper/match-available-media";
import VibeVideoModal from "../modals/vibe-video-modal";

const deviceHeight = Dimensions.get("window").height;

interface Props {
  proposal: Proposal | null;
  onSwipeLeft: Function;
  onSwipeRight: Function;
  currentUser: User;
  stateProposal: Proposal;
}

interface CardDetailsOverlayProps {
  candidate: Candidate;
  currentUser: User;
}

interface CardDetailsOverlayState {
  showDetails: boolean;
  animation: Animated.Value;
  contentHeight: number;
  imageCount: number;
  location: string;
  showVideoPlayer: boolean;
}

const mapState = (state: WonderAppState) => ({
  stateProposal: state.wonder.proposal
});

class CardDetailsOverlay extends React.Component<
  CardDetailsOverlayProps,
  CardDetailsOverlayState
  > {
  state = {
    contentHeight: 0,
    showDetails: false,
    imageCount: 0,
    showVideoPlayer: false,
    location: "",
    animation: new Animated.Value(0)
  };

  componentDidMount() {
    this.lookupZipcode();
  }

  // shouldComponentUpdate(nextProps: any) {
  //   if (nextProps.candidate.id !== this.props.candidate.id) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidUpdate(prevProps: any) {
    if (this.props.candidate.id !== prevProps.candidate.id) {
      this.setState({ imageCount: 0 });
    }
  }

  lookupZipcode = async () => {
    const { zipcode } = this.props.candidate;
    if (zipcode) {
      const geolocation: GoogleGeoLocation = await googleMaps.geocodeByZipCode(
        zipcode
      );
      this.setState({ location: `${geolocation.city}, ${geolocation.state}` });
    }
  }

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
  }

  getTopics = () => {
    const { candidate, currentUser } = this.props;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;

    return (
      <View style={{ flexDirection: "row" }}>
        {candidate &&
          candidateTopics.map((x: Topic) => {
            if (userTopics) {
              const active: boolean = !!userTopics.find((i: Topic) => i.name === x.name);
              return (
                <View key={x.name} style={{ marginRight: 4 }}>
                  <Wonder topic={x} size={60} active={active} />
                </View>
              );
            }
          })}
      </View>
    );
  }

  getNextPhoto = () => {
    const { candidate } = this.props;
    const { images = [] } = candidate;
    const { imageCount } = this.state;

    if (imageCount < images.length - 1) {
      this.setState({ imageCount: this.state.imageCount + 1 });
    } else {
      this.setState({ imageCount: 0 });
    }
  }

  showAlert = () => {
    Alert.alert(
      'Coming Soon',
      'Check back soon for Wonder Premium!',
      [
        { text: 'Ok' },
      ],
      { cancelable: false }
    );
  }

  render() {
    const { showDetails, imageCount, location } = this.state;
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

    return (
      <TouchableWithoutFeedback
        style={styles.cardOverlayContainer}
        onPress={this.getNextPhoto}
      >
        <WonderImage
          background
          uri={_.get(candidate, `images[${imageCount}].url`, Images.WELCOME)}
          style={styles.container}
        >
          <MatchAvailableMedia
            onPress={() => this.setState({ showVideoPlayer: true })}
            candidate={candidate}
            currentImageIndex={this.state.imageCount}
          />
          <LinearGradient
            style={styles.textContainer}
            colors={["transparent", "rgb(0,0,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View flex={1}>
              <Title style={{ fontSize: 24, fontWeight: 'bold' }} color="#FFF">
                {[
                  candidate.first_name,
                  moment().diff(candidate.birthdate, "years")
                ].join(", ")}
              </Title>
              <SubTitle style={{ fontSize: 14, marginBottom: 5 }} color="#FFF" >
                24 miles away
              </SubTitle>
              <View style={{ paddingBottom: 6 }}>{this.getTopics()}</View>
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
            <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, paddingTop: 15 }}>
              <View>
                <TouchableWithoutFeedback onPress={this.showAlert}>
                  <Image source={Images.LogoIcon} style={{ width: 40, height: 40 }} />
                </TouchableWithoutFeedback>
              </View>
              <Icon
                name={showDetails ? "chevron-thin-down" : "chevron-thin-up"}
                color={"#fff"}
                size={20}
                onPress={this.toggleDetails}
              />

            </View>
          </LinearGradient>
          <VibeVideoModal
            visible={this.state.showVideoPlayer}
            onRequestClose={() => this.setState({ showVideoPlayer: false })}
            videoUrl={candidate.video}
          />
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
  }

  renderCard = () => {
    const { stateProposal } = this.props;
    return (
      (
        <CardDetailsOverlay
          candidate={stateProposal.candidate}
          currentUser={this.props.currentUser}
        />
      )
    );
  }

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

export default connect(mapState)(ProposalSwiper);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EEE",
    justifyContent: "space-between",
    height: Dimensions.get("window").height - 60,
    width: Dimensions.get("window").width
  },
  textContainer: {
    padding: 15,
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
