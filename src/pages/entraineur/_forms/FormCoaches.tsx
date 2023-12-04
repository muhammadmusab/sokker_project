import React, { FC, useEffect, useState } from 'react';
import { Form, Formik, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Wizard, { WizardItem } from '../../../components/Wizard';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Avatar from '../../../components/Avatar';
import User1Webp from '../../../assets/img/wanna/wanna2.webp';
import User1Img from '../../../assets/img/wanna/wanna2.png';

import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import { demoPagesMenu } from '../../../menu';
import editPasswordValidate from '../../presentation/demo-pages/helper/editPasswordValidate';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import { addCoach, getEquipes, updateItemById, getclubs } from '../../../requests';
import WizardCoach from '../../../components/WizardCoach';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import FormBlocks from '../../../components/forms/FormBlocks';
import { FieldValues, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { DevTool } from '@hookform/devtools';

type FormCoachProps = {
	mode: 'edit' | 'add';
	defaultData?: FieldValues;
};

const FormCoaches = ({ mode, defaultData }: FormCoachProps) => {
	const navigate = useNavigate();
	const [clubs, setClubs] = useState<any[]>();

	const hookForm = useForm({
		defaultValues: defaultData,
	});
	const { handleSubmit, control, reset } = hookForm;
	useEffect(() => {
		reset(defaultData);
	}, [defaultData]);
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

	const coachFormBlocks = [
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
					label: 'Cv',
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
	const { mutateAsync: addCoachMutation, isLoading } = useMutation((formData: FormData) =>
		addCoach(formData),
	);
	const { mutateAsync: updateCoachMutation, isLoading: isLoadingUpdate } = useMutation(
		(formData: FormData) => updateItemById({ endPoint: 'entraineurs', formData }),
	);
	const queryClient = useQueryClient();

	const onSubmit = async (data: any) => {
		let equipes = data.equipes.map((item) => item.value);
		const { image, cv, ...dataToSend } = data;
		const jsonData = { ...dataToSend };
		const club = parseInt(data.club);
		const  date_naissance= new Date(data.date_naissance).getTime();
		const status=data.status==='true'?true:false
		delete jsonData['equipes'];
		delete jsonData['club'];
		delete jsonData['date_naissance'];
		delete jsonData['status'];
		const formData = new FormData();
		formData.append(
			'jsonData',
			JSON.stringify({ equipes, club:null, role: null, fonction: null,date_naissance,status, ...jsonData }),
		);
		formData.append('image', image[0]);
		formData.append('cv', cv[0]);
		if (mode === 'add')
			await addCoachMutation(formData)
				.then((res) => {
					toast.success(res.data);
					reset();
					navigate('/entraineurs');
					queryClient.invalidateQueries({
						queryKey: ['entraineurs'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		else {
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
		}
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
								isDisable={isLoading || isLoadingUpdate}
								icon={'Save'}
								isLight
								color={'success'}
								type='submit'>
								{isLoading || isLoadingUpdate
									? 'Chargement...'
									: mode === 'edit'
									? 'Modifier'
									: 'Add'}
							</Button>
						</SubHeaderRight>
					</SubHeader>
					<Page>
						<div className='row  align-content-start'>
							<FormBlocks formBlocks={coachFormBlocks} hookForm={hookForm} />
						</div>
					</Page>
				</form>
			</Page>
			{/* <Page>
				<Modal
					setIsOpen={setUpcomingEventsEditOffcanvas}
					isOpen={upcomingEventsEditOffcanvas}
					titleId='upcomingEdit'
					isCentered
					isScrollable
					size='lg'>
					<ModalBody>
						<div className='row g-4'>
							<CardBody isScrollable style={{ minHeight: '280px' }}>
								<CardHeader>
									<CardLabel icon='Photo' iconColor='info'>
										<CardTitle>Ajouter Image</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row'>
										<div className='col-lg-4'>
											{image ? (
												<img
													src={image}
													alt=''
													style={{
														width: 'fit-content',
														maxWidth: '100%',
													}}
												/>
											) : (
												<PlaceholderImage
													width={200}
													height={157}
													className=' d-block img-fluid  rounded'
													style={{
														position: 'relative',
														right: '40px !important',
													}}
												/>
											)}
										</div>
										<div className='col-lg-8'>
											<div className='row g-4'>
												<div className='col-12'>
													<Input
														type='file'
														autoComplete='photo'
														onChange={onImageChange}
														ariaLabel='Upload image file'
													/>
												</div>
												<div className='col-12'>
													<Button
														color='dark'
														isLight
														icon='Delete'
														onClick={() => {
															setImage('');
														}}>
														Delete Image
													</Button>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</CardBody>
						</div>
					</ModalBody>
					<ModalFooter className='bg-transparent'>
						<Button
							color='success'
							className='w-100'
							// onClick={() => handleUpdate(club.id, formik.values)}
						>
							Update
						</Button>
					</ModalFooter>
				</Modal>
			</Page> */}
		</PageWrapper>
	);
};

export default FormCoaches;
