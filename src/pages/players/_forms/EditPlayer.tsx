import React, { FC, useEffect, useReducer, useState } from 'react';
import { Formik, useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import User1Webp from '../../../assets/img/wanna/wanna2.webp';
import User1Img from '../../../assets/img/wanna/wanna2.png';
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
import { getEquipes, getPlayerById, usePlayer } from '../../../requests';

import Wizard, { WizardItem } from '../../../components/Wizard';
import { Player_type, datos } from '../../../types';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';

const FormTeam = () => {
	const navigate = useNavigate();
	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const formData = new FormData();
	const [equipes, setEquipes] = useState<datos[] | undefined>(undefined);
	const [ignord, forceUpdate] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		getEquipes()
			.then((res) => {
				setEquipes(res);
			})
			.catch((err) => console.log(err));
	}, [ignord]);

	const handleSubmit = async (values: any) => {
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.photo;
		formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
		formData.append('image', values.photo);

		try {
			const response = await axios.put(
				'https://spring-boot-sokker.onrender.com/api/joueurs',
				formData,
			);
			navigate('/joueur');
			console.log('API response:', response);
		} catch (error) {
			console.error('API error:', error);
		}
	};
	const { id } = useParams();

	const [players, setPlayers] = useState<Player_type | undefined>(undefined);
	useEffect(() => {
		getPlayerById(Number(id)).then((res) => {
			setPlayers(res);
			formik.setValues({
				...formik.values,
				gender: res.gender, // Set the initial value here
				email: res.email,
				nom: res.nom,
				prenom: res.prenom,
				photo: res.photo,
				date_naissance: new Date(res.date_naissance).toISOString().split('T')[0],
				telephone: res.telephone,
				adresse: res.adresse,
				numeroLicence: res.numeroLicence,
				poste: res.poste,
				taille: res.taille,
				poids: res.poids,
				vma: res.vma,
				clubPrecedent: res.clubPrecedent,
				niveau: res.niveau,
				saisonActuelle: res.saisonActuelle,
				pointure: res.pointure,
				tailleMaillot: res.tailleMaillot,

				mere_utilisateur: {
					...formik.values.mere_utilisateur,
					id: res.mere_utilisateur.id,
					email: res.mere_utilisateur?.email || '',
					telephone: res.mere_utilisateur?.telephone || '',
					adresse: res.mere_utilisateur?.adresse || '',
				},
				pere_utilisateur: {
					...formik.values.pere_utilisateur,
					id: res.pere_utilisateur.id,
					email: res.pere_utilisateur?.email || '',
					telephone: res.pere_utilisateur?.telephone || '',
					adresse: res.pere_utilisateur?.adresse || '',
				},
			});
		});
	}, [id]);

	const formik = useFormik({
		initialValues: {
			id,
			gender: '',
			email: '',
			password: 'example_password',
			nom: '',
			prenom: '',
			photo: '',
			date_naissance: '',
			telephone: '',
			adresse: '',
			absences: [],
			numeroLicence: '',
			poste: '',
			ficheSante: 'Health information',
			taille: '',
			poids: '',
			vma: '',
			clubPrecedent: '',
			niveau: '',
			saisonActuelle: '',
			pointure: '',
			tailleMaillot: '',
			reseau_sociauxes: [],
			mere_utilisateur: {
				id: '',
				email: '',
				telephone: '',
				adresse: '',
			},
			pere_utilisateur: {
				id: '',
				email: '',
				telephone: '',
				adresse: '',
			},
			statistiqueJoueur: [],
			equipeId: 1,
			status: true,
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});

	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			const selectedImage = event.target.files[0];
			console.log(selectedImage);
			formik.setFieldValue('photo', selectedImage);
			setImage(URL.createObjectURL(selectedImage));
		}
	};

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'joueurs', to: '/joueur' },
							{ title: 'Ajouter joueur', to: '/' },
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
				<div className='row h-100 align-content-start'>
					<Card>
						<CardHeader className='mt-4'>
							<CardLabel icon='person' iconColor='success'>
								<CardTitle>Modification Joueur</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='row g-4'>
								<div className='col-sm-2'>
									<div
										className='col-12 w-100'
										style={{
											display: 'flex',
											justifyContent: 'center',
											marginTop: '-5px',
										}}
										onClick={() => setUpcomingEventsEditOffcanvas(true)}>
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
												src={`data:image/png;base64,${
													formik.values.photo ? formik.values.photo : ''
												}`}
												style={{
													width: 'fit-content',
													maxWidth: '100%',
												}}
											/>
										)}
									</div>
								</div>
								<div className='col-sm-10'>
									<div className='row'>
										<div className='col-8 col-sm-6'>
											<FormGroup id='nom' label='Nom' isFloating>
												<Input
													id='nom'
													name='nom'
													placeholder='Nom.'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.nom}
												/>
											</FormGroup>
										</div>

										<div className='col-sm-6'>
											<FormGroup id='prenom' label='Prenom' isFloating>
												<Input
													id='prenom'
													name='prenom'
													placeholder='Prenom de joueur'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.prenom}
												/>
											</FormGroup>
										</div>

										<div className='col-md-6 mt-4'>
											<FormGroup id='post' label='Post' isFloating>
												<Select
													ariaLabel=''
													id='post'
													name='post'
													className='text-capitalize'
													value={formik.values.poste}
													onChange={formik.handleChange}>
													<Option value='Attaquant'>Attaquant</Option>
													<Option value='Milieu'>Milieu</Option>
													<Option value='Défenseur'>Défenseur</Option>
													<Option value='Gardien'>Gardien</Option>
												</Select>
											</FormGroup>
										</div>
									</div>
								</div>

								<div className='col-md-4'>
									<FormGroup id='genre' label='Genre' isFloating>
										<Select
											id='genre'
											ariaLabel=''
											name='genre'
											className='text-capitalize'
											defaultValue='Masculin'
											value={formik.values.gender}
											onChange={formik.handleChange}>
											<Option value='Male'>masculin</Option>
											<Option value='Female'>féminin</Option>
										</Select>
									</FormGroup>
								</div>

								<div className='col-md-4'>
									<FormGroup
										id='date_naissance'
										label='Date de naissance'
										isFloating>
										<Input
											id='date_naissance'
											name='date_naissance'
											placeholder='Date de naissance'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											type='date'
											value={formik.values.date_naissance}
										/>
									</FormGroup>
								</div>

								<div className='col-md-4'>
									<FormGroup id='telephone' label='Télephone' isFloating>
										<Input
											id='telephone'
											name='telephone'
											placeholder='Télephone'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.telephone}
											type='tel'
										/>
									</FormGroup>
								</div>

								<div className='col-sm-4 '>
									<FormGroup id='email' label='Mail' isFloating>
										<Input
											id='email'
											name='email'
											placeholder='email'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.email}
											type='email'
										/>
									</FormGroup>
								</div>

								<div className='col-md-8'>
									<FormGroup id='adresse' label='Adresse' isFloating>
										<Input
											id='adresse'
											name='adresse'
											placeholder='adresse'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.adresse}
										/>
									</FormGroup>
								</div>

								<div className=' col-sm-4'>
									<FormGroup id='taille' label='Taille' isFloating>
										<Input
											id='taille'
											name='taille'
											placeholder='Taille.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.taille}
										/>
									</FormGroup>
								</div>
								<div className=' col-sm-4'>
									<FormGroup id='poids' label='Poids' isFloating>
										<Input
											id='poids'
											name='poids'
											placeholder='poids.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.poids}
										/>
									</FormGroup>
								</div>
								<div className=' col-sm-4'>
									<FormGroup id='vma' label='VMA' isFloating>
										<Input
											id='vma'
											name='vma'
											placeholder='vma.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.vma}
											type='number'
										/>
									</FormGroup>
								</div>

								<div className=' col-sm-6'>
									<FormGroup id='pointure' label='Pointure' isFloating>
										<Input
											id='pointure'
											name='pointure'
											placeholder='pointure.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.pointure}
										/>
									</FormGroup>
								</div>

								<div className=' col-sm-6'>
									<FormGroup id='tailleMaillot' label='Taille Maillot' isFloating>
										<Input
											id='tailleMaillot'
											name='tailleMaillot'
											placeholder='tailleMaillot.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.tailleMaillot}
										/>
									</FormGroup>
								</div>

								<div className=' col-sm-4'>
									<FormGroup id='niveau' label='Niveau' isFloating>
										<Input
											id='niveau'
											name='niveau'
											placeholder='niveau.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.niveau}
										/>
									</FormGroup>
								</div>
								<div className=' col-sm-4'>
									<FormGroup id='clubPrecedent' label='Club Précédent' isFloating>
										<Input
											id='clubPrecedent'
											name='clubPrecedent'
											placeholder='clubPrecedent.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.clubPrecedent}
										/>
									</FormGroup>
								</div>
								<div className=' col-sm-4'>
									<FormGroup
										id='saisonActuelle'
										label='Saison Actuelle'
										isFloating>
										<Input
											id='saisonActuelle'
											name='saisonActuelle'
											placeholder='saisonActuelle.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.saisonActuelle}
										/>
									</FormGroup>
								</div>
								<div className='col-md-6 mt-4'>
									<FormGroup id='equipeId' label='Equipes' isFloating>
										<Select
											aria-label=''
											id='equipeId'
											name='equipeId'
											className='text-capitalize'
											// value={formik.values.equipeId}
											onChange={formik.handleChange}
											ariaLabel=''>
											{equipes?.map((item) => (
												<Option key={item.id} value={item.id}>
													{item.nom}
												</Option>
											))}
										</Select>
									</FormGroup>
								</div>

								{/* <div className='col-md-4'>
										<FormGroup id='lastName' label='Fiche santé' isFloating>
											<Input
												placeholder='Fiche santé'
												autoComplete='additional-name'
												onChange={formik.handleChange}
												type='file'
											/>
										</FormGroup>
									</div> */}

								<div className='col-md-12'>
									<CardTitle tag='div' className='h4 text-capitalize'>
										Contact Père
									</CardTitle>

									<div className='row'>
										<div className='col-md-4'>
											<FormGroup
												id='pere_utilisateur.email'
												label='Mail'
												isFloating>
												<Input
													id='pere_utilisateur.email'
													name='pere_utilisateur.email'
													placeholder='emailPere'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													validFeedback='Looks good!'
													type='email'
													value={formik.values.pere_utilisateur.email}
												/>
											</FormGroup>
										</div>
										<div className='col-md-4'>
											<FormGroup
												id='pere_utilisateur.telephone'
												label='Téléphone'
												isFloating>
												<Input
													id='pere_utilisateur.telephone'
													name='pere_utilisateur.telephone'
													placeholder='Téléphone'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													validFeedback='Looks good!'
													type='tel'
													value={formik.values.pere_utilisateur.telephone}
												/>
											</FormGroup>
										</div>
										<div className='col-md-4'>
											<FormGroup
												id='pere_utilisateur.adresse'
												label='Adresse'
												isFloating>
												<Input
													id='pere_utilisateur.adresse'
													name='pere_utilisateur.adresse'
													placeholder='Adresse'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													validFeedback='Looks good!'
													value={formik.values.pere_utilisateur.adresse}
												/>
											</FormGroup>
										</div>
									</div>
								</div>

								<div className='col-md-12'>
									<CardTitle tag='div' className='h4 text-capitalize'>
										Contact Mère
									</CardTitle>

									<div className='row'>
										<div className='col-md-4'>
											<FormGroup
												id='mere_utilisateur.email'
												label='Mail'
												isFloating>
												<Input
													id='mere_utilisateur.email'
													name='mere_utilisateur.email'
													placeholder='Mail'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													validFeedback='Looks good!'
													type='email'
													value={formik.values.mere_utilisateur.email}
												/>
											</FormGroup>
										</div>
										<div className='col-md-4'>
											<FormGroup
												id='mere_utilisateur.telephone'
												label='Téléphone'
												isFloating>
												<Input
													id='mere_utilisateur.telephone'
													name='mere_utilisateur.telephone'
													value={formik.values.mere_utilisateur.telephone}
													placeholder='Téléphone'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													validFeedback='Looks good!'
													type='tel'
												/>
											</FormGroup>
										</div>
										<div className='col-md-4'>
											<FormGroup
												id='mere_utilisateur.adresse'
												label='Adresse'
												isFloating>
												<Input
													id='mere_utilisateur.adresse'
													name='mere_utilisateur.adresse'
													value={formik.values.mere_utilisateur.adresse}
													placeholder='Adresse'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
									</div>
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
					isScrollable
					size='lg'>
					<ModalBody>
						<div className='row g-4'>
							<CardBody isScrollable style={{ minHeight: '280px' }}>
								<CardHeader>
									<CardLabel icon='Photo' iconColor='info'>
										<CardTitle>Modification Image</CardTitle>
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
												<img
													src={`data:image/png;base64,${
														formik.values.photo
															? formik.values.photo
															: ''
													}`}
													style={{
														width: 'fit-content',
														maxWidth: '100%',
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
			</Page>
		</PageWrapper>
	);
};

export default FormTeam;
