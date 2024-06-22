import { AutoPartContent } from '@/components/autopart/content';
import { useAtuoPartByID } from '@/hooks/fetching';
import axios from 'axios';

const AutoPart = ({ params }: { params: { id: number } }) => {
	return (
		<section>
			<div>{params.id}</div>
			<div>
			</div>
		</section>
	);
};

export default AutoPart;
