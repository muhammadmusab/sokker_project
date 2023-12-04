import React, { FC, useEffect, useState } from 'react';
import { Form, Formik, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../../components/bootstrap/Button';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import { demoPagesMenu } from '../../../menu';
import { addCoach, getEquipes, updateItemById, getclubs, getCoache } from '../../../requests';
import FormBlocks from '../../../components/forms/FormBlocks';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { DevTool } from '@hookform/devtools';
import { useParams } from 'react-router-dom';

const FormCoaches = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [clubs, setClubs] = useState<any[]>();
	const [coach, setCoach] = useState<any>();
	let defaultValues = {};

	const hookForm = useForm({
		defaultValues,
	});
	const { handleSubmit, control, reset } = hookForm;

	useEffect(() => {
		getCoache(params.id).then((data) => {
			setCoach(data);
		});
	}, []);

	useEffect(() => {
		reset(coach);
	}, [coach]);
	useEffect(() => {
		let clubList: any[] = [];
		getclubs().then((data) => {
			data.content.map((item) => {
				// console.log(item)
				clubList.push({
					label: item.nom,
					value: item.id,
				});
			});
			setClubs(clubList);
		});
	}, []);

	// const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	const coachFormBlocks: any = [
		{
			title: 'Photo Entraineur',
			formFields: [
				{
					id: 'image',
					name: 'image',
					label: 'Chose your file',
					placeHolder: 'Chose you file',
					type: 'file',
					className: 'col-12',
				},
			],
		},
		{
			title: 'Information Entraineur',
			formFields: [
				{
					id: 'nom',
					name: 'nom',
					label: "Nom de l'équipe",
					placeHolder: "Nom de l'équipe",
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'prenom',
					name: 'prenom',
					label: "Prenom de l'entraineur",
					placeHolder: "Prenom de l'entraineur",
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'gender',
					name: 'gender',
					label: 'Gender',
					options: [
						{
							value: 'masculin',
							label: 'Masculin',
						},
						{
							value: 'feminin',
							label: 'Féminin',
						},
					],
					placeHolder: 'Gender',
					type: 'select',
					className: 'col-md-4',
				},
				{
					id: 'email',
					name: 'email',
					label: 'Email',
					placeHolder: 'Email',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'password',
					name: 'password',
					label: 'Password',
					placeHolder: 'Password',
					type: 'password',
					className: 'col-md-4',
				},
				{
					id: 'date_naissance',
					name: 'date_naissance',
					label: 'Date Naissance',
					placeHolder: 'Date Naissance',
					type: 'date',
					className: 'col-md-4',
				},
				{
					id: 'status',
					name: 'status',
					label: 'Status',
					options: [
						{
							value: true,
							label: 'Active',
						},
						{
							value: false,
							label: 'Inactive',
						},
					],
					placeHolder: 'Status',
					type: 'select',
					className: 'col-md-4',
				},
			],
		},
		{
			title: 'Contact Information',
			formFields: [
				{
					id: 'telephone',
					name: 'telephone',
					label: 'Telephone',
					placeHolder: 'Telephone',
					type: 'text',
					className: 'col-md-4',
				},
			],
		},
		{
			title: 'Professional Information',
			formFields: [
				{
					id: 'cv',
					name: 'cv',
					label: 'Upload Cv',
					placeHolder: 'Chose you file',
					type: 'file',
					className: 'col-12',
				},
				{
					id: 'certifications',
					name: 'certifications',
					label: 'Certifications',
					placeHolder: 'Certifications',
					type: 'textarea',
					className: 'col-12',
				},
				{
					id: 'biographie',
					name: 'biographie',
					label: 'Biographie',
					placeHolder: 'Biographie',
					type: 'textarea',
					className: 'col-12',
				},
			],
		},
		{
			title: 'Address',
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
			title: 'Equipes',
			formFields: [
				{
					type: 'ReactSelect',
					className: 'col-md-12',
					name: 'equipes',
					label: 'equipes',
					isAsync: true,
					isMulti: true,
					callback: async (query: string) => {
						const data = await getEquipes();
						return data.content.map((item) => ({
							label: item.nom,
							value: item.id,
						}));
					},
				},
			],
		},

		{
			title: 'Club',
			formFields: [
				{
					type: 'select',
					className: 'col-md-12',
					name: 'club',
					label: 'Club',
					options: clubs,
				},
			],
		},

		// {
		// 	title: 'Information de responsable',
		// 	formFields: [
		// 		{
		// 			id: 'responsableNom',
		// 			name: 'responsableNom',
		// 			label: 'Nom de responsable',
		// 			placeHolder: 'Nom de responsable',
		// 			type: 'text',
		// 			className: 'col-md-6',
		// 		},
		// 		{
		// 			id: 'responsableEmail',
		// 			name: 'responsableEmail',
		// 			label: 'Email de responsable',
		// 			placeHolder: 'Email de responsable',
		// 			type: 'email',
		// 			className: 'col-md-6',
		// 		},
		// 	],
		// },
	];


	const { mutateAsync: updateCoachMutation, isLoading: isLoadingUpdate } = useMutation(
		(formData: FormData) => updateItemById({ endPoint: 'entraineurs', formData }),
	);
	const queryClient = useQueryClient();

	const onSubmit = async (data: any) => {
		let equipes = data.equipes.map((item) => item.value);
		const { image, cv, ...dataToSend } = data;
		const jsonData = { ...dataToSend };
		const club = parseInt(data.club);
		const date_naissance = new Date(data.date_naissance).getTime();
		const status = data.status === 'true' ? true : false;
		delete jsonData['equipes'];
		delete jsonData['club'];
		delete jsonData['date_naissance'];
		delete jsonData['status'];
		const formData = new FormData();
		formData.append(
			'jsonData',
			JSON.stringify({
				equipes,
				club: null,
				role: null,
				fonction: null,
				date_naissance,
				status,
				...jsonData,
			}),
		);
		formData.append('image', image[0]);
		formData.append('cv', cv[0]);
		await updateCoachMutation(formData)
			.then((res) => {
				toast.success('Entraineurs Modifier');
				reset();
				navigate('/entraineurs');
				queryClient.invalidateQueries({
					queryKey: ['entraineurs'],
				});
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};
	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editWizard.text}>
			<Page>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DevTool control={control} />
					<SubHeader>
						<SubHeaderLeft>
							<Breadcrumb
								list={[
									{ title: 'éntraineurs', to: '/entraineurs' },
									{ title: 'Ajouter éntraineur', to: '/' },
								]}
							/>
						</SubHeaderLeft>
						<SubHeaderRight>
							<Button
								isDisable={isLoadingUpdate}
								icon={'Save'}
								isLight
								color={'success'}
								type='submit'>
								{isLoadingUpdate ? 'Chargement...' : 'Modifier'}
							</Button>
						</SubHeaderRight>
					</SubHeader>
					<Page>
						<div className='row  align-content-start'>
							{coach && coachFormBlocks && (
								<FormBlocks formBlocks={coachFormBlocks} hookForm={hookForm} />
							)}
						</div>
					</Page>
				</form>
			</Page>
		</PageWrapper>
	);
};

export default FormCoaches;
