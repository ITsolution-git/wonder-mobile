import React from 'react';
import { StyleSheet, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from 'src/assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import MediaGridItem from './media-grid-item';
import TouchableOpacityOnPress from 'src/types/touchable-on-press';
import WonderAppState from 'src/types/wonder-app-state';
import User from 'src/types/user';
import { connect } from 'react-redux';
import { selectCurrentUser } from 'src/store/selectors/user';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

interface Props {
  featured?: ImageSourcePropType;
  items?: any;
  images?: any[];
  video?: any;
  onNewPicture?: TouchableOpacityOnPress;
  onNewVideo?: TouchableOpacityOnPress;
  gutter: number;
  width: number;
  currentUser: User;
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

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.column]}>
            <MediaGridItem
              featured
              size={this.calcGridSpace(2)}
              gutter={gutter}
              onPress={onNewPicture}
              source={currentUser && currentUser.images && currentUser.images[0] ? currentUser.images[0].url : ''}
            />
          </View>
          <View style={[styles.column]}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={currentUser && currentUser.images && currentUser.images[1] ? currentUser.images[1].url : ''}
            />
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={currentUser && currentUser.images && currentUser.images[2] ? currentUser.images[2].url : ''}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={currentUser && currentUser.images && currentUser.images[3] ? currentUser.images[3].url : ''}
            />
          </View>
          <View style={styles.column}>
            <MediaGridItem
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewPicture}
              source={currentUser && currentUser.images && currentUser.images[4] ? currentUser.images[4].url : ''}
            />
          </View>
          <View style={styles.column}>
            <MediaGridItem
              video
              size={this.calcGridSpace(1)}
              gutter={gutter}
              onPress={onNewVideo}
              source={currentUser && currentUser.video ? currentUser.video : ''}
            />
          </View>
        </View>

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