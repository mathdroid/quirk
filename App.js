import React from "react";
import { StyleSheet, View, Button, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  GrayContainer,
  FormContainer,
  SubHeader,
  RoundedInput,
  RoundedSelector
} from "./ui";
import { saveExercise, getExercise } from "./store";
import distortions from "./distortions";

const defaultState = {
  automaticThought: "",
  cognitiveDistortions: distortions.map(label => {
    return { label, selected: false };
  }),
  challenge: "",
  alternativeThought: ""
};

const textInputStyle = {
  height: 48,
  backgroundColor: "white",
  paddingLeft: 12,
  borderRadius: 12
};
const textInputPlaceholderColor = "#D8D8D8";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
    this.challenge = React.createRef();
    this.alternative = React.createRef();
  }

  componentDidMount = () => {
    getExercise();
  };

  // Toggles Cognitive Distortion when selected
  onSelectCognitiveDistortion = text => {
    this.setState(prevState => {
      const { cognitiveDistortions } = prevState;
      const index = cognitiveDistortions.findIndex(
        ({ label }) => label == text
      );

      cognitiveDistortions[index].selected = !cognitiveDistortions[index]
        .selected;
      return { cognitiveDistortions, ...prevState };
    });
  };

  onTextChange = (key, text) => {
    this.setState({ [key]: text });
  };

  onSave = () => {
    const {
      automaticThought,
      cognitiveDistortions,
      challenge,
      alternativeThought
    } = this.state;

    saveExercise(
      automaticThought,
      cognitiveDistortions,
      challenge,
      alternativeThought
    ).then(() => {
      this.setState(defaultState);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView scrollEnabled={false}>
          <GrayContainer flexGrow={6}>
            <FormContainer>
              <SubHeader>Automatic Thought</SubHeader>
              <TextInput
                style={textInputStyle}
                placeholderTextColor={textInputPlaceholderColor}
                placeholder={"What's going on?"}
                value={this.state.automaticThought}
                onChangeText={text =>
                  this.onTextChange("automaticThought", text)
                }
                onSubmitEditing={() => {
                  this.challenge.current.focus();
                }}
              />
            </FormContainer>

            <FormContainer>
              <SubHeader>Cognitive Distortion</SubHeader>
              <RoundedSelector
                style={{
                  height: 150
                }}
                options={this.state.cognitiveDistortions}
                onPress={this.onSelectCognitiveDistortion}
              />
            </FormContainer>

            <FormContainer>
              <SubHeader>Challenge</SubHeader>
              <TextInput
                style={textInputStyle}
                placeholderTextColor={textInputPlaceholderColor}
                placeholder={"Debate that thought!"}
                value={this.state.challenge}
                onChangeText={text => this.onTextChange("challenge", text)}
                onSubmitEditing={() => {
                  this.alternative.current.focus();
                }}
                ref={this.challenge}
              />
            </FormContainer>

            <FormContainer>
              <SubHeader>Alternative Thought</SubHeader>
              <TextInput
                style={textInputStyle}
                placeholderTextColor={textInputPlaceholderColor}
                placeholder={"What should we think instead?"}
                value={this.state.alternativeThought}
                onChangeText={text =>
                  this.onTextChange("alternativeThought", text)
                }
                ref={this.alternative}
              />
            </FormContainer>

            <FormContainer>
              <Button title={"Save"} onPress={this.onSave} />
            </FormContainer>
          </GrayContainer>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    paddingTop: 75,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 50
  }
});