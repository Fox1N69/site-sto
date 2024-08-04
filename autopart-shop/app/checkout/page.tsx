'use client';
import { useState, useEffect } from 'react';
import {
	Button,
	Input,
	Textarea,
	Card,
	CardBody,
	CardHeader
} from '@nextui-org/react';
import axios from 'axios';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function CheckOutPage() {
	const { itemsInCart, totalPrice } = useCartStore();
	const router = useRouter();

	const [city, setCity] = useState('');
	const [address, setAddress] = useState('');
	const [comment, setComment] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');

	useEffect(() => {
		const vinOrder = JSON.parse(localStorage.getItem('vin_order') || '{}');
		if (!vinOrder.vin_number) {
			router.push('/');
		}
	}, [router]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const vinOrder = JSON.parse(localStorage.getItem('vin_order') || '{}');

		const orderData = {
			order: {
				status: 'pending',
				email,
				phone_number: phone,
				delivery_city: city,
				delivery_address: address,
				delivery_cost: totalPrice,
				payment_method: 'credit_card',
				comment,
				tracking_number: 'TRACK12345'
			},
			vin_order: vinOrder
		};

		try {
			await axios.post('http://localhost:4001/api/order', orderData);
			localStorage.removeItem('vin_order');
			router.push('/success'); // Перенаправление на страницу успеха
		} catch (error) {
			console.error('Ошибка отправки данных:', error);
		}
	};

	return (
		<section className=''>
			<div className='flex gap-5'>
				{Object.values(itemsInCart).map((item, index) => (
					<div key={index}>
						<p>{item.name}</p>
						<p>{item.price}</p>
					</div>
				))}
			</div>

			<div className='flex flex-col justify-center items-center mt-20'>
				<Card className='w-[50%] mt-5 py-4 pb-5'>
					<CardHeader className='flex justify-center'>
						<h1>Оформление заявки</h1>
					</CardHeader>
					<CardBody className='flex flex-col justify-center items-center'>
						<form
							onSubmit={handleSubmit}
							className='w-[90%] flex flex-col gap-5'
						>
							<Input
								label='Город'
								labelPlacement='outside'
								variant='flat'
								color='primary'
								value={city}
								onChange={e => setCity(e.target.value)}
							/>
							<Input
								label='Адрес доставки'
								labelPlacement='outside'
								variant='flat'
								color='primary'
								value={address}
								onChange={e => setAddress(e.target.value)}
							/>
							<Textarea
								type='text'
								label='Комментарий'
								labelPlacement='outside'
								variant='flat'
								color='primary'
								value={comment}
								onChange={e => setComment(e.target.value)}
							/>
							<Input
								label='Email'
								labelPlacement='outside'
								variant='flat'
								color='primary'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<Input
								label='Телефон'
								labelPlacement='outside'
								variant='flat'
								color='primary'
								value={phone}
								onChange={e => setPhone(e.target.value)}
							/>
							<div className='w-[90%] mt-20 flex flex-col gap-5'>
								<p>Общая стоимость заказа: {totalPrice}</p>
								<Button
									type='submit'
									variant='ghost'
									color='primary'
									className='w-full'
								>
									Оформить
								</Button>
							</div>
						</form>
					</CardBody>
				</Card>
			</div>
		</section>
	);
}
