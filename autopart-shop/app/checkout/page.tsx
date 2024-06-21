'use client';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { useState } from 'react';

export default function CheckOutPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const { itemsInCart, totalPrice } = useCartStore();

	return (
		<section>
			<ul>
				{Object.values(itemsInCart).map(item => (
					<li key={item.id}>
						<p>{item.name}</p>
						<p>{item.price}</p>
						<p>{item.quantity}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
