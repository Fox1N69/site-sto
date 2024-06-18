'use client';
import { useFetchModelAuto } from '@/hooks/fetching';
import { Brand, ModelAuto } from '@/types';
import { Card, CardBody } from '@nextui-org/react';
import Image from 'next/image';

interface ModelAutoCardProps {
	model: ModelAuto;
}

const ModelAutoCard: React.FC<ModelAutoCardProps> = ({ model }) => {
	const brand_name = model.Brand?.name;
	const modelName = `${brand_name} ${model.name}`;
	return (
		<>
			<Card
				isBlurred
				className='border-none bg-background/60 dark:bg-default-100/50 max-w-[350px] px-4 h-[100px]'
				shadow='sm'
			>
				<CardBody className=''>
					<div className='flex w-[350px] items-center gap-5'>
						<img src={model.img_url} alt='' width={100} />
						<div className='font-medium text-2xl'>
							<p>{modelName}</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</>
	);
};

export default ModelAutoCard;
