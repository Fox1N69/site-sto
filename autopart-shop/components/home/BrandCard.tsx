import { Brand } from '@/types';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface BrandCardProps {
	brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
	return (
		<>
			<Link
				href={`/brand/${brand.id}`}
				style={{ width: 100, height: 100 }}
				className='flex items-center'
			>
				<img
					alt={`Изображение логотипа бренда ${brand.name} для перехода на экран со всеми машиннами данного бренда`}
					className='object-cover'
					height={200}
					src={brand.image_url}
					width={200}
				/>
			</Link>
		</>
	);
};

export default BrandCard;
