'use client';
import React from 'react';
import { AutoPart } from '@/types';
import axios from 'axios';
import AutoPartCarousel from '@/components/autopart/AutopartCorusel/corusel';
import { useFetchPartById } from '@/hooks/fetching';

export const AutoPartContent = ({ id }: { id: number }) => {
	const { part, error } = useFetchPartById(id);

	return (
		<div className=''>
			<div className='flex gap-14'>
				<div className='w-[300px] h-[250px] border-1'>
					<img src={part?.img} alt='' />
				</div>
				<div className='flex flex-col gap-20'>
					<div className='flex flex-col gap-5'>
						<h2 className='font-bold text-4xl'>{part?.name}</h2>
						<p>{part?.model_name}</p>
					</div>
					{part?.auto_part_info?.map(info => (
						<div>
							<h3>{info.title}</h3>
							<p>{info.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
