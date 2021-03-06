import React, { useState, useEffect } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";
import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

import { CategorySelect } from "../CategorySelect";

import type { AppRoutesParamList } from "../../routes/app.routes";

interface IFormData {
  name: string;
  amount: number;
}

type RegisterNavigationProps = BottomTabNavigationProp<
  AppRoutesParamList,
  "Cadastrar"
>;

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório."),
  amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo")
    .required("O preço é obrigatório"),
});

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation = useNavigation<RegisterNavigationProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: "up" | "down") {
    setTransactionType(type);
  }

  function hanldeCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function hanldeOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: Partial<IFormData>) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação.");
    }
    if (category.key === "category") {
      return Alert.alert("Selecione categoria.");
    }
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const dataKey = "@gofinances:transactions";
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [...currentData, newTransaction];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar.");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              placeholder="Preço"
              name="amount"
              control={control}
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionTypeSelect("up")}
                isActive={transactionType === "up"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect("down")}
                isActive={transactionType === "down"}
              />
            </TransactionsTypes>
            <CategorySelectButton
              title={category.name}
              onPress={hanldeOpenSelectCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={hanldeCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
