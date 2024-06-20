import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	NavbarItem
} from '@nextui-org/react';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Switch } from '@nextui-org/switch';
import { ThemeSwitch } from '../theme-switch';
import { UserInfo } from 'os';
import { User } from '@/types';
import axios from 'axios';
import { fetchData } from 'next-auth/client/_utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {
	user: string;
}

export const UserDropdown: React.FC<Props> = ({ user }) => {
	const { data: session } = useSession();
	const [fio, setFio] = useState<string>('');
	const route = useRouter();
	const isAdmin = session?.user.role === 'admin';

	const handleLogout = async () => {
		signOut({ callbackUrl: '/auth/login' });
	};

	useEffect(() => {
		const fetchUserData = async () => {
			if (!session || !session.user || !session.user.token) {
				console.log('No user token found in session');
				return;
			}
			try {
				const response = await axios.get(
					`http://localhost:4000/v1/account/user/${user}`,
					{
						headers: {
							Authorization: `Bearer ${session.user.token}`
						}
					}
				);
				setFio(response.data.fio);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, [user, session]);

	return (
		<Dropdown>
			<NavbarItem>
				<DropdownTrigger>
					<Avatar
						as='button'
						color='secondary'
						size='md'
						src='/avatar-ilya.jpg'
					/>
				</DropdownTrigger>
			</NavbarItem>
			<DropdownMenu
				aria-label='User menu actions'
				onAction={actionKey => console.log({ actionKey })}
			>
				<DropdownItem
					key='profile'
					className='flex flex-col justify-start w-full items-start'
				>
					<p>{fio}</p>
				</DropdownItem>
				<DropdownItem>
					{isAdmin && (
						<>
							<Link href={'http://localhost:3001/'}>Панель администратора</Link>
						</>
					)}
				</DropdownItem>
				<DropdownItem key='settings'>Настройки</DropdownItem>
				<DropdownItem key='system'>Система</DropdownItem>
				<DropdownItem key='configurations'>Конфигурация</DropdownItem>
				<DropdownItem key='help_and_feedback'>
					Помощь и обратная связь
				</DropdownItem>
				<DropdownItem
					key='logout'
					color='danger'
					className='text-danger'
					onClick={handleLogout}
				>
					Выйти
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
