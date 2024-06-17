'use client';

import Banner from '@/components/Banner/banner';
import Card from '@/components/product/ProductCard/Card';
import { AutoPart } from '@/types';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Navbar } from '@nextui-org/navbar';
import { AuthProvider } from '@/components/context/authContext';
import { useRouter } from 'next/navigation';
import { useFetchAutoParts } from '@/hooks/fetching';
import Example from '@/components/cart/CartModal';
import { Button } from '@nextui-org/button';
import { PartCard } from '@/components/product/ProductCard/PartCard';
import { CategoryCard } from '@/components/home/CategoryCard';

export default function Home() {
	const router = useRouter();
	const autoParts = useFetchAutoParts();

	return (
		<main className='flex min-h-screen flex-col items-center p-24 gap-20'>
			<div className='main__container'>
				<Banner />
				<div className='category__cards w-[200px]'>
					<CategoryCard key={1} id={1} name='Двигатель' />
				</div>
				<div className='autopart__cards flex gap-5 justify-center mt-20'>
					{autoParts.slice(0, 5).map(part => (
						<PartCard key={part.id} part={part} />
					))}
				</div>
			</div>
		</main>
	);
}
