import React, { useEffect, useState } from 'react';
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
	const { itemsInCart, addItemToCart, removeItemFromCart } = useCartStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [inCart, setInCart] = useState(false); // Добавлено состояние для отслеживания наличия товара в корзине

	useEffect(() => {
		const fetchCartStatus = async () => {
			if (session?.user) {
				try {
					const inCartResponse = await checkIfInCart(
						session.user.id,
						session.user.token,
						[part.id]
					);
					setInCart(inCartResponse[part.id]); // Установка состояния в зависимости от ответа сервера
				} catch (error) {
					console.error('Failed to fetch cart status:', error);
				}
			}
		};

		fetchCartStatus();
	}, [part.id, session?.user]);

	const onToggleCart = async () => {
		if (session?.user) {
			try {
				setIsLoading(true);
				if (inCart) {
					await handleRemoveFromCart({
						token: session.user.token,
						cartItemID: part.id,
						userID: session.user.id
					});
					removeItemFromCart(part.id);
					setInCart(false); // Обновление состояния в компоненте
				} else {
					await handleAddToCart({
						userId: session.user.id,
						token: session.user.token,
						autopartID: part.id,
						quantity: 1,
						setIsLoading,
						setError
					});
					addItemToCart(part.id, part.price, part.name, part.img);
					setInCart(true); // Обновление состояния в компоненте
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

	const buttonText = inCart ? 'В корзине' : 'В корзину';

	return (
		<Button
			className={
				inCart ? 'bg-transparent text-foreground border-default-200' : ''
			}
			color='primary'
			radius='full'
			size='sm'
			variant={inCart ? 'bordered' : 'solid'}
			onPress={onToggleCart}
			isLoading={isLoading}
			disabled={isLoading}
		>
			{buttonText}
		</Button>
	);
};

export default ButtonCart;
