import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

const BrandCard: React.FC = () => {
	return (
		<Card style={{ width: 100, height: 100 }}>
			<Image
				alt='Woman listing to music'
				className='object-cover'
				height={200}
				src='/dvs.webp'
				width={200}
			/>
		</Card>
	);
};

export default BrandCard;
