import React, { FC } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card, { CardBody } from './bootstrap/Card';
import Button from './bootstrap/Button';
import Avatar from './Avatar';
import { TColor } from '../type/color-type';

interface IUserContactProps {
	idItem?: string | number;
	className?: string;
	name: string;
	position?: string;
	src: string;
	srcSet?: string;
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
	mail?: string;
	phone?: string;
	onChat?(...args: unknown[]): unknown;
	cardBodyClassName?: string;
	onDelete?: (id: number | string) => void;
	onEdit?: (id: number | string) => void;
}
const UserContact: FC<IUserContactProps> = ({
	idItem,
	name,
	position,
	src,
	srcSet,
	color,
	mail,
	phone,
	onChat,
	onDelete,
	onEdit,
	cardBodyClassName,
	...props
}) => {
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Card {...props} className={classNames(props.className)} stretch>
			<CardBody className={cardBodyClassName}>
				<div className='flex-grow-1'>
					<div className='fs-5 fw-bold'>{name}</div>
					{position && <div className='text-muted'>{position}</div>}
					<div className='row mt-2 g-3'>
						{mail && (
							<div className='col-auto'>
								<Button
									color='info'
									icon='Email'
									isLight
									aria-label='Mail'
									tag='a'
									href={`mailto:${mail}`}
								/>
							</div>
						)}
						{phone && (
							<div className='col-auto'>
								<Button
									color='info'
									icon='PhoneIphone'
									isLight
									aria-label='Phone'
									tag='a'
									href={`tel:${phone}`}
								/>
							</div>
						)}
						{onChat && (
							<div className='col-auto'>
								<Button
									color='info'
									icon='Sms'
									isLight
									aria-label='Chat'
									onClick={onChat}
								/>
							</div>
						)}
						{onEdit && idItem && (
							<div className='col-auto'>
								<Button
									color='warning'
									icon='Edit'
									isLight
									aria-label='Chat'
									onClick={() => {
										onEdit(idItem);
									}}
								/>
							</div>
						)}
						{onDelete && idItem && (
							<div className='col-auto'>
								<Button
									color='warning'
									icon='Delete'
									isLight
									aria-label='Chat'
									onClick={() => {
										onDelete(idItem);
									}}
								/>
							</div>
						)}
					</div>
				</div>
				{(src || srcSet) && (
					<div className='flex-shrink-0'>
						<Avatar
							src={src}
							srcSet={srcSet}
							color={color}
							className='rounded-circle'
							shadow='sm'
							size={110}
						/>
					</div>
				)}
			</CardBody>
		</Card>
	);
};
UserContact.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string.isRequired,
	position: PropTypes.string,
	src: PropTypes.string.isRequired,
	srcSet: PropTypes.string,
	color: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'info',
		'warning',
		'danger',
		'light',
		'dark',
		'link',
		'brand',
		'brand-two',
		'storybook',
	]),
	mail: PropTypes.string,
	phone: PropTypes.string,
	onChat: PropTypes.func,
	cardBodyClassName: PropTypes.string,
};
UserContact.defaultProps = {
	className: undefined,
	position: undefined,
	srcSet: undefined,
	color: undefined,
	mail: undefined,
	phone: undefined,
	onChat: undefined,
	cardBodyClassName: 'd-flex align-items-center',
};

export default UserContact;
