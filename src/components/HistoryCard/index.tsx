import React from "react";
import { Container, Title, Amount } from "./styles";

interface IHistoryCard {
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({ title, amount, color }: IHistoryCard) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}
