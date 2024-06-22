import AddToCartButton from '@/components/cart/AddToCartButton';
import { AutoPart } from '@/types';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CardProps {
	part: AutoPart;
}

export const PartCard: React.FC<CardProps> = ({ part }) => {
	return (
		<Link href={`/auto-part/${part.id}`}>
			<Card className='w-[250px] h-[340px]'>
				<CardHeader className='h-[180px]'>
					<img src={part.img} alt='' className='rounded-md h-full w-full' />
				</CardHeader>

				<CardBody>
					<h4 className='font-medium'>{part.name}</h4>
					<p className=' font-light'>{part.model_name}</p>
					<div className='description'>
						<p>Описание:</p>
						{part.auto_part_info?.map(info => (
							<p key={info.id}>{info.description}</p>
						))}
					</div>
				</CardBody>
				<CardFooter className='flex justify-between'>
					<p>Цена: {part.price}</p>
					<AddToCartButton key={part.id} part={part} />
				</CardFooter>
			</Card>
		</Link>
	);
};
