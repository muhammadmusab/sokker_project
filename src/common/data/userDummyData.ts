import UserImage from '../../assets/img/wanna/wanna1.png';
import messi from '../../assets/img/wanna/messi.webp';
import UserImageWebp from '../../assets/img/wanna/wanna1.webp';
import UserImage2 from '../../assets/img/wanna/ancceloti.webp';
import UserImage2Webp from '../../assets/img/wanna/wanna2.webp';
import UserImage3 from '../../assets/img/wanna/wanna3.png';
import UserImage3Webp from '../../assets/img/wanna/wanna3.webp';
import UserImage4 from '../../assets/img/wanna/wanna4.png';
import UserImage4Webp from '../../assets/img/wanna/wanna4.webp';
import UserImage5 from '../../assets/img/wanna/wanna5.png';
import UserImage5Webp from '../../assets/img/wanna/wanna5.webp';
import UserImage6 from '../../assets/img/wanna/wanna6.png';
import UserImage6Webp from '../../assets/img/wanna/wanna6.webp';
import UserImage7 from '../../assets/img/wanna/wanna7.png';
import UserImage7Webp from '../../assets/img/wanna/wanna7.webp';
import SERVICES, { IServiceProps } from './serviceDummyData';

import User7Landing from '../../assets/img/wanna/landing1.png';
import { TColor } from '../../type/color-type';

export interface IUserProps {
	id: string;
	username: string;
	name: string;
	surname: string;
	position: string;
	email?: string;
	src: string;
	srcSet: string;
	isOnline: boolean;
	isReply?: boolean;
	color: TColor;
	fullImage?: string;
	services?: IServiceProps[];
	password: string;
}

const john: IUserProps = {
	id: '1',
	username: 'john',
	name: 'John',
	surname: 'Doe',
	position: 'CEO, Founder',
	email: 'john@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: true,
	isReply: true,
	color: 'primary',

	password: '@ABC123',
};

const grace: IUserProps = {
	id: '2',
	username: 'grace',
	name: 'Grace',
	surname: 'Buckland',
	position: 'Staff',
	email: 'grace@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: true,
	color: 'warning',
	services: [SERVICES.SNOWBOARDING, SERVICES.ICE_SKATING, SERVICES.KITE_SURFING],
	password: '@ABC123',
};

const jane: IUserProps = {
	id: '3',
	username: 'jane',
	name: 'Jane',
	surname: 'Lee',
	position: 'Staff',
	email: 'jane@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: true,
	color: 'secondary',
	services: [SERVICES.HANDBALL],
	password: '@ABC123',
};

const ryan: IUserProps = {
	id: '4',
	username: 'ryan',
	name: 'Ryan',
	surname: 'McGrath',
	position: 'Worker',
	email: 'ryan@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: false,
	color: 'info',
	services: [SERVICES.FOOTBALL, SERVICES.HANDBALL],
	password: '@ABC123',
};

const ella: IUserProps = {
	id: '5',
	username: 'ella',
	name: 'Ella',
	surname: 'Oliver',
	position: 'Worker',
	email: 'ella@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: false,
	color: 'success',
	services: [SERVICES.ICE_SKATING, SERVICES.TENNIS, SERVICES.SNOWBOARDING],
	password: '@ABC123',
};

const chloe: IUserProps = {
	id: '6',
	username: 'chloe',
	name: 'Chloe',
	surname: 'Walker',
	position: 'Staff',
	email: 'chloe@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: true,
	color: 'warning',
	services: [SERVICES.VOLLEYBALL],
	password: '@ABC123',
};

const sam: IUserProps = {
	id: '7',
	username: 'sam',
	name: 'Sam',
	surname: 'Roberts',
	position: 'Worker',
	email: 'sam@omtanke.studio',
	src: messi,
	srcSet: messi,
	isOnline: false,
	color: 'danger',
	fullImage: User7Landing,
	password: '@ABC123',
};

const USERS: { [key: string]: IUserProps } = {
	JOHN: john,
	GRACE: grace,
	JANE: jane,
	RYAN: ryan,
	ELLA: ella,
	CHLOE: chloe,
	SAM: sam,
};

export function getUserDataWithUsername(username: string): IUserProps {
	// @ts-ignore
	return USERS[Object.keys(USERS).filter((f) => USERS[f].username.toString() === username)];
}

export function getUserDataWithId(id?: string): IUserProps {
	// @ts-ignore
	return USERS[Object.keys(USERS).filter((f) => USERS[f].id.toString() === id.toString())];
}

export default USERS;
