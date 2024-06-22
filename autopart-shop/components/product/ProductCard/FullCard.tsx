import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/react';
import {
	handleAddToCart,
	checkIfInCart,
	handleRemoveFromCart
} from '@/hooks/fetching';
import { useCartStore } from '@/store/cartStore';
import { AutoPart } from '@/types';

interface CardProps {
	part: AutoPart;
}

const FullCard: React.FC<CardProps> = ({ part }) => {
	const router = useRouter();
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
				setItemsInCart({});
			}
		};

		fetchCartStatus();
	}, [part.id, session?.user, setItemsInCart]);

	const handleRouteToCard = () => {
		router.push(`/autopart/${part.id}`);
	};

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
		<Card
			isBlurred
			className='border-none bg-background/60 dark:bg-default-100/50 max-w-[810px]'
			shadow='sm'
		>
			<CardBody>
				<div className='flex gap-10'>
					<div className='relative w-[25%]'>
						<img src={part.img} alt='' className='w-full h-full rounded-lg' />
					</div>
					<div className='flex flex-col col-span-6 md:col-span-8 w-[50%]'>
						<div className='flex justify-between items-start'>
							<div className='flex flex-col gap-0'>
								<h3 className='font-semibold text-foreground/90'>
									{part.name}
								</h3>
								<p className='text-small text-foreground/80'>
									{part.model_name}
								</p>
								<h1 className='text-large font-medium mt-2'>{'Описание:'}</h1>
								<p className=' font-light'>
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Explicabo cupiditate officiis quisquam reiciendis placeat! Ex
								</p>
							</div>
						</div>
						<div className='flex flex-col mt-3 gap-1'>
							<div className='flex justify-between'>
								<p className=' text-small'>рейтинг || отзывы</p>
							</div>
						</div>
					</div>
					<div className='flex items-start justify-center'>
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
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default FullCard;
