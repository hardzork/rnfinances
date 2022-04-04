import { View, Text } from "react-native";
import React from "react";
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from "./styles";
import { categories } from "../../utils/categories";

export interface ITransactionCard {
  type: "up" | "down";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface IProps {
  data: ITransactionCard;
}

export function TransactionCard({ data }: IProps) {
  const [category] = categories.filter((item) => item.key === data.category);
  return (
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
  );
}
