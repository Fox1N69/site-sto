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
	useCartStore();

	const { data: session } = useSession();
	const { itemsInCart, addItemToCart, removeItemFromCart } = useCartStore();
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
					addItemToCart(part.id, part.price, part.name, part.img);
				} else {
					removeItemFromCart(part.id);
				}
			}
		};

		fetchCartStatus();
	}, [part.id, session?.user, addItemToCart, removeItemFromCart]);

	const onToggleCart = async () => {
		if (session?.user) {
			try {
				setIsLoading(true);
				if (itemsInCart[part.id]) {
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
		<>
			{!itemsInCart[part.id] ? (
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
