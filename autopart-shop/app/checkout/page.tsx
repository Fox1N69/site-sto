'use client';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { useState } from 'react';

export default function CheckOutPage() {
	const [products, setProducts] = useState<Product[]>([]);

	return (
		<section>
			<div>
				{products.map(product => (
					<div>{product.id}</div>
				))}
			</div>
		</section>
	);
}
