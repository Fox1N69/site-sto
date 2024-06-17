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
		<Card style={{ width: 100, height: 100 }}>
			<Link href={`/brand/${brand.id}`}>
				<Image
					alt={''}
					className='object-cover'
					height={200}
					src={brand.img_url}
					width={200}
				/>
			</Link>
		</Card>
	);
};

export default BrandCard;
