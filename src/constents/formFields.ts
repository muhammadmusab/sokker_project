import { FromField } from '../pages/presentation/project-management/type/types';

export const clubFormSteps: { stepNumber: number; formFields: FromField[]; title: string }[] = [
	{
		title: 'Logo Club',
		stepNumber: 1,
		formFields: [
			{
				id: 'logo',
				name: 'logo',
				label: 'Chose your file',
				placeHolder: 'Chose you file',
				type: 'file',
				className: 'col-12',
			},
		],
	},
	{
		title: 'Information Club',
		stepNumber: 2,
		formFields: [
			{
				id: 'nom',
				name: 'nom',
				label: 'Nom du club',
				placeHolder: 'Nom du club',
				type: 'text',
				className: 'col-md-4',
			},
			{
				id: 'telephone',
				name: 'telephone',
				label: 'Télephone',
				placeHolder: 'Télephone',
				type: 'tel',
				className: 'col-md-4',
			},
			{
				id: 'siteWeb',
				name: 'site_web',
				label: 'Site Web',
				placeHolder: 'Site Web',
				type: 'text',
				className: 'col-md-4',
			},
			{
				id: 'stade',
				name: 'stade',
				label: 'Stade',
				placeHolder: 'stade',
				type: 'text',
				className: 'col-md-4',
			},
			{
				id: 'nbre_licencies',
				name: 'nbre_licencies',
				label: 'Nombre licencies',
				placeHolder: 'Nombre licencies',
				type: 'number',
				className: 'col-md-4',
			},
			{
				id: 'id_fff',
				name: 'id_fff',
				label: 'Id FFF',
				placeHolder: 'Id FFF',
				type: 'text',
				className: 'col-md-4',
			},
			{
				id: 'date_fondation',
				name: 'date_fondation',
				label: 'Date Fondation',
				placeHolder: 'Date Fondation',
				type: 'date',
				className: 'col-md-6',
			},
			{
				id: 'status',
				name: 'status',
				label: 'Status',
				placeHolder: 'Status',
				type: 'select',
				className: 'col-md-6',
				options: [
					{ label: 'Active', value: 'true' },
					{
						label: 'Inactive',
						value: 'false',
					},
				],
			},
		],
	},
	{
		title: 'Address',
		stepNumber: 3,
		formFields: [
			{
				id: 'adresse',
				name: 'adresse',
				label: 'Adresse',
				placeHolder: 'Adresse',
				type: 'text',
				className: 'col-md-6',
			},
			{
				id: 'codePostal',
				name: 'code_postal',
				label: 'Code Postal',
				placeHolder: 'Code Postal',
				type: 'text',
				className: 'col-md-3',
			},

			{
				id: 'ville',
				name: 'ville',
				label: 'Ville',
				placeHolder: 'Ville',
				type: 'text',
				className: 'col-md-3',
			},
		],
	},
	{
		stepNumber: 4,
		title: 'Information de responsable',
		formFields: [
			{
				id: 'responsableNom',
				name: 'responsableNom',
				label: 'Nom de responsable',
				placeHolder: 'Nom de responsable',
				type: 'text',
				className: 'col-md-6',
			},
			{
				id: 'responsableEmail',
				name: 'responsableEmail',
				label: 'Email de responsable',
				placeHolder: 'Email de responsable',
				type: 'email',
				className: 'col-md-6',
			},
		],
	},
];
