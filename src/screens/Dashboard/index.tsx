import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";
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
  LoadingContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";

export interface IDataList extends ITransactionCard {
  id: string;
}

interface HighlightProps {
  amount: string;
  date: string;
}

interface IHighlightData {
  revenue: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<IDataList[]>([]);
  const [highlightData, setHighlightData] = useState<IHighlightData>(
    {} as IHighlightData
  );
  const dataKey = "@gofinances:transactions";
  const theme = useTheme();

  async function loadTransactions() {
    try {
      const response = await AsyncStorage.getItem(dataKey);
      const transactions: IDataList[] = response ? JSON.parse(response) : [];
      const transactionsSorted = transactions.sort(
        (a: IDataList, b: IDataList) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      let expensesSum = 0;
      let revenueSum = 0;

      const transactionsFormatted: IDataList[] = transactionsSorted.map(
        (transaction: IDataList) => {
          if (transaction.type === "up") {
            revenueSum += Number(transaction.amount);
          }
          if (transaction.type === "down") {
            expensesSum += Number(transaction.amount);
          }
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

      setTransactions(transactionsFormatted);

      const [lastTransactionRevenue] = transactionsSorted.filter(
        (transaction) => transaction.type === "up"
      );
      const [lastTransactionExpense] = transactionsSorted.filter(
        (transaction) => transaction.type === "down"
      );

      setHighlightData({
        expenses: {
          amount: expensesSum.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          date: Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
          }).format(new Date(lastTransactionExpense.date)),
        },
        revenue: {
          amount: revenueSum.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          date: Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
          }).format(new Date(lastTransactionRevenue.date)),
        },
        total: {
          amount: (revenueSum - expensesSum).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          date: `${Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(
            new Date(transactionsSorted[transactionsSorted.length - 1].date)
          )} - ${Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(transactionsSorted[0].date))}`,
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
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
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
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
              amount={highlightData?.revenue?.amount}
              lastTransaction={`Última entrada dia ${highlightData?.revenue?.date}`}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData?.expenses?.amount}
              lastTransaction={`Última saída dia ${highlightData?.expenses?.date}`}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData?.total?.amount}
              lastTransaction={highlightData?.total?.date}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
