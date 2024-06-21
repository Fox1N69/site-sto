import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import {
	handleAddToCart,
	checkIfInCart,
	handleRemoveFromCart
} from '@/hooks/fetching';
import { useCartStore } from '@/store/cartStore';
import { AutoPart } from '@/types';

interface ButtonCartProps {
	part: AutoPart;
}

const ButtonCart: React.FC<ButtonCartProps> = ({ part }) => {
	const { data: session } = useSession();
	const { itemsInCart, addItemToCart, setItemsInCart, removeItemFromCart } =
		useCartStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCartStatus = async () => {
			if (session?.user) {
				const inCart = await checkIfInCart(
					session.user.id,
					session.user.token,
					part.id
				);
				if (inCart) {
					addItemToCart(part.id, part.price);
				} else {
					removeItemFromCart(part.id);
				}
			}
		};

		fetchCartStatus();
	}, [part.id, session?.user, setItemsInCart]);

	const onToggleCart = async () => {
		if (session?.user) {
			try {
				setIsLoading(true);
				if (itemsInCart[part.id]) {
					await handleRemoveFromCart({
						token: session.user.token,
						cartItemID: part.id,
						userID: session.user.id
					});
					removeItemFromCart(part.id);
				} else {
					await handleAddToCart({
						userId: session.user.id,
						token: session.user.token,
						autopartID: part.id,
						quantity: 1, // Указываем количество товара для добавления
						setIsLoading,
						setError
					});
					addItemToCart(part.id, part.price);
				}
			} catch (error) {
				setError('Failed to add item to cart');
			} finally {
				setIsLoading(false);
			}
		} else {
			setError('You need to be logged in to add items to the cart');
		}
	};

	const buttonText = itemsInCart[part.id] ? 'В корзине' : 'В корзину';

	return (
		<Button
			className={
				itemsInCart[part.id]
					? 'bg-transparent text-foreground border-default-200'
					: ''
			}
			color='primary'
			radius='full'
			size='sm'
			variant={itemsInCart[part.id] ? 'bordered' : 'solid'}
			onPress={onToggleCart}
			isLoading={isLoading}
			disabled={isLoading}
		>
			{buttonText}
		</Button>
	);
};

export default ButtonCart;
