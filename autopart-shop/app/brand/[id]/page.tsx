'use client';
import ModelAutoCard from '@/components/model-auto/ModelCard';
import { useFetchAllModelAuto, useFetchModelAuto } from '@/hooks/fetching';
import { ModelAuto } from '@/types';

export default function BrandPage({
	params,
	model
}: {
	params: { id: number };
	model: ModelAuto;
}) {
	const brandId = params.id;
	const modelAuto = useFetchModelAuto({ brandId });
	return (
		<div>
			<div className='container'>
				{modelAuto.map(model => (
					<ModelAutoCard model={model} />
				))}
			</div>
		</div>
	);
}
