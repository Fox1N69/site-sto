'use client';
import React from 'react';
import { AutoPart } from '@/types';
import axios from 'axios';
import AutoPartCarousel from '@/components/autopart/AutopartCorusel/corusel';

interface Props {
	part: AutoPart;
}

export const AutoPartContent: React.FC<Props> = part => {
	return (
		<div className=''>
			<div className='w-[300px] h-[250px] border-1'></div>
			<div>{part.part.id}</div>
		</div>
	);
};
