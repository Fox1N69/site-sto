'use client';
import { useCartStore } from '@/store/cartStore';
import { Input, Textarea } from '@nextui-org/input';
import { DevIcon } from '../../components/icons/sidebar/dev-icon';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';

export default function CheckOutPage() {
	const { itemsInCart, totalPrice } = useCartStore();

	return (
		<section className=''>
			<div className='flex gap-5'>
				{Object.values(itemsInCart).map(item => (
					<>
						<p>{item.name}</p>
						<p>{item.price}</p>
					</>
				))}
			</div>

			<div className='flex flex-col justify-center items-center mt-20'>
				<Card className='w-[50%] mt-5 py-4 pb-5'>
					<CardHeader className='flex justify-center'>
						<h1 className=''>Оформление заявки</h1>
					</CardHeader>
					<CardBody className='flex flex-col justify-center items-center'>
						<form action='submit' className='w-[90%] flex flex-col gap-5'>
							<Input
								label='Город'
								labelPlacement='outside'
								variant='flat'
								color='primary'
							/>
							<Input
								label='Адресс доставки'
								labelPlacement='outside'
								variant='flat'
								color='primary'
							/>
							<Textarea
								type='text'
								label='Комментарий'
								labelPlacement='outside'
								variant='flat'
								color='primary'
							/>
						</form>
						<div className='w-[90%] mt-20 flex flex-col gap-5'>
							<p>Общая стоимость заказа: {totalPrice}</p>
							<Button variant='ghost' color='primary' className='w-full'>
								Оформить
							</Button>
						</div>
					</CardBody>
				</Card>
			</div>
		</section>
	);
}
