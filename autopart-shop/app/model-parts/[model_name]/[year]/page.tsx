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
		<div className='container'>
			<h4>
				Запчасти для: {model_name} {year} года
			</h4>
			<div className='flex flex-col'>
				<div className='flex gap-20'>
					{autoParts.map(part => (
						<PartCard key={part.id} part={part} />
					))}
				</div>
			</div>
		</div>
	);
};

export default AutoPartPage;
