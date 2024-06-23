'use client';
import React, { useState } from 'react';
import { AutoPart } from '@/types';
import axios from 'axios';
import AutoPartCarousel from '@/components/autopart/AutopartCorusel/corusel';
import { useFetchPartById } from '@/hooks/fetching';
import { DevIcon } from '../icons/sidebar/dev-icon';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useCartStore } from '@/store/cartStore';

export const AutoPartContent = ({ id }: { id: number }) => {
	const { part, error, isLoading } = useFetchPartById(id);
	const [isBtnActive, setBtnActive] = useState<boolean>(false);
	const { itemsInCart, removeItemFromCart, addItemToCart } = useCartStore();
	const buttonText =
		isBtnActive === false ? 'Добавить в корзину' : 'Перейти в корзину';

	return (
		<>
			{isLoading ? (
				<p>loading...</p>
			) : (
				<div className='flex justify-between items-center'>
					<div className='flex gap-10'>
						<div className='min-w-[325px] h-[250px] border-1'>{part?.img}</div>
						<div className='flex flex-col gap-14'>
							<div className='flex flex-col gap-5'>
								<h2 className='font-bold text-4xl'>{part?.name}</h2>
								<p>{part?.model_name}</p>
							</div>
							<div className='flex flex-col'>
								{part?.auto_part_info?.map(info => (
									<div className='flex items-center gap-5'>
										<h3 className=' font-medium text-lg'>{info.title}:</h3>
										<p>{info.description}</p>
									</div>
								))}
							</div>
						</div>
					</div>
					<div>
						<Card className='w-[225px] h-[160px] pb-3 '>
							<CardHeader className='flex justify-between'>
								<>
									<p className='font-semibold text-2xl'>Цена: </p>
									<div className='border-1 rounded-lg p-2'>
										<h3 className='font-semibold text-2xl'>{part?.price}р</h3>
									</div>
								</>
							</CardHeader>
							<CardBody>
								<Button
									className='w-full'
									variant={isBtnActive === false ? 'shadow' : 'ghost'}
									color={isBtnActive === false ? 'primary' : 'success'}
								>
									{buttonText}
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			)}
		</>
	);
};
