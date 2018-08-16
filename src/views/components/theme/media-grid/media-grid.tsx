import React from 'react';
import { StyleSheet, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../../../assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import MediaGridItem from './media-grid-item';
import TouchableOpacityOnPress from '../../../../types/touchable-on-press';
import WonderAppState from '../../../../types/wonder-app-state';
import User from '../../../../types/user';
import { connect } from 'react-redux';
import Avatar, { AvatarSize } from '../../theme/avatar';

const imageurl = "https://api.getwonderapp.com";
let images: any = [];

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile
});



interface Props {
  featured?: ImageSourcePropType;
  items?: any;
  images?: ImageSourcePropType[];
  onNewPicture?: TouchableOpacityOnPress;
  onNewVideo?: TouchableOpacityOnPress;
  gutter: number;
  width: number;
  currentUser: any;
}

class MediaGrid extends React.Component<Props> {
  static defaultProps = {
    gutter: 5,
    width: 200,
  };

  renderFeatured = () => {
    const { featured, onNewPicture, onNewVideo } = this.props;

    if (featured) {
      return (
        <View style={styles.featuredContainer}>
          <Image source={featured} />
        </View>
      );
    }

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        style={styles.featuredContainer}
        colors={[theme.colors.primary, theme.colors.primaryLight]}
      >
        <TouchableOpacity onPress={onNewPicture}>
          <Icon name="plus" size={16} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  calcGridSpace = (span: number) => {
    const { gutter, width } = this.props;
    const base = ((width / 3) - (2 * gutter)) * span;

    let result = base;
    if (span > 1) {
      result += (span * gutter);
    }

    return result;
  }


  render() {
    const { featured, gutter, onNewPicture, onNewVideo, currentUser } = this.props;
    console.log("current user in media grid :", currentUser);
    images = [];

    if (currentUser && currentUser.images) {
      images.push(currentUser.images);
      console.log("image :", images[0][0]);
      console.log("iiiiii :", currentUser.images[Object.keys(currentUser.images)[Object.keys(currentUser.images).length - 1]]);
    }

    return (
      <View style={styles.container}>


        <View style={styles.row}>
          <View style={[styles.column]}>
            <MediaGridItem
              featured
              size={this.calcGridSpace(2)}
              gutter={gutter}
              onPress={onNewPicture}
            />
          </View>
          <View style={[styles.column]}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
            />
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
            />
          </View>
          <View style={styles.column}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
            />
          </View>
          <View style={styles.column}>
            <MediaGridItem
              video
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewVideo}
            />
          </View>
        </View>


        {/* {
          <View>
            {currentUser && currentUser.images && Object.keys(currentUser.images).length == 1 ?
              <View>
                <View style={styles.row}>
                  <View>
                    <View style={[styles.column]}>
                      <Image
                        style={{ width: 170, height: 210 }}
                        source={{ uri: imageurl + images[0][0].url }}
                      />
                    </View>
                  </View>
                  <View style={[styles.column]}>
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                  </View>
                  <View style={styles.column}>
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                  </View>
                  <View style={styles.column}>
                    <MediaGridItem
                      video
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewVideo}
                    />
                  </View>
                </View>
              </View>
              :
              null
            }
            {currentUser && currentUser.images && Object.keys(currentUser.images).length == 2 ?
              <View>
                <View style={styles.row}>
                  <View>
                    <View style={[styles.column]}>
                      <Image
                        style={{ width: 170, height: 210 }}
                        source={{ uri: imageurl + images[0][0].url }}
                      />
                    </View>
                  </View>
                  <View style={[styles.column]}>
                    <View>
                      <Image
                        style={{ width: 60, height: 60 }}
                        source={{ uri: imageurl + images[0][1].url }}
                      />
                    </View>
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                  </View>
                  <View style={styles.column}>
                    <MediaGridItem
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewPicture}
                    />
                  </View>
                  <View style={styles.column}>
                    <MediaGridItem
                      video
                      size={this.calcGridSpace(1)}
                      gutter={gutter}
                      onPress={onNewVideo}
                    />
                  </View>
                </View>
              </View>
              :
              null
            }
          </View>
        } */}
      </View>
    );
  }
}

export default connect(mapState)(MediaGrid);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flexDirection: 'column',
  },
  container: {

  },
  featuredContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 154,
    height: 154
  },

});