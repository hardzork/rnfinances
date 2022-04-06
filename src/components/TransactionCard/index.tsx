import Swipeable from "react-native-gesture-handler/Swipeable";
import React from "react";
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  RemoveIcon,
  CategoryName,
  Date,
} from "./styles";
import { categories } from "../../utils/categories";
import { View, Animated } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useTheme } from "styled-components";

export interface ITransactionCard {
  id: string;
  type: "up" | "down";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface IProps {
  data: ITransactionCard;
  onRemove: (id: string) => void;
}

export function TransactionCard({ data, onRemove }: IProps) {
  const [category] = categories.filter((item) => item.key === data.category);
  const theme = useTheme();
  let _swipeableRow: Swipeable;

  const updateRef = (ref: Swipeable) => {
    _swipeableRow = ref;
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [128, 0],
    });
    return (
      <View
        style={{
          width: 128,
          marginLeft: -12,
          marginBottom: 16,
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX: trans }],
          }}
        >
          <RectButton
            style={[
              {
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              },
              { backgroundColor: theme.colors.attention },
            ]}
            onPress={() => onRemove(data.id)}
          >
            <RemoveIcon name="trash-2" />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={updateRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <Container>
        <Title>{data.name}</Title>
        <Amount type={data.type}>
          {data.type === "down" && "- "}
          {data.amount}
        </Amount>
        <Footer>
          <Category>
            <Icon name={category.icon} />
            <CategoryName>{category.name}</CategoryName>
          </Category>
          <Date>{data.date}</Date>
        </Footer>
      </Container>
    </Swipeable>
  );
}
