import React, { useState, useEffect } from 'react';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import validate from '../../presentation/demo-pages/helper/editPagesValidate';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import useDarkMode from '../../../hooks/useDarkMode';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Avatar from '../../../components/Avatar';
import Spinner from '../../../components/bootstrap/Spinner';
import USERS from '../../../common/data/userDummyData';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import CommonDesc from '../../../common/other/CommonDesc';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Select from '../../../components/bootstrap/forms/Select';
import Option, { Options } from '../../../components/bootstrap/Option';
// import { addClub, getCluub } from '../../../requests';
import Wizard, { WizardItem } from '../../../components/Wizard';

import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import { addEquipe, getCoaches, getEquipes, getPlayer, updateItemById } from '../../../requests';
import { coach } from '../../../types';
import { ReactSelectInput } from '../../../components/form/inputs/ReactSelect';
import FormBlocks from '../../../components/forms/FormBlocks';
import { FieldValues, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useMutation, useQueryClient } from '@tanstack/react-query';


type FormTeamProps = {
	mode: 'edit' | 'add';
	defaultData?: FieldValues;
};

const FormTeamOp = ({mode,defaultData}:FormTeamProps) => {

	const categorie = [
		{ value: 'U7', label: 'Moins de 7 ans' },
		{ value: 'U9', label: 'Moins de 9 ans' },
		{ value: 'U11', label: 'Moins de 11 ans' },
		{ value: 'U13', label: 'Moins de 13 ans' },
		{ value: 'U15', label: 'Moins de 15 ans' },
		{ value: 'U17', label: 'Moins de 17 ans' },
		{ value: 'U19', label: 'Moins de 19 ans' },
		{ value: 'Séniors', label: '20 ans et plus' },
	];

	const teamFormBlocks = [
		{
			title: 'Logo Equipe',
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
			title: 'Information Equipe',
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
					id: 'genre',
					name: 'genre',
					label: 'genre',
					options: [
						{
							value: 'Garçons',
							label: 'Garçons',
						},
						{
							value: 'Filles',
							label: 'Filles',
						},
						{
							value: 'Mix',
							label: 'Mix',
						},
					],
					placeHolder: 'Genre',
					type: 'select',
					className: 'col-md-4',
				},
				{
					id: 'nbrJoueurs',
					name: 'nbrJoueurs',
					label: "nombre de joueur",
					placeHolder: "nombre de joueur",
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'categorieAge',
					name: 'categorieAge',
					label: "catégorie Age",
					placeHolder: "catégorie Age",
					type: 'select',
					className: 'col-md-4',
					options:categorie
				}
			],
		},

		{
			title: 'Joueur',
			formFields: [
				{
					type:'ReactSelect',
					className: 'col-md-12',
					name:'joueur',
					label:'Joueur',
					isAsync:true,
					isMulti:true,
					callback:async (query: string) => {
			
						const data = await getPlayer();
						return data.content.map((item) => ({
							label: item.nom,
							value: item.id,
						}));
					}
				},
	
			],
		},
		// {
		// 	title: 'Address',
		// 	formFields: [
		// 		{
		// 			id: 'adresse',
		// 			name: 'adresse',
		// 			label: 'Adresse',
		// 			placeHolder: 'Adresse',
		// 			type: 'text',
		// 			className: 'col-md-6',
		// 		},
		// 		{
		// 			id: 'codePostal',
		// 			name: 'code_postal',
		// 			label: 'Code Postal',
		// 			placeHolder: 'Code Postal',
		// 			type: 'text',
		// 			className: 'col-md-3',
		// 		},
	
		// 		{
		// 			id: 'ville',
		// 			name: 'ville',
		// 			label: 'Ville',
		// 			placeHolder: 'Ville',
		// 			type: 'text',
		// 			className: 'col-md-3',
		// 		},
		// 	],
		// },
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


	const { themeStatus } = useDarkMode();
	const [coaches, setCoaches] = useState<coach[]>();
	/**
	 * Common
	 */
	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	// const [isLoading, setIsLoading] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const formData = new FormData();
	// const handleSave = async (values: any) => {
	// 	// console.log(values);
	// 	const valuesWithoutPhoto = { ...values };
	// 	delete valuesWithoutPhoto.photo;

	// 	try {
	// 		formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
	// 		formData.append('image', values.photo);

	// 		await axios.post('https://spring-boot-sokker.onrender.com/api/equipes', formData);
	// 		console.log('equipe sent successfully', formData);
	// 		navigate('/equipes');
	// 		showNotification(
	// 			<span className='d-flex align-items-center'>
	// 				<Icon icon='Info' size='lg' className='me-1' />
	// 				<span className='text-capitalize'>Equipe ajouter avec succés</span>
	// 			</span>,
	// 			'',
	// 			'success',
	// 		);
	// 	} catch (error) {
	// 		console.error('Error updating club:', error);
	// 		showNotification(
	// 			<span className='d-flex align-items-center'>
	// 				<Icon icon='Info' size='lg' className='me-1' />
	// 				<span className='text-capitalize'>erreur</span>
	// 			</span>,
	// 			'',
	// 			'danger',
	// 		);
	// 	}
	// };
	const navigate = useNavigate();

	// const onSubmit = (values: any) => {
	// 	setIsLoading(true);
	// 	handleSave(values);
	// };
	const validationSchema = Yup.object({
		nom: Yup.string()
			.required('Nom is required')
			.min(3, 'Must be 3 characters or more')
			.max(20, 'Must be 20 characters or less'),
		genre: Yup.string()
			.required('Gender is required')
			.oneOf(['Garçons', 'Filles', 'Mix'], 'Invalid gender'),
		categorieAge: Yup.string()
			.required('Category is required')
			.oneOf(
				[
					'Moins de 7 ans',
					'Moins de 9 ans',
					'Moins de 11 ans',
					'Moins de 13 ans',
					'Moins de 15 ans',
					'Moins de 17 ans',
					'Moins de 19 ans',
					'20 ans et plus',
				],
				'Invalid Age',
			),
		photo: Yup.mixed().required('image is required'),
		email: Yup.string().email('Invalid email address').required('Email is required'),
		nbrJoueurs: Yup.string()
			.required('number of players is required')
			.oneOf(
				['11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
				'Must be at least 11 or maximum 23 players',
			),
		joueur_ids: Yup.array().required('Players are required'),
	});
	// const formik = useFormik({
	// 	initialValues: {
	// 		nom: '',
	// 		genre: 'Masculin',
	// 		categorieAge: 'Moins de 7 ans',
	// 		photo: null,
	// 		nbrJoueurs: null,
	// 		joueur_ids: [] as number[],
	// 		coach_ids: [] as number[],
	// 		status: true,
	// 	},
	// 	validationSchema,
	// 	onSubmit,
	// });

	// const onImageChange = (event: any) => {
	// 	if (event.target.files && event.target.files[0]) {
	// 		const selectedImage = event.target.files[0];
	// 		formik.setFieldValue('photo', selectedImage);

	// 		setImage(URL.createObjectURL(selectedImage));
	// 	}
	// };

	useEffect(() => {
		getCoaches()
			.then((res) => setCoaches(res.data))
			.catch((err) => console.log(err));

		return () => {};
	}, []);
	// console.log(coaches);

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);

	const hookForm = useForm({
		defaultValues:defaultData
		// resolver: zodResolver(CLUB_FORM_SCHEMA),
	});
	const { handleSubmit, control, reset } = hookForm;
	useEffect(()=>{
		reset(defaultData)
	},[defaultData])


	const { mutateAsync: addEquipeMutation, isLoading } = useMutation((formData: FormData) =>
		addEquipe(formData),
	);
	const { mutateAsync: updateEquipeMutation, isLoading: isLoadingUpdate } = useMutation(
		(formData: FormData) => updateItemById({ endPoint: 'equipes', formData }),
	);
	const queryClient = useQueryClient();
	const onSubmit = async (data: any) => {
		const { logo, ...dataToSend } = data;


		const formData = new FormData();
		formData.append('jsonData', JSON.stringify(dataToSend));
		formData.append('image', logo[0]);
		if (mode === 'add')
			await addEquipeMutation(formData)
				.then((res) => {
					toast.success(res.data);
					reset();
					navigate('/equipes');
					queryClient.invalidateQueries({
						queryKey: ['equipes'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		else {
			console.log({ logo });
			await updateEquipeMutation(formData)
				.then((res) => {
					toast.success('Equipe Modifier');
					reset();
					navigate('/equipes');
					queryClient.invalidateQueries({
						queryKey: ['equipes'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		}
	};

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
			{/* <SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'équipes', to: '/equipes' },
							{ title: 'Ajouter équipe', to: '/' },
						]}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						icon={isLoading ? undefined : 'Save'}
						isLight
						color={lastSave ? 'info' : 'success'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						submit
					</Button>
				</SubHeaderRight>
			</SubHeader> */}
			<Page>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DevTool control={control} />
					<SubHeader>
						<SubHeaderLeft>
							<Breadcrumb
								list={[
									{ title: 'équipes', to: '/equipes' },
									{ title: 'Ajouter équipe', to: '/' },
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
							<FormBlocks formBlocks={teamFormBlocks} hookForm={hookForm} />
						</div>
					</Page>
				</form>
				{/* <Formik initialValues={formik.initialValues} onSubmit={onSubmit}>
					<Form>
						<div className='row  align-content-start'>
							<pre>{JSON.stringify(formik.values)}</pre>
							<Card>
								<CardHeader>
									<CardLabel icon='people' iconColor='warning'>
										<CardTitle className='text-capitalize'>
											Ajouter équipe
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4 '>
										<div className='col-sm-2'>
											<div
												className='col-12 w-100'
												style={{
													display: 'flex',
													justifyContent: 'center',
													marginTop: '-15px',
												}}
												onClick={() =>
													setUpcomingEventsEditOffcanvas(true)
												}>
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
										</div>
										<div className='col-sm-10'>
											<div className='row'>
												<div className=' col-md-6 mb-4 mb-md-0'>
													<FormGroup
														id='nom'
														label="Nom de l'equipe"
														isFloating>
														<Input
															id='nom'
															name='nom'
															placeholder="Nom de l'equipe"
															autoComplete='additional-name'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.nom}
															isTouched={formik.touched.nom}
															isValid={formik.isValid}
															invalidFeedback={formik.errors.nom}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup id='genre' label='Genre' isFloating>
														<Select
															ariaLabel=''
															name='genre'
															className='text-capitalize'
															defaultValue='Masculin'
															value={formik.values.genre}
															onChange={formik.handleChange}
															isValid={formik.isValid}
															invalidFeedback={formik.errors.genre}
															isTouched={formik.touched.genre}
															validFeedback='Looks good!'>
															<Option value='Garçons'>Garçons</Option>
															<Option value='Filles'>Filles</Option>
															<Option value='Mix'>mix</Option>
														</Select>
													</FormGroup>
												</div>
												<div className='col-md-6 mt-4'>
													<FormGroup
														id='nbrJoueurs'
														label='nombre de joueur'
														isFloating>
														<Input
															placeholder='nombre de joueur'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.nbrJoueurs}
															isValid={formik.isValid}
															isTouched={formik.touched.nbrJoueurs}
															invalidFeedback={
																formik.errors.nbrJoueurs
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6 mt-4'>
													<ReactSelectInput
														name='equipes'
														label='Equipes'
														isAsync={true}
														isMulti={true}
														colProps={{
															sm: 12,
														}}
														callback={async (query: string) => {
															const data = await getEquipes();
															return data.content.map((item) => ({
																label: item.nom,
																value: item.id,
															}));
														}}
													/>
												</div>
												<div className='col-12 mt-4'>
													<FormGroup
														id='categorieAge'
														label='catégorie Age'
														className='text-capitalize'
														isFloating>
														<Select
															ariaLabel=''
															className='text-capitalize'
															name='categorieAge'
															value={formik.values.categorieAge}
															defaultValue={
																formik.values.categorieAge
															}
															onChange={formik.handleChange}
															isValid={formik.isValid}
															invalidFeedback={
																formik.errors.categorieAge
															}
															isTouched={formik.touched.categorieAge}
															validFeedback='Looks good!'>
															{categorie.map((element) => (
																<Option
																	value={element.text}
																	key={element.id}>
																	{element.text}
																</Option>
															))}
														</Select>
													</FormGroup>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
							<Card style={{ minHeight: 'fit-content' }}>
								<CardHeader>
									<CardLabel icon='person' iconColor='warning'>
										<CardTitle tag='div' className='h5'>
											Entraineurs
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='  gap-2 w-100' isScrollable>
									<div className='row'>
										<div className='col-8'>
											{coaches && coaches.length}
											<ReactSelectInput
												name='coach_ids'
												label='Entraineur'
												isAsync={false}
												isMulti={true}
												colProps={{
													sm: 12,
												}}
												options={
													coaches && coaches.length
														? coaches.map((item) => ({
																label: item.nom,
																value: item.id,
														  }))
														: []
												}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<Modal
							setIsOpen={setUpcomingEventsEditOffcanvas}
							isOpen={upcomingEventsEditOffcanvas}
							titleId='upcomingEdit'
							isCentered
							isScrollable>
							<ModalBody>
								<div className='row g-4'>
									<CardBody isScrollable style={{ minHeight: '280px' }}>
										<CardHeader>
											<CardLabel icon='Photo' iconColor='info'>
												<CardTitle>Ajouter Image</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody>
											{image ? (
												<label>
													<img
														src={image}
														alt=''
														style={{
															maxWidth: '415px',
															minWidth: '415px',
															maxHeight: '277px',
															minHeight: '277px',
															objectFit: 'contain',
														}}
													/>
													<Input
														type='file'
														autoComplete='photo'
														onChange={onImageChange}
														ariaLabel='Upload image file'
														isTouched={formik.touched.photo}
														invalidFeedback={formik.errors.photo}
														style={{ display: 'none' }}
													/>
												</label>
											) : (
												<label>
													<PlaceholderImage
														width={415}
														height={277}
														className=' d-block img-fluid  rounded'
														style={{
															position: 'relative',
															right: '40px !important',
														}}
													/>
													<Input
														type='file'
														autoComplete='photo'
														onChange={onImageChange}
														ariaLabel='Upload image file'
														isTouched={formik.touched.photo}
														invalidFeedback={formik.errors.photo}
														style={{ display: 'none' }}
													/>
												</label>
											)}
										</CardBody>
									</CardBody>
								</div>
							</ModalBody>
							<ModalFooter className='bg-transparent'>
								<Button
									color='success'
									className='w-100'
									onClick={() => setUpcomingEventsEditOffcanvas(false)}>
									Change
								</Button>
							</ModalFooter>
						</Modal>
					</Form>
				</Formik> */}
			</Page>
		</PageWrapper>
	);
};

export default FormTeamOp;
