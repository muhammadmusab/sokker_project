import { TColor } from '../../../../type/color-type';
import { TIcons } from '../../../../type/icons-type';
import { TInputTypes } from '../../../../type/input-type';

export type SelectOption = {
	label: string;
	value: string;
};

export type FromField = {
	id: string;
	name: string;
	label: string;
	type: TInputTypes | 'select';
	placeHolder: string;
	className: string;
	options?: SelectOption[];
};

export type TableAction = {
	onClick: (id?: number | string) => void;
	btnTitle: string;
	btnIconName: TIcons;
	disable?: boolean;
};

export type DataTableRow = {
	id: number | string;
	type: 'img' | 'text' | 'date';
	value: string | number;
};

export type TColumnData = { id: string; title: string; color: TColor; icon: TIcons };
export type TColumnsData = {
	[key: string]: TColumnData;
};
export type TCard = {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	label: string;
	img?: string;
	user: {
		username: string;
		src: string;
		srcSet: string;
		color: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
		name: string;
		surname: string;
	};
	tasks: { status: boolean; id: string | number; text: string }[];
	tags: {
		id: string;
		title: string;
		color?: TColor;
	}[];
	attachments?: { id: string | number; file: string; path: string }[];
};
export type TCards = {
	[key: string]: TCard[];
};
