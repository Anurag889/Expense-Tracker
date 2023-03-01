import React, { useEffect, createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

// Initial state
const initialState = {
  transactions: JSON.parse(localStorage.getItem("transactions")) || [],
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function deleteTransaction(id) {
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: id,
    });

    // Remove transaction from local storage
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
    const updatedTransactions = storedTransactions.filter(
      (transaction) => transaction.id !== id
    );
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  }

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });

    // Add transaction to local storage
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
    const updatedTransactions = [...storedTransactions, transaction];
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  }

  // Load transactions from local storage
  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (storedTransactions) {
      dispatch({
        type: "SET_TRANSACTIONS",
        payload: storedTransactions,
      });
    }
  }, []);

  // Save transactions to local storage when state.transactions changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
