import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
	id: number;
	price: number;
	quantity: number;
};

type CartStore = {
	itemsInCart: { [key: number]: CartItem };
	itemCount: number;
	totalPrice: number;
	setItemsInCart: (items: { [key: number]: CartItem }) => void;
	addItemToCart: (id: number, price: number) => void;
	removeItemFromCart: (id: number) => void;
	resetItemCount: () => void;
	calculateTotalPrice: () => void;
	setTotalPrice: (newTotalPrice: number) => void;
};

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			itemsInCart: {},
			itemCount: 0,
			totalPrice: 0,
			setItemsInCart: items =>
				set(state => ({ itemsInCart: { ...state.itemsInCart, ...items } })),
			addItemToCart: (id, price) =>
				set(state => {
					const updatedItems = { ...state.itemsInCart };
					if (updatedItems[id]) {
						updatedItems[id].quantity += 1;
					} else {
						updatedItems[id] = { id, price, quantity: 1 };
					}
					return {
						itemsInCart: updatedItems,
						itemCount: state.itemCount + 1
					};
				}),
			removeItemFromCart: id =>
				set(state => {
					const updatedItems = { ...state.itemsInCart };
					if (updatedItems[id]) {
						updatedItems[id].quantity -= 1;
						if (updatedItems[id].quantity <= 0) {
							delete updatedItems[id];
						}
					}
					return {
						itemsInCart: updatedItems,
						itemCount: Math.max(0, state.itemCount - 1)
					};
				}),
			resetItemCount: () => set({ itemCount: 0 }),
			calculateTotalPrice: () =>
				set(state => {
					const totalPrice = Object.values(state.itemsInCart).reduce(
						(total, item) => total + item.price * item.quantity,
						0
					);
					return { totalPrice };
				}),
			setTotalPrice: newTotalPrice => set({ totalPrice: newTotalPrice })
		}),
		{
			name: 'cart-storage'
		}
	)
);
