import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

interface BrandCardProps {
	id: number;
	name: string;
	img_url: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ id, name, img_url }) => {
	return (
		<Card style={{ width: 100, height: 100 }}>
			<Image
				alt={''}
				className='object-cover'
				height={200}
				src={img_url}
				width={200}
			/>
		</Card>
	);
};

export default BrandCard;
