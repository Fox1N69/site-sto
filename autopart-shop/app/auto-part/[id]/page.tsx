'use client';
import { AutoPartContent } from '@/components/autopart/content';
import { useFetchPartById } from '@/hooks/fetching';
import axios from 'axios';

const AutoPart = ({ params }: { params: { id: number } }) => {
	const id = params.id;
	return (
		<section>
			<AutoPartContent id={id} />
		</section>
	);
};

export default AutoPart;
