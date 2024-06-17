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
import BrandCard from '@/components/home/BrandCard';

export default function Home() {
	const router = useRouter();
	const autoParts = useFetchAutoParts();

	return (
		<main className='flex min-h-screen flex-col items-center p-24 gap-20'>
			<div className='main__container'>
				<Banner />
				<section className='brand__cards flex flex-col gap-4'>
					<h3 className='font-bold text-2xl'>Бренды</h3>
					<div className='flex gap-5'>
						<BrandCard />
					</div>
				</section>
				<section className='category__cards flex flex-col gap-4 mt-20'>
					<h3 className='font-bold text-2xl'>Категории</h3>
					<div className='flex gap-5'>
						<CategoryCard key={1} id={1} name='Двигатель' />
						<CategoryCard key={2} id={2} name='Кузов' />
						<CategoryCard key={2} id={2} name='Кузов' />
						<CategoryCard key={2} id={2} name='Кузов' />
						<CategoryCard key={2} id={2} name='Кузов' />
						<CategoryCard key={2} id={2} name='Кузов' />
					</div>
				</section>
				<section className='flex flex-col mt-20 gap-4'>
					<h3 className='font-bold text-2xl'>Новые автозапчасти</h3>
					<div className='autopart__cards flex gap-5 justify-center '>
						{autoParts.slice(0, 5).map(part => (
							<PartCard key={part.id} part={part} />
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
