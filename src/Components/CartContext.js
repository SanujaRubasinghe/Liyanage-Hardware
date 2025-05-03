import { createContext, useContext, useState } from "react";

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item
        )
      } else {
        return [...prev, {...product, quantity: 1}]
      }
    })
  }

  const updateQuantity = (id, delta) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id
          ? {...item, quantity: Math.max(1, item.quantity + delta)}
          : item
      )
    )
  }

  const removeItem = id => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <CartContext.Provider value={{cartItems, addToCart, updateQuantity, removeItem}}>
      {children}
    </CartContext.Provider>
  )
}