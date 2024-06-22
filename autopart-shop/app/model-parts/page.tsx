'use client';

import Filters from '@/components/filters';
import FullCard from '@/components/product/ProductCard/FullCard';
import { useFetchAutoParts } from '@/hooks/fetching';
import { AutoPart } from '@/types';

export default function AutoParts() {
	const autoParts = useFetchAutoParts();

	const chunkedAutoParts = (arr: AutoPart[], chunkSize: number) => {
		const chunks = [];
		for (let i = 0; i < arr.length; i += chunkSize) {
			chunks.push(arr.slice(i, i + chunkSize));
		}
		return chunks;
	};

	const autoPartChunks = chunkedAutoParts(autoParts, 5);

	return (
		<div className='flex min-h-screen flex-col items-center pt-24 pl-0 pr-24 gap-20'>
			<div className='main__container flex justify-between w-full'>
				<div className='fileter'>
					<Filters />
				</div>
				<div className='autopart__cards flex gap-5 justify-center  flex-col'>
					{autoParts.map(part => (
						<FullCard key={part.id} part={part} />
					))}
				</div>
			</div>
		</div>
	);
}
