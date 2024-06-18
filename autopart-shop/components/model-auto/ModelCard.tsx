'use client';
import { useFetchModelAuto } from '@/hooks/fetching';
import { ModelAuto } from '@/types';
import { Card, CardBody } from '@nextui-org/react';
import Image from 'next/image';

interface ModelAutoCardProps {
	model: ModelAuto;
}

const ModelAutoCard: React.FC<ModelAutoCardProps> = ({ model }) => {
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
							<p>{model.name}</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</>
	);
};

export default ModelAutoCard;
