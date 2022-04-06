import React from "react";
import TextTicker from "react-native-text-ticker";
import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from "./styles";

interface IHighlightCards {
  title: string;
  amount: string;
  lastTransaction: string;
  type: "up" | "down" | "total";
}

const icon = {
  up: "arrow-up-circle",
  down: "arrow-down-circle",
  total: "dollar-sign",
};

export function HighlightCard({
  type,
  title,
  amount = "R$0,00",
  lastTransaction = "Não existem transações cadastradas",
}: IHighlightCards) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>
      <Footer>
        <TextTicker
          duration={5000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
        >
          <Amount type={type}>{amount}</Amount>
        </TextTicker>
        <LastTransaction type={type}>
          {type === "up" && amount !== "R$0,00" && "Última entrada dia "}
          {type === "down" && amount !== "R$0,00" && "Última saída dia "}
          {lastTransaction}
        </LastTransaction>
      </Footer>
    </Container>
  );
}
