import { CartItem } from '@/types/type';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ShoppingCartState {
    cartItems: CartItem[];
    addProductToCart: (product: CartItem) => void;
    removeProductFromCart: (id: string) => void;
    updateProductQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

export const useShoppingCart = create<ShoppingCartState>()(
    persist(
        (set) => ({
            cartItems: [],
            addProductToCart: (product) => set((state) => {
                if(state.cartItems.find((item) => item.id === product.id)) return { cartItems: state.cartItems.map((item) => (item.id === product.id ? product: item)) }
                return { cartItems: [...state.cartItems, product] }
            }),
            removeProductFromCart: (id) => set((state) => ({ cartItems: state.cartItems.filter((item) => item.id !== id) })),
            updateProductQuantity: (id, quantity) =>
                set((state) => ({
                    cartItems: state.cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
                })
            ),
            clearCart: () => set({ cartItems: []}),
        }),
        {
            name: 'shopping-cart', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
