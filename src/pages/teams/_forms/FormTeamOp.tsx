import React, { useState, useEffect } from 'react';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import validate from '../../presentation/demo-pages/helper/editPagesValidate';

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
import { addEquipe, getCoaches } from '../../../requests';
import { coach } from '../../../types';
// import { Div } from '../../../stories/components/bootstrap/Dropdown/DropdownToggleUseChildren.stories';

const FormTeamOp = () => {
	const { themeStatus } = useDarkMode();
	const [coaches, setCoaches] = useState<coach[]>();
	/**
	 * Common
	 */
	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const formData = new FormData();
	const handleSave = async (values: any) => {
		console.log(values);
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.photo;

		try {
			formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
			formData.append('image', values.photo);

			await axios.post('https://spring-boot-sokker.onrender.com/api/equipes', formData);
			console.log('equipe sent successfully', formData);
			navigate('/equipes');
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span className='text-capitalize'>Equipe ajouter avec succés</span>
				</span>,
				'',
				'success',
			);
		} catch (error) {
			console.error('Error updating club:', error);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span className='text-capitalize'>erreur</span>
				</span>,
				'',
				'danger',
			);
		}
	};
	const navigate = useNavigate();
	const categorie = [
		{ id: 'U7', text: 'Moins de 7 ans' },
		{ id: 'U9', text: 'Moins de 9 ans' },
		{ id: 'U11', text: 'Moins de 11 ans' },
		{ id: 'U12', text: 'Moins de 13 ans' },
		{ id: 'U15', text: 'Moins de 15 ans' },
		{ id: 'U17', text: 'Moins de 17 ans' },
		{ id: 'U19', text: 'Moins de 19 ans' },
		{ id: 'Séniors', text: '20 ans et plus' },
	];

	const onSubmit = (values: any) => {
		setIsLoading(true);
		handleSave(values);
	};
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
	const formik = useFormik({
		initialValues: {
			nom: '',
			genre: 'Masculin',
			categorieAge: 'Moins de 7 ans',
			photo: null,
			nbrJoueurs: null,
			joueur_ids: [] as number[],
			coach_ids: [] as number[],
			status: true,
		},
		validationSchema,
		onSubmit,
	});

	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			const selectedImage = event.target.files[0];
			formik.setFieldValue('photo', selectedImage);

			setImage(URL.createObjectURL(selectedImage));
		}
	};

	useEffect(() => {
		getCoaches()
			.then((res) => setCoaches(res))
			.catch((err) => console.log(err));

		return () => {};
	}, []);
	console.log(coaches);

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
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
						icon={isLoading ? undefined : 'Save'}
						isLight
						color={lastSave ? 'info' : 'success'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						submit
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<Formik initialValues={formik.initialValues} onSubmit={onSubmit}>
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
													<FormGroup
														id='joueur_ids'
														label='joueur_ids'
														isFloating>
														<Select
															ariaLabel=''
															name='joueur_ids'
															className='text-capitalize'
															defaultValue='Player1'
															value={formik.values.joueur_ids}
															onChange={formik.handleChange}
															isValid={formik.isValid}
															invalidFeedback={
																formik.errors.joueur_ids
															}
															isTouched={formik.touched.joueur_ids}
															validFeedback='Looks good!'>
															<Option value='Player1'>Player1</Option>
															<Option value='Player2'>Player2</Option>
															<Option value='Player3'>Player3</Option>
														</Select>
													</FormGroup>
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
									{/* <CardActions>
										<Button
											icon='add'
											isLight
											color={lastSave ? 'info' : 'success'}
											// onClick={() => val.length < 3 && handleAdd()}
										>
											ajouter Coach
										</Button>
									</CardActions> */}
								</CardHeader>
								<CardBody className='  gap-2 w-100' isScrollable>
									<FieldArray name='coach_ids'>
										{(fieldArrayProps) => {
											const { push, remove, form } = fieldArrayProps;
											const { values } = form;
											const { coach_ids } = values;

											return (
												<div>
													{coach_ids.map((coach: any, index: any) => (
														<div key={index} className='row mb-4 '>
															<div className='col-6'>
																<Select
																	ariaLabel=''
																	name='coach_ids'
																	defaultValue='nothing'
																	onChange={(e: any) => {
																		const selectedId = parseInt(
																			e.target.value,
																			10,
																		);

																		formik.setFieldValue(
																			`coach_ids[${index}]`,
																			selectedId,
																		);
																	}}>
																	<Option
																		value='nothing'
																		disabled>
																		Select a coach
																	</Option>
																	{coaches?.map((coach) => (
																		<Option
																			key={coach.id}
																			value={coach.id}>
																			{`${coach.nom}
																			${coach.prenom}`}
																		</Option>
																	))}
																</Select>
															</div>
															<div className='col-6 '>
																<div className='row justify-content-sm-start justify-content-end '>
																	{/* <Input
																		name={`coach_ids[${index}].nv`}
																		onChange={
																			formik.handleChange
																		}
																		value={
																			formik.values.coach_ids[
																				index
																			]?.nv || ''
																		}
																		type='text'
																		style={{ minWidth: '90%' }}
																		className='w-auto'
																	/> */}
																	{index > 0 && (
																		<Button
																			type='button'
																			className='bg-danger text-white  '
																			style={{
																				width: 'fit-content',
																			}}
																			onClick={() => {
																				remove(index); // Call the remove function
																				// Set the field value manually if needed
																				formik.setFieldValue(
																					'coach_ids',
																					[
																						...coach_ids.slice(
																							0,
																							index,
																						),
																						...coach_ids.slice(
																							index +
																								1,
																						),
																					],
																				);
																			}}>
																			X
																		</Button>
																	)}
																</div>
															</div>
														</div>
													))}
													<Button
														type='button'
														className='bg-warning text-white'
														onClick={() => push('')}>
														+ ajouter coach
													</Button>
												</div>
											);
										}}
									</FieldArray>
									{/* {val.map((item, index) => {
								const inputId = `coach${index + 1}`;
								let inputPlaceholder;
								let inputValue;

								if (index === 0) {
									inputPlaceholder = 'coach principale';
									inputValue = formik.values.coach;
								} else if (index === 1) {
									inputPlaceholder = 'coach secondaire';
									inputValue = formik.values.coach2;
								} else {
									inputPlaceholder = 'coach troisieme';
									inputValue = formik.values.coach3;
								}
								const key = `coachInput-${index}`;
								return (
									<>
									
									</>
									// <div className='d-flex gap-2 mt-4 w-100 mb-4 mb-md-0' key={key}>
									// 	<Select ariaLabel='' className='w-50'>
									// 		{coaches
									// 			? coaches.map((c) => (
									// 					<Option value={c.id}>{c.nom}</Option>
									// 			  ))
									// 			: ''}
									// 	</Select>
									// 	<Input
									// 		value={formik.values.coach3}
									// 		type='text'
									// 		placeholder={inputPlaceholder}
									// 		className='w-50'
									// 	/>
									// </div>
								);
							})} */}
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
				</Formik>
			</Page>
		</PageWrapper>
	);
};

export default FormTeamOp;
