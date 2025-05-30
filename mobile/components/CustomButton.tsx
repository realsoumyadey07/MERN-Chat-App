import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

interface CustomButtonType {
  title: String;
  textStyle: Object;
  buttonStyle: Object;
  handleSubmit: () => void;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  textStyle,
  buttonStyle,
  handleSubmit,
  isLoading,
}: CustomButtonType) => {
  return (
    <TouchableOpacity style={buttonStyle} onPress={() => handleSubmit()}>
      <Text style={textStyle}>
        {isLoading ? <ActivityIndicator size="small" color="white" /> : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
