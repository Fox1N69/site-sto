'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import FullCard from '@/components/autopart/ProductCard/FullCard';
import { PartCard } from '@/components/autopart/ProductCard/PartCard';
import { AutoPart } from '@/types';
import Grid from '@/components/grid';

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

	const chunkedAutoParts = [];
	for (let i = 0; i < autoParts.length; i += 4) {
		chunkedAutoParts.push(autoParts.slice(i, i + 4));
	}

	return (
		<div className='container'>
			<h3 className='text-3xl font-bold'>
				Запчасти для: {model_name} {year} года
			</h3>
			<div className=' mt-10 flex flex-col gap-20'>
				{chunkedAutoParts.map((chunk, chunkIndex) => (
					<div className='flex gap-20' key={chunkIndex}>
						{chunk.map(part => (
							<PartCard key={part.id} part={part} />
						))}
						
					</div>
				))}
			</div>
		</div>
	);
};

export default AutoPartPage;
