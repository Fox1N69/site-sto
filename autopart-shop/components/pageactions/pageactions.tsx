import { useState } from 'react';
import { Button } from '@nextui-org/button';

interface PageActionsProps {
	onSelectSection: (section: string) => void;
}

const PageActions: React.FC<PageActionsProps> = ({ onSelectSection }) => {
	const [isActive, setIsActive] = useState<string>('vin');

	const handleSelectSection = (section: string) => {
		setIsActive(section);
		onSelectSection(section);
	};

	return (
		<div className='flex space-x-4'>
			<Button
				color={isActive === 'vin' ? 'primary' : 'default'}
				variant={isActive === 'vin' ? 'shadow' : 'bordered'}
				onClick={() => handleSelectSection('vin')}
			>
				VIN / номер кузова
			</Button>
			<Button
				color={isActive === 'all' ? 'primary' : 'default'}
				variant={isActive === 'all' ? 'shadow' : 'bordered'}
				onClick={() => handleSelectSection('all')}
			>
				Все запчасти
			</Button>
		</div>
	);
};

export default PageActions;
