import { View, Text } from "react-native";
import React from "react";

interface IWelcome {
  title: string;
}

export function Welcome({ title }: IWelcome) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
