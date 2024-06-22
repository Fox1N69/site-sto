'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@icons/eye/Eye';

const SignInPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await signIn('credentials', {
			redirect: false,
			username,
			password
		});

		if (result?.error) {
			setError(result.error);
		} else {
			router.push('/');
		}
	};

	const [isVisible, setIsVisible] = React.useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<div className='flex justify-center'>
			<div className='w-[1px]'></div>
			<div className='flex items-center mt-7'>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<form
					onSubmit={handleSignIn}
					className='flex flex-col gap-4 border-1 rounded-lg p-4'
				>
					<h1 className='text-center'>Авторизация</h1>
					<div>
						<Input
							label='Логин'
							labelPlacement='outside'
							placeholder='Введите логин'
							variant='bordered'
							type='text'
							id='username'
							value={username}
							onChange={e => setUsername(e.target.value)}
							className='max-w-xs bg-transparent'
						/>
					</div>
					<div>
						<Input
							label='Пароль'
							labelPlacement='outside'
							variant='bordered'
							placeholder='Введите пароль'
							endContent={
								<button
									className='focus:outline-none'
									type='button'
									onClick={toggleVisibility}
								>
									{isVisible ? (
										<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
									) : (
										<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
									)}
								</button>
							}
							type={isVisible ? 'text' : 'password'}
							className='max-w-xs'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<Button type='submit' variant='ghost' color='success'>
						Войти
					</Button>
				</form>
			</div>
		</div>
	);
};

export default SignInPage;
