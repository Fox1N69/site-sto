import CartCounter from '@/components/cart/CartCouter';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';
import { AutoPart } from '@/types';
import { useSession } from 'next-auth/react';
import {
	checkIfInCart,
	handleAddToCart,
	handleRemoveFromCart
} from '@/hooks/fetching';
import CartModal from '@/components/cart/CartModal';

interface PartActionProps {
	part: AutoPart;
}

export const PartAction: React.FC<PartActionProps> = ({ part }) => {
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
					console.log('Открыть коризну');
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
		<>
			{!inCart ? (
				<Button
					className='w-full'
					variant={'shadow'}
					color={'primary'}
					onPress={onToggleCart}
					isLoading={isLoading}
				>
					{buttonText}
				</Button>
			) : (
				<div className='flex flex-row gap-4'>
					<Button
						className='w-full'
						variant={'ghost'}
						color={'success'}
						onPress={onToggleCart}
						isLoading={isLoading}
					>
						{buttonText}
					</Button>
					<CartCounter
						autoPartID={part.id}
						initialQuantity={1}
						onQuantityChange={() => 'hello counter'}
					/>
				</div>
			)}
		</>
	);
};
