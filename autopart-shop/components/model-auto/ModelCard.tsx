'use client';
import { useFetchModelAuto } from '@/hooks/fetching';
import { Brand, ModelAuto } from '@/types';
import { Icon } from '@iconify/react';
import {
	Card,
	CardBody,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger
} from '@nextui-org/react';
import Image from 'next/image';
import { release } from 'os';
import { useEffect, useState } from 'react';

interface ModelAutoCardProps {
	model: ModelAuto;
}

const ModelAutoCard: React.FC<ModelAutoCardProps> = ({ model }) => {
	const brand_name = model.Brand?.name;
	const modelName = `${brand_name} ${model.name}`;
	const [selectedYear, setSelectedYear] = useState<number>(0);

	console.log(selectedYear);

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
							<Dropdown>
								<DropdownTrigger className='gap-2 items-center text-sm cursor-pointer'>
									<p className='flex'>
										Выберите год
										<Icon
											icon='ic:round-keyboard-arrow-down'
											width={20}
											height={20}
										/>
									</p>
								</DropdownTrigger>
								{model.release_year && model.release_year.length > 0 && (
									<DropdownMenu
										aria-label='Dynamic Actions'
										onAction={year => setSelectedYear(year as number)}
									>
										{model.release_year.map(year => (
											<DropdownItem key={year}>{year}</DropdownItem>
										))}
									</DropdownMenu>
								)}
							</Dropdown>
						</div>
					</div>
				</CardBody>
			</Card>
		</>
	);
};

export default ModelAutoCard;
