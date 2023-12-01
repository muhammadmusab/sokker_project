import React, { useState, useEffect } from 'react';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { addEquipe, getCoaches, getEquipe, getPlayer } from '../../../requests';
import { coach } from '../../../types';

const FormEditOp = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const j = queryParams.get('j');

	const [coaches, setCoaches] = useState<coach[]>();
	const [equipeId, setEquipeId] = useState<number | undefined>();
	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const [equipe, setEquipe] = useState<any | undefined>(undefined);
	const [joueurs, setJoueurs] = useState<any | undefined>(undefined);
	const [entraineur, setEntraineur] = useState<any | undefined>(undefined);

	const formData = new FormData();

	const handleSave = async (values: any) => {
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.photo;
		try {
			formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
			formData.append('image', values.photo);
			axios.put(`https://spring-boot-sokker.onrender.com/api/equipes`, formData);
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
			throw error;
		}
		// try {
		// 	formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
		// 	formData.append('image', values.photo);

		// 	await axios.post('https://spring-boot-sokker.onrender.com/api/equipes', formData);
		// 	console.log('equipe sent successfully', formData);
		// 	navigate('/equipes');
		// 	showNotification(
		// 		<span className='d-flex align-items-center'>
		// 			<Icon icon='Info' size='lg' className='me-1' />
		// 			<span className='text-capitalize'>Equipe ajouter avec succés</span>
		// 		</span>,
		// 		'',
		// 		'success',
		// 	);
		// } catch (error) {
		// 	console.error('Error updating club:', error);
		// 	showNotification(
		// 		<span className='d-flex align-items-center'>
		// 			<Icon icon='Info' size='lg' className='me-1' />
		// 			<span className='text-capitalize'>erreur</span>
		// 		</span>,
		// 		'',
		// 		'danger',
		// 	);
		// }
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
	const formik = useFormik({
		initialValues: {
			id: 0,
			nom: '',
			genre: 'Masculin',
			categorieAge: 'Moins de 7 ans',
			photo: null,
			joueurs_ids: [] as number[],
			coach_ids: [] as number[],
			status: true,
		},
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
		if (j) {
			setEquipeId(Number(j));
		}
	}, [j]);

	// useEffect(() => {
	//     getEquipe(Number(equipeId))
	//         .then((res) => {
	//             setEquipe(res);
	//             formik.setValues({
	//                 ...formik.values,
	//                 id: res.id,
	//                 nom: res.nom,
	//                 genre: res.genre,
	//                 categorieAge: res.categorieAge,
	//                 photo: res.photo,
	//                 coach_ids: res.coach_ids,
	//                 joueurs_ids: res.joueur_ids,
	//                 status: res.status,
	//                 // nbrJoueurs: res.nbrJoueurs,
	//             });
	//         })
	//         .catch((err) => console.log(err));
	//     getPlayer()
	//         .then((res) => setJoueurs(res))
	//         .catch((err) => console.log(err));

	//     getCoaches()
	//         .then((res) => setEntraineur(res))
	//         .catch((err) => console.log(err));
	// }, [equipeId]);
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'équipes', to: '/equipes' },
							{ title: 'Editer équipe', to: '/' },
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
											éditer équipe
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
													<img
														src={`data:image/png;base64,${formik.values.photo}`}
														alt='Logo'
														width={100}
														height={100}
														style={{
															minHeight: '100px',
															maxHeight: '100px',
															minWidth: '100px',
															maxWidth: '100px',
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
															isValid={formik.isValid}
															isTouched={formik.touched.nom}
															invalidFeedback={formik.errors.nom}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='lastName'
														label='Genre'
														isFloating>
														<Select
															ariaLabel=''
															name='genre'
															className='text-capitalize'
															defaultValue='Masculin'
															value={formik.values.genre}
															onChange={formik.handleChange}>
															<Option value='Garçons'>Garçons</Option>
															<Option value='Filles'>Filles</Option>
															<Option value='Mix'>mix</Option>
														</Select>
													</FormGroup>
												</div>
												<div className='col-12 mt-4'>
													<FormGroup
														id='lastName'
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
															onChange={formik.handleChange}>
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
									<CardLabel icon='person' iconColor='info'>
										<CardTitle tag='div' className='h5'>
											Entraineurs
										</CardTitle>
									</CardLabel>
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
										<CardBody className='text-center'>
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
													<img
														src={`data:image/png;base64,${formik.values.photo}`}
														alt='Product'
														style={{
															minHeight: '250px',
															maxHeight: '250px',
															minWidth: '250px',
															maxWidth: '250px',
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

export default FormEditOp;
