import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  ITransactionCard,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";

export interface IDataList extends ITransactionCard {
  id: string;
}

export function Dashboard() {
  const [data, setData] = useState<IDataList[]>([]);
  const dataKey = "@gofinances:transactions";

  async function loadTransactions() {
    try {
      const response = await AsyncStorage.getItem(dataKey);
      const transactions: IDataList[] = response ? JSON.parse(response) : [];
      const transactionsSorted = transactions.sort(
        (a: IDataList, b: IDataList) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const transactionsFormatted: IDataList[] = transactionsSorted.map(
        (transaction: IDataList) => {
          const amount = Number(transaction.amount).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          const dateFormatted = Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }).format(new Date(transaction.date));

          return {
            id: transaction.id,
            name: transaction.name,
            category: transaction.category,
            amount,
            type: transaction.type,
            date: dateFormatted,
          };
        }
      );
      setData(transactionsFormatted);
      console.log(transactionsFormatted);
    } catch (error) {}
  }

  useEffect(() => {
    // AsyncStorage.removeItem(dataKey);
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: "https://github.com/hardzork.png" }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Robinson</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
