'use client';
import { useCartStore } from '@/store/cartStore';
import { Input } from '@nextui-org/input';
import { DevIcon } from '../../components/icons/sidebar/dev-icon';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default function CheckOutPage() {
	const { itemsInCart, totalPrice } = useCartStore();

	return (
		<section>
			<div className='flex gap-5'>
				{Object.values(itemsInCart).map(item => (
					<>
						<p>{item.name}</p>
						<p>{item.price}</p>
					</>
				))}
			</div>

			<div>
				<form action=''>
					<Input label='test' />
				</form>
			</div>
		</section>
	);
}
