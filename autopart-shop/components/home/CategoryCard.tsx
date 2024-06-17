import React from 'react';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import Link from 'next/link';

interface CategoryCard {
	id: number;
	name: string;
	img_url?: string;
}
export const CategoryCard: React.FC<CategoryCard> = ({ id, name, img_url }) => {
	return (
		<Card isFooterBlurred radius='lg' className='border-none'>
			<Image
				alt='Woman listing to music'
				className='object-cover'
				height={200}
				src='/dvs.webp'
				width={200}
			/>
			<CardFooter className='justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
				<p className='text-tiny text-white/80'>Перейти к</p>
				<Button
					className='text-tiny text-white bg-black/20'
					variant='flat'
					color='default'
					radius='lg'
					size='sm'
				>
					<Link href={`/autopart/${id}`}>{name}</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};
