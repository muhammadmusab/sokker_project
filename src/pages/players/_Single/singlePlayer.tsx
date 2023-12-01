import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import { demoPagesMenu } from '../../../menu';
import tableData from '../../../common/data/dummyProductData';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import showNotification from '../../../components/extras/showNotification';
import { Player_type, datos } from '../../../types';
import { getEquipes, getPlayerById, usePlayer } from '../../../requests';
import CardS from './SkillesCard/CardS';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Select from '../../../components/bootstrap/forms/Select';
import Option, { Options } from '../../../components/bootstrap/Option';
import Wizard, { WizardItem } from '../../../components/Wizard';

type TTabs = 'Summary' | 'Comments' | 'Edit' | 'Information physique';
interface ITabs {
	[key: string]: TTabs;
}

const ProductViewPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// Get all data in json server useing useEffect() and filter by id
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

	const formData = new FormData();
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

	const formik = useFormik({
		initialValues: {
			gender: '',
			email: '',
			password: 'example_password',
			nom: '',
			prenom: '',
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
			equipeId: '',
			photo: '',
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});

	const TABS: ITabs = {
		SUMMARY: 'Summary',
		COMMENTS: 'Comments',
		EDIT: 'Edit',
		INFORMATIONSPORT: 'Information physique',
	};
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState(TABS.SUMMARY);
	const [image, setImage] = useState<string>('');
	const [equipes, setEquipes] = useState<datos[] | undefined>(undefined);
	const [ignord, forceUpdate] = useReducer((x) => x + 1, 0);

	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			const selectedImage = event.target.files[0];
			console.log(selectedImage);
			formik.setFieldValue('photo', selectedImage);
			setImage(URL.createObjectURL(selectedImage));
		}
	};

	useEffect(() => {
		getEquipes()
			.then((res) => {
				setEquipes(res);
			})
			.catch((err) => console.log(err));
	}, [ignord]);

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Back to List
					</Button>
					<SubheaderSeparator />
					<Avatar
						srcSet={USERS.RYAN.srcSet}
						src={USERS.RYAN.src}
						size={32}
						color={USERS.RYAN.color}
					/>

					<span className='text-muted'>Joueur</span>
				</SubHeaderLeft>
			</SubHeader>
			<Page>
				<div className='row h-100 ' style={{ marginTop: '-20px' }}>
					<div className='col-lg-4'>
						<Card stretch style={{ minHeight: '155px' }}>
							<Button
								icon='Edit'
								color='light'
								className=' mt-3'
								style={{
									width: '30px',
									height: '30px',
									position: 'relative',
									left: '370px',
									top: '10px',
								}}
								isLight={activeTab !== TABS.LOGOO}
								onClick={() => setUpcomingEventsEditOffcanvas(true)}
							/>
							<CardBody isScrollable>
								<div className='row g-3'>
									<div className='col-md-6' />
									<div
										className='col-12 '
										style={{
											display: 'flex',
											justifyContent: 'center',
											marginTop: '-15px',
										}}>
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
										)}{' '}
									</div>
								</div>
							</CardBody>
							<CardFooter>
								<CardFooterLeft className='w-100'>
									<Button
										icon='info'
										color='primary'
										className='w-100 p-3 mt-3'
										isLight={activeTab !== TABS.INFORMATIONSPORT}
										onClick={() => setActiveTab(TABS.INFORMATIONSPORT)}>
										{TABS.INFORMATIONSPORT}
									</Button>
									<Button
										icon='Delete'
										color='danger'
										isLight
										className='w-100 p-3  mt-3'
										onClick={() => {
											// get(Number(id))
											navigate('/staff');
										}}>
										Delete
									</Button>

									<Button
										icon='Edit'
										color='success'
										className='w-100 p-3 mt-3'
										isLight={activeTab !== TABS.EDIT}
										onClick={() => setActiveTab(TABS.EDIT)}>
										{TABS.EDIT}
									</Button>
								</CardFooterLeft>
							</CardFooter>
						</Card>
					</div>
					<div className='col-lg-8'>
						<Card
							stretch
							className='overflow-hidden'
							tag='form'
							noValidate
							onSubmit={formik.handleSubmit}>
							{activeTab === TABS.SUMMARY && (
								<>
									<CardHeader>
										<CardLabel icon='Description' iconColor='success'>
											<CardTitle>Joueur Details</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4' style={{ marginTop: '-48px' }}>
											<div className='col-md-6'>
												<FormGroup id='nom' label='Nom' isFloating>
													<Input
														id='nom'
														name='nom'
														placeholder='Nom.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.nom}
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='prenom' label='Prenom' isFloating>
													<Input
														id='prenom'
														name='prenom'
														placeholder='prenom'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.prenom}
														type='email'
														disabled
													/>
												</FormGroup>
											</div>
											<div className='col-md-6 mt-4'>
												<FormGroup
													id='numeroLicence'
													label='Numéro de licence'
													isFloating>
													<Input
														id='numeroLicence'
														name='numeroLicence'
														placeholder='Numéro de licence'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.numeroLicence}
														isValid={formik.isValid}
														invalidFeedback={
															formik.errors.numeroLicence
														}
														validFeedback='Looks good!'
														type='number'
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-sm-6 '>
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
														disabled
													/>
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
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-4'>
												<FormGroup
													id='telephone'
													label='Télephone'
													isFloating>
													<Input
														id='telephone'
														name='telephone'
														placeholder='Télephone'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.telephone}
														type='tel'
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-4'>
												<FormGroup id='genre' label='Genre' isFloating>
													<Input disabled value={formik.values.gender} />
												</FormGroup>
											</div>

											<div className='col-md-12'>
												<FormGroup id='adresse' label='Adresse' isFloating>
													<Input
														id='adresse'
														name='adresse'
														placeholder='adresse'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.adresse}
														disabled
													/>
												</FormGroup>
											</div>

											<CardLabel icon='person' iconColor='success'>
												<CardTitle>Contact Père</CardTitle>
											</CardLabel>

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
														disabled
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
														value={
															formik.values.pere_utilisateur.telephone
														}
														disabled
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
														value={
															formik.values.pere_utilisateur.adresse
														}
														disabled
													/>
												</FormGroup>
											</div>

											<CardLabel icon='person' iconColor='success'>
												<CardTitle>Contact Mère</CardTitle>
											</CardLabel>

											<div className='col-md-4 '>
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
														disabled
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
														value={
															formik.values.mere_utilisateur.telephone
														}
														placeholder='Téléphone'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														isValid={formik.isValid}
														validFeedback='Looks good!'
														type='tel'
														disabled
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
														value={
															formik.values.mere_utilisateur.adresse
														}
														placeholder='Adresse'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														isValid={formik.isValid}
														validFeedback='Looks good!'
														disabled
													/>
												</FormGroup>
											</div>
										</div>
									</CardBody>
								</>
							)}

							{activeTab === TABS.INFORMATIONSPORT && (
								<>
									<CardHeader>
										<CardLabel icon='Description' iconColor='success'>
											<CardTitle>Information Physique</CardTitle>
										</CardLabel>
										<SubHeaderRight>
											<Button
												color='info'
												isLink
												icon='ArrowBack'
												onClick={() => setActiveTab(TABS.SUMMARY)}>
												Back to List
											</Button>
										</SubHeaderRight>
									</CardHeader>
									<CardBody>
										<div className='row g-4' style={{ marginTop: '-8px' }}>
											<div className='col-md-6 '>
												<FormGroup id='post' label='Post' isFloating>
													<Input
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.poste}
														disabled
													/>
												</FormGroup>
											</div>
											<div className=' col-sm-6'>
												<FormGroup id='taille' label='Taille' isFloating>
													<Input
														id='taille'
														name='taille'
														placeholder='Taille.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.taille}
														disabled
													/>
												</FormGroup>
											</div>
											<div className=' col-sm-6'>
												<FormGroup id='poids' label='Poids' isFloating>
													<Input
														id='poids'
														name='poids'
														placeholder='poids.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.poids}
														disabled
													/>
												</FormGroup>
											</div>

											<div className=' col-sm-6'>
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
														disabled
													/>
												</FormGroup>
											</div>

											<div className=' col-sm-6'>
												<FormGroup
													id='pointure'
													label='Pointure'
													isFloating>
													<Input
														id='pointure'
														name='pointure'
														placeholder='pointure.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.pointure}
														disabled
													/>
												</FormGroup>
											</div>

											<div className=' col-sm-6'>
												<FormGroup
													id='tailleMaillot'
													label='Taille Maillot'
													isFloating>
													<Input
														id='tailleMaillot'
														name='tailleMaillot'
														placeholder='tailleMaillot.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.tailleMaillot}
														disabled
													/>
												</FormGroup>
											</div>

											<div className=' col-sm-6'>
												<FormGroup id='niveau' label='Niveau' isFloating>
													<Input
														id='niveau'
														name='niveau'
														placeholder='niveau.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.niveau}
														disabled
													/>
												</FormGroup>
											</div>
											<div className=' col-sm-6'>
												<FormGroup
													id='clubPrecedent'
													label='Club Précédent'
													isFloating>
													<Input
														id='clubPrecedent'
														name='clubPrecedent'
														placeholder='clubPrecedent.'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.clubPrecedent}
														disabled
													/>
												</FormGroup>
											</div>

											<div className=' col-sm-6'>
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
														disabled
													/>
												</FormGroup>
											</div>
										</div>
									</CardBody>
								</>
							)}

							{activeTab === TABS.EDIT && (
								<>
									<Wizard
										isHeader
										stretch
										color='info'
										noValidate
										onSubmit={formik.handleSubmit}
										className='shadow-3d-info'>
										<WizardItem id='step1' title='Account Detail'>
											<div className='row g-4'>
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
													<FormGroup
														id='prenom'
														label='Prenom'
														isFloating>
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

												<div className='col-md-6'>
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
												<div className='col-md-6'>
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

												<div className='col-md-6'>
													<FormGroup
														id='telephone'
														label='Télephone'
														isFloating>
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

												<div className='col-sm-6 '>
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

												<div className='col-md-6'>
													<FormGroup
														id='adresse'
														label='Adresse'
														isFloating>
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

												<div className='col-md-6 mt-4'>
													<FormGroup
														id='equipeId'
														label='Equipes'
														isFloating>
														<Select
															aria-label=''
															id='equipeId'
															name='equipeId'
															className='text-capitalize'
															// value={formik.values.equipeId}
															onChange={formik.handleChange}
															ariaLabel=''>
															{equipes?.map((item) => (
																<Option
																	key={item.id}
																	value={item.id}>
																	{item.nom}
																</Option>
															))}
														</Select>
													</FormGroup>
												</div>
											</div>
										</WizardItem>
										<WizardItem id='step2' title='Account Detail1'>
											<div className='row g-4'>
												<CardLabel icon='person' iconColor='success'>
													<CardTitle>Contact Père</CardTitle>
												</CardLabel>
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
															value={
																formik.values.pere_utilisateur.email
															}
															disabled
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
															value={
																formik.values.pere_utilisateur
																	.telephone
															}
															disabled
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
															value={
																formik.values.pere_utilisateur
																	.adresse
															}
															disabled
														/>
													</FormGroup>
												</div>
											</div>
										</WizardItem>

										<WizardItem id='step3' title='Account Detail3' />
									</Wizard>
									{/* <CardHeader>
                                        <CardLabel icon='Description' iconColor='success'>
                                            <CardTitle tag='div' className='h5'>
                                                Modification Joueur

                                            </CardTitle>

                                        </CardLabel> */}

									{/* <Button
                                            color='info'
                                            icon='Save'
                                            type='submit'
                                            isDisable={!formik.isValid && !!formik.submitCount}
                                            className='d-inline-block' style={{ position: 'relative', left: '210px' }}
                                            onClick={formik.handleSubmit}
                                        >

                                            Save
                                        </Button> */}
									{/* <Button
                                            color='danger'
                                            icon='cancel'
                                            onClick={() => setActiveTab(TABS.SUMMARY)}
                                            isLight={activeTab !== TABS.SUMMARY}
                                        >
                                            Cancel
                                        </Button> */}
									{/* </CardHeader> */}
									<CardBody isScrollable>
										<div className='row g-4' style={{ marginTop: '-38px' }}>
											{/* <div className='col-md-6 mt-4'>
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
                                            </div> */}

											<div className='col-md-6'>
												<FormGroup
													id='telephone'
													label='Télephone'
													isFloating>
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

											{/* <div className=' col-sm-4'>
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
                                            </div> */}

											{/* <div className=' col-sm-4'>
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
                                            </div> */}

											{/* <div className=' col-sm-4'>
                                                <FormGroup id='vma' label='VMA' isFloating>
                                                    <Input
                                                        id='vma'
                                                        name='vma'
                                                        placeholder='vma.'
                                                        autoComplete='additional-name'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.vma}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                            </div> */}

											{/* <div className=' col-sm-6'>
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
                                            </div> */}

											{/* <div className=' col-sm-6'>
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
                                            </div> */}

											{/* <div className=' col-sm-4'>
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
                                            </div> */}

											{/* <div className=' col-sm-4'>
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
                                            </div> */}

											{/* <div className=' col-sm-4'>
                                                <FormGroup id='saisonActuelle' label='Saison Actuelle' isFloating>
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
                                            </div> */}
										</div>
									</CardBody>
								</>
							)}
						</Card>
					</div>
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
													/>
												</div>
												<div className='col-12'>
													<Button color='dark' isLight icon='Delete'>
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

export default ProductViewPage;
