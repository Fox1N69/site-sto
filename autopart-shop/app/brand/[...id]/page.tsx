'use client';
import ModelAutoCard from '@/components/model-auto/ModelCard';
import { useFetchAllModelAuto, useFetchModelAuto } from '@/hooks/fetching';
import { ModelAuto } from '@/types';
import { useEffect } from 'react';

export default function BrandPage({
	params,
	model
}: {
	params: { id: number };
	model: ModelAuto;
}) {
	const brandId = params.id;
	const modelAuto = useFetchModelAuto({ brandId });

	const chunkedModelAuto = [];
	for (let i = 0; i < modelAuto.length; i += 4) {
		chunkedModelAuto.push(modelAuto.slice(i, i + 4));
	}

	return (
		<div className='container mx-auto'>
			{chunkedModelAuto.map((chunk, chunkIndex) => (
				<div
					key={chunkIndex}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'
				>
					{chunk.map((model, index) => (
						<div
							key={index}
							className='flex w-full justify-center items-center'
						>
							<ModelAutoCard key={model.id} model={model} />
						</div>
					))}
				</div>
			))}
		</div>
	);
}
