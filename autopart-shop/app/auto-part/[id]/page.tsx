'use client';
import { AutoPartContent } from '@/components/autopart/content';
import { useFetchAutoParts, useFetchPartById } from '@/hooks/fetching';
import axios from 'axios';
import { DevIcon } from '../../../components/icons/sidebar/dev-icon';
import { useEffect, useState } from 'react';
import { PartCard } from '@/components/autopart/ProductCard/PartCard';

const AutoPart = ({ params }: { params: { id: number } }) => {
	const id = params.id;
	const parts = useFetchAutoParts();

	return (
		<section className='flex flex-col gap-20'>
			<AutoPartContent id={id} />
			<div className='flex flex-col gap-4'>
				<h2 className='font-semibold text-2xl'>Еще запчасти: </h2>
				<div className='flex gap-5'>
					{parts.slice(0, 5).map(item => (
						<PartCard part={item} />
					))}
				</div>
			</div>
		</section>
	);
};

export default AutoPart;
