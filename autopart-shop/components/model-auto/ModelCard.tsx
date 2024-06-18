'use client';
import { useFetchModelAuto } from '@/hooks/fetching';
import { ModelAuto } from '@/types';
import { Card, CardBody } from '@nextui-org/react';
import Image from 'next/image';

interface ModelCardProps {
	model: ModelAuto;
}

const ModelAutoCard: React.FC<ModelCardProps> = ({ model }) => {
	const brandId = model.brand;
	const modelAuto = useFetchModelAuto({ brandId });

	return (
		<>
			<Card
				isBlurred
				className='border-none bg-background/60 dark:bg-default-100/50 max-w-[810px]'
				shadow='sm'
			>
				<CardBody>
					{modelAuto.map(model => (
						<div className='flex gap-5'>
							<Image src={model.img_url} alt='' />
							<div className='flex flex-col'>{model.id}</div>
							<div>{model.name}</div>
						</div>
					))}
				</CardBody>
			</Card>
		</>
	);
};

export default ModelAutoCard;
