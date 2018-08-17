import _ from 'lodash';
import React from 'react';
import { View, StyleSheet} from 'react-native';
import { Text, PrimaryButton, TextInput, WonderPicker } from '../../components/theme';
import Screen from '../../components/screen';
import Topic from '../../../types/topic';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getTopics } from '../../../store/sagas/topics';
import WonderAppState from '../../../types/wonder-app-state';
import { persistRegistrationInfo } from '../../../store/reducers/registration';
import { registerUser } from '../../../store/sagas/user';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  topics: Topic[];
  getAllTopics: Function;
  onSave: Function;
  onRegister: Function;
}

interface State {
  search: string;
  selected: Topic[];
}

const mapState = (state: WonderAppState) => ({
  topics: state.wonder.topics
});

const mapDispatch = (dispatch: Dispatch) => ({
  getAllTopics: () => dispatch(getTopics()),
  onSave: (data: any) => dispatch(persistRegistrationInfo(data)),
  onRegister: () => dispatch(registerUser())
});

class Register4 extends React.Component<Props, State> {

  static defaultProps = {
    topics: []
  };

  state = {
    search: '',
    selected: []
  };

  componentWillMount() {
    this.props.getAllTopics();
  }

  onSearchTextChange = (text: string) => {
    this.setState({ search: text.toLowerCase() });
  }

  onChangeSelected = (selected: Topic[]) => {
    this.setState({ selected });
  }

  filterTopics = () => {
    const { search } = this.state;
    const { topics } = this.props;
    if (search) {
      return topics.filter((topic: Topic) => {
        const isInName = topic.name.toLowerCase().indexOf(search) >= 0;
        const isInKeywords = topic.keywords.indexOf(search) >= 0;

        return isInName || isInKeywords;
      });

    }
    return topics;
  }

  renderPicker = () => {
    const filteredTopics = this.filterTopics();
    if (filteredTopics.length) {
      return (
        <WonderPicker
          contentContainerStyle={{ paddingBottom: 60 }}
          topics={_.sortBy(filteredTopics, ['name'])}
          limit={3}
          onChangeSelected={this.onChangeSelected}
        />
      );
    }
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>
          Sorry! Looks like we do not have a wonder that matches what you are looking for.
        </Text>
      </View>
    );
  }

  validate = () => {
    const { onSave, onRegister } = this.props;
    const { selected } = this.state;
    if (selected.length === 3) {
      onSave({ topic_ids: selected.map((s: Topic) => s.id) });
      onRegister();
    }
  }

  render() {
    const { selected } = this.state;
    return (
      <Screen horizontalPadding={10}>
        <View style={{ paddingVertical: 15 }}>
          <Text style={{ textAlign: 'center' }}>
            Please select 3 Wonders for us to find people and activities in your area.
          </Text>
        </View>
        <View style={{ paddingVertical: 15 }}>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            icon="search"
            placeholder="Search"
            onChangeText={this.onSearchTextChange}
          />
        </View>
        <View flex={1}>
          {this.renderPicker()}
          <View style={{ position: 'absolute', bottom: 10, width: '100%', zIndex: 10 }}>
            <PrimaryButton
              disabled={selected.length !== 3}
              title="Finish"
              onPress={this.validate}
            />
          </View>
        </View>
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(Register4);

const styles = StyleSheet.create({
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
