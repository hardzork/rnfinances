import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import { IDataList } from "../Dashboard";
import { Container, Header, Title, Content } from "./styles";

interface CategoryData {
  key: string;
  name: string;
  total: string;
  color: string;
}

export function Resume() {
  const [totalByCategory, setTotalByCategory] = useState<CategoryData[]>([]);

  async function loadTransactions() {
    try {
      const dataKey = "@gofinances:transactions";
      const response = await AsyncStorage.getItem(dataKey);
      const transactions: IDataList[] = response ? JSON.parse(response) : [];
      const expenses = transactions.filter(
        (expense) => expense.type === "down"
      );
      const totalByCategory: CategoryData[] = [];
      categories.forEach((category) => {
        let categorySum = 0;
        expenses.forEach((expense) => {
          if (expense.category === category.key) {
            categorySum += Number(expense.amount);
          }
        });
        if (categorySum > 0) {
          totalByCategory.push({
            key: category.key,
            name: category.name,
            total: categorySum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
            color: category.color,
          });
        }
      });
      setTotalByCategory(totalByCategory);
    } catch (error) {}
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content>
        {totalByCategory.map((category) => (
          <HistoryCard
            key={category.key}
            title={category.name}
            amount={category.total}
            color={category.color}
          />
        ))}
      </Content>
    </Container>
  );
}
