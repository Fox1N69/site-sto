'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import FullCard from '@/components/product/ProductCard/FullCard';
import { PartCard } from '@/components/product/ProductCard/PartCard';
import { AutoPart } from '@/types';

interface AutoPartPageProps {
	params: {
		model_name: string;
		year: string;
	};
}

const AutoPartPage: React.FC<AutoPartPageProps> = ({ params }) => {
	const [autoParts, setAutoParts] = useState<AutoPart[]>([]);
	const { model_name, year } = params;
	const query = useSearchParams();

	useEffect(() => {
		const fetchAutoParts = async () => {
			const response = await fetch(
				`http://localhost:4000/shop/auto-parts?model_name=${model_name}&year=${year}`
			);
			const data = await response.json();
			setAutoParts(data);
		};
		fetchAutoParts();
	}, [model_name, year]);

	return (
		<div className='container mx-auto'>
			<h4>
				Запчасти для: {model_name} {year} года
			</h4>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
				<div className='flex w-full justify-center items-center'>
					{autoParts.map(part => (
						<PartCard key={part.id} part={part} />
					))}
				</div>
			</div>
		</div>
	);
};

export default AutoPartPage;
