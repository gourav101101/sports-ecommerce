import React, { createContext } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // ...cart logic...
  return (
    <CartContext.Provider value={{}}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

