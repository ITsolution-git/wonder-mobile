import _ from "lodash";
import React from "react";
import { View, StyleSheet, SectionList } from "react-native";
import {
  Text,
  PrimaryButton,
  TextInput,
  WonderPicker
} from "src/views/components/theme";
import Screen from "src/views/components/screen";

import { NavigationScreenProp, NavigationParams } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getTopics } from "../../../store/sagas/topics";

import { persistRegistrationInfo } from "../../../store/reducers/registration";
import { registerUser } from "../../../store/sagas/user";
import theme from "../../../assets/styles/theme";
import Topic from "../../../models/topic";
import WonderAppState from "../../../models/wonder-app-state";
import WonderPickerItem from "src/views/components/theme/wonder-picker/wonder-picker-item";

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
    search: "",
    selected: [],
    itemCount: 0
  };

  componentWillMount() {
    this.props.getAllTopics();
  }

  onSearchTextChange = (text: string) => {
    this.setState({ search: text.toLowerCase() });
  };

  // onChangeSelected = (selected: Topic[]) => {
  //   this.setState({ selected });
  // };

  onChangeSelected = (topic: Topic[]) => {
    const limit = 3;
    const { selected } = this.state;
    if (
      (!limit || selected.length < limit) &&
      !selected.filter((t: Topic) => t.name === topic.name).length
    ) {
      this.setState(
        { selected: [...selected, topic], itemCount: this.state.itemCount++ },
        this.update
      );
    } else {
      this.setState(
        {
          selected: selected.filter((t: Topic) => t.name !== topic.name),
          itemCount: this.state.itemCount--
        },
        this.update
      );
    }
  };

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
  };

  // renderPicker = () => {
  //   const filteredTopics = this.filterTopics();
  //   if (filteredTopics.length) {
  //     return (
  //       <WonderPicker
  //         contentContainerStyle={{ paddingBottom: 60 }}
  //         topics={_.sortBy(filteredTopics, ["name"])}
  //         limit={3}
  //         onChangeSelected={this.onChangeSelected}
  //       />
  //     );
  //   }
  // return (
  //   <View>
  //     <Text style={{ textAlign: "center" }}>
  //       Sorry! Looks like we do not have a wonder that matches what you are
  //       looking for.
  //     </Text>
  //   </View>
  // );
  // };
  renderPicker = () => {
    const filteredTopics = this.filterTopics();
    const { selected } = this.state;
    const { topics } = this.props;
    const quickDates = topics.filter(
      t => t.name === "Coffee" || t.name === "Lunch" || t.name === "Dinner"
    );

    const groupedTopics = _.chunk(filteredTopics, 3);
    const groupedQuickDates = _.chunk(quickDates, 3);

    if (filteredTopics.length) {
      return (
        <SectionList
          stickySectionHeadersEnabled={false}
          renderItem={this.renderRow}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{ textAlign: "center", margin: 4 }}>{title}</Text>
          )}
          sections={[
            { title: "QUICK DATES", data: groupedQuickDates },
            { title: "", data: groupedTopics }
            // { title: "Title3", data: ["item5", "item6"] }
          ]}
          keyExtractor={(item, index) => item + index}
          renderSectionFooter={() => (
            <View
              style={{
                alignSelf: "center",
                borderBottomColor: theme.colors.primaryLight,
                borderBottomWidth: 2,
                width: "80%",
                padding: 10
              }}
            />
          )}
        />
      );
    }
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          Sorry! Looks like we do not have a wonder that matches what you are
          looking for.
        </Text>
      </View>
    );
  };

  getPicks = () => {
    const { selected } = this.state;

    const chosenItems = function(arr) {
      const arr2 = ["", "", ""];
      if (arr.length <= 3) {
        for (let i = 0; i < arr2.length; i++) {
          if (arr[i]) {
            arr2[i] = arr[i];
          }
        }
      }
      return arr2;
    };

    let choices = chosenItems(selected);
    return (
      <View style={styles.row}>
        {choices.map((topic, i) => {
          if (topic) {
            return (
              <WonderPickerItem
                key={i}
                topic={topic}
                selected={
                  !!selected.filter((t: Topic) => t.name === topic.name).length
                }
                onPress={this.onChangeSelected}
              />
            );
          } else {
            return (
              <View
                key={i}
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.3,
                  shadowOffset: {
                    width: 0,
                    height: 0
                  },
                  shadowRadius: 5,
                  backgroundColor: "#FFF"
                }}
              >
                <Text>+</Text>
              </View>
            );
          }
        })}
      </View>
    );
  };

  validate = () => {
    const { onSave, onRegister } = this.props;
    const { selected } = this.state;
    if (selected.length === 3) {
      onSave({ topic_ids: selected.map((s: Topic) => s.id) });
      onRegister();
    }
  };

  renderRow = ({ item }: { item: any }) => {
    return <View style={styles.row}>{item.map(this.renderWonder)}</View>;
  };

  renderWonder = (topic: Topic) => {
    const { selected } = this.state;
    return (
      <WonderPickerItem
        key={topic.name}
        topic={topic}
        selected={!!selected.filter((t: Topic) => t.name === topic.name).length}
        onPress={this.onChangeSelected}
      />
    );
  };

  render() {
    const { selected } = this.state;
    const { topics } = this.props;
    const quickDates = topics.filter(
      t => t.name === "Coffee" || t.name === "Lunch" || t.name === "Dinner"
    );

    const groupedTopics = _.chunk(topics, 3);
    const groupedQuickDates = _.chunk(quickDates, 3);

    return (
      <Screen horizontalPadding={10}>
        <View style={{ paddingVertical: 15 }}>
          <Text style={{ textAlign: "center" }}>
            Please select 3{" "}
            <Text style={{ color: theme.colors.primary }}>Wonders</Text> to help
            us find people &amp; activities in your area.
          </Text>
        </View>
        <View>{this.getPicks()}</View>
        <View
          style={{ paddingVertical: 15, width: "80%", alignSelf: "center" }}
        >
          <TextInput
            color={theme.colors.primaryLight}
            containerStyles={{ borderBottomColor: theme.colors.primaryLight }}
            autoCorrect={false}
            autoCapitalize="none"
            icon="search"
            placeholder="Search"
            onChangeText={this.onSearchTextChange}
          />
        </View>
        <View flex={1}>
          {this.renderPicker()}
          <View
            style={{
              position: "absolute",
              bottom: 10,
              width: "100%",
              zIndex: 10
            }}
          >
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

export default connect(
  mapState,
  mapDispatch
)(Register4);

const styles = StyleSheet.create({
  welcome: {
    fontSize: 14,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  row: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
