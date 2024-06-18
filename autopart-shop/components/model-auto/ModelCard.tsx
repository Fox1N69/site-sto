import { ModelAuto } from '@/types';
import { Button, Card, CardBody } from '@nextui-org/react';
import Image from 'next/image';

interface ModelCardProps {
	model: ModelAuto;
}

const ModelAutoCard: React.FC<ModelCardProps> = ({ model }) => {
	return (
		<>
			<Card
				isBlurred
				className='border-none bg-background/60 dark:bg-default-100/50 max-w-[810px]'
				shadow='sm'
			>
				<CardBody>
					<div className='flex gap-5'>
						<Image src={model.img_url} alt='' />
						<div className='flex flex-col'>{model.id}</div>
					</div>
				</CardBody>
			</Card>
		</>
	);
};

export default ModelAutoCard;
