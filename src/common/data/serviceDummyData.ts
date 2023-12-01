import { TColor } from '../../type/color-type';

export interface IServiceProps {
	name: string;
	icon?: string;
	color: TColor;
}

const u7: IServiceProps = {
	name: 'U7',
	icon: 'Surfing',
	color: 'info',
};
const U9: IServiceProps = {
	name: 'U9',
	icon: 'Surfing',
	color: 'info',
};

const U11: IServiceProps = {
	name: 'U11',
	icon: 'Surfing',
	color: 'info',
};

const U13: IServiceProps = {
	name: 'U13',
	icon: 'Surfing',
	color: 'info',
};

const surfing: IServiceProps = {
	name: 'u7',
	icon: 'Surfing',
	color: 'info',
};
const kiteSurfing: IServiceProps = {
	name: 'u9',
	icon: 'Kitesurfing',
	color: 'danger',
};
const tennis: IServiceProps = {
	name: 'u11',
	icon: 'SportsTennis',
	color: 'success',
};
const kayaking: IServiceProps = {
	name: 'u13',
	icon: 'Kayaking',
	color: 'info',
};
const handball: IServiceProps = {
	name: 'u15',
	icon: 'SportsHandball',
	color: 'warning',
};
const iceSkating: IServiceProps = {
	name: 'u17',
	icon: 'IceSkating',
	color: 'info',
};
const snowboarding: IServiceProps = {
	name: 'u19',
	icon: 'Snowboarding',
	color: 'warning',
};
const volleyball: IServiceProps = {
	name: 'u20',
	icon: 'SportsVolleyball',
	color: 'warning',
};
const cricket: IServiceProps = {
	name: 'Cricket',
	icon: 'SportsCricket',
	color: 'success',
};
const yoga: IServiceProps = {
	name: 'Yoga',
	icon: 'SelfImprovement',
	color: 'success',
};
const hiking: IServiceProps = {
	name: 'Hiking',
	icon: 'Hiking',
	color: 'danger',
};
const football: IServiceProps = {
	name: 'Football',
	icon: 'SportsFootball',
	color: 'success',
};

const SERVICES: { [key: string]: IServiceProps } = {
	SURFING: surfing,
	KITE_SURFING: kiteSurfing,
	TENNIS: tennis,
	KAYAKING: kayaking,
	HANDBALL: handball,
	ICE_SKATING: iceSkating,
	SNOWBOARDING: snowboarding,
	VOLLEYBALL: volleyball,
	CRICKET: cricket,
	YOGA: yoga,
	HIKING: hiking,
	FOOTBALL: football,
	U7: u7,
};

export function getServiceDataWithServiceName(serviceName: string) {
	return SERVICES[
		// @ts-ignore
		Object.keys(SERVICES).filter((f) => SERVICES[f].name.toString() === serviceName)
	];
}

export default SERVICES;
