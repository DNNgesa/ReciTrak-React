import { createContext, useContext, useEffect, useState } from "react";
import { databaseApi } from "../constants";

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${databaseApi}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const value = {
    orders,
    setOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
