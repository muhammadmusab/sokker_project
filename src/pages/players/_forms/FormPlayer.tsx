import React, { useEffect, useReducer, useState } from 'react';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
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
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Option, { Options } from '../../../components/bootstrap/Option';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import { addPlayer, getCluub, getEquipes, updateItemById } from '../../../requests';
import { datos } from '../../../types';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormBlocks from '../../../components/forms/FormBlocks';
import toast from 'react-hot-toast';

type FormPlayerProps = {
	mode: 'edit' | 'add';
	defaultData?: FieldValues;
};

const FormPlayer = ({ mode, defaultData }: FormPlayerProps) => {
	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	// const [isLoading, setIsLoading] = useState<boolean>(false);
	const [equipes, setEquipes] = useState<datos[] | undefined>(undefined);
	const [ignord, forceUpdate] = useReducer((x) => x + 1, 0);
	const [image, setImage] = useState<string>('');
	const formData = new FormData();

	const navitage = useNavigate();

	// Get All Equipes
	useEffect(() => {
		getEquipes()
			.then((data) => {
				setEquipes(data.content);
			})
			.catch((err) => console.log(err));
	}, [ignord]);

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const onSubmit = async (values: any) => {
		const valuesWithoutPhoto = { ...values };

		delete valuesWithoutPhoto.photo;
		valuesWithoutPhoto.club = valuesWithoutPhoto.club.value;
		valuesWithoutPhoto.equipeId = valuesWithoutPhoto.equipeId.value;
		formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
		formData.append('image', values.photo[0]);

		if (mode === 'add')
			await addJoueurMutation(formData)
				.then((res) => {
					toast.success(res.data);
					reset();
					navigate('/joueurs');
					queryClient.invalidateQueries({
						queryKey: ['joueurs'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		else {
			await updateJoueurMutation(formData)
				.then((res) => {
					toast.success('Joueur Modifier');
					reset();
					navigate('/joueurs');
					queryClient.invalidateQueries({
						queryKey: ['joueurs'],
					});
				})
				.catch((error) => {
					toast.error(error.message);
				});
		}
	};

	// const formik = useFormik({
	// 	initialValues: {
	// 		gender: '',
	// 		email: '',
	// 		password: 'example_password',
	// 		nom: '',
	// 		prenom: '',
	// 		date_naissance: '',
	// 		telephone: '',
	// 		adresse: '',
	// 		absences: [],
	// 		numeroLicence: '',
	// 		poste: '',
	// 		ficheSante: 'Health information',
	// 		taille: '',
	// 		poids: '',
	// 		vma: '',
	// 		clubPrecedent: '',
	// 		niveau: '',
	// 		saisonActuelle: '',
	// 		pointure: '',
	// 		tailleMaillot: '',
	// 		reseau_sociauxes: [],
	// 		mere_utilisateur: {
	// 			email: '',
	// 			telephone: '',
	// 			adresse: '',
	// 		},
	// 		pere_utilisateur: {
	// 			email: '',
	// 			telephone: '',
	// 			adresse: '',
	// 		},
	// 		statistiqueJoueur: [],
	// 		equipeId: '',
	// 		photo: '',
	// 	},
	// 	onSubmit: (values) => {
	// 		handleSubmit(values);
	// 	},
	// });

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);

	// const onImageChange = (event: any) => {
	// 	if (event.target.files && event.target.files[0]) {
	// 		const selectedImage = event.target.files[0];
	// 		console.log(selectedImage);
	// 		formik.setFieldValue('photo', selectedImage); // Store the image file in Formik
	// 		setImage(URL.createObjectURL(selectedImage));
	// 	}
	// };

	const { mutateAsync: addJoueurMutation, isLoading } = useMutation((formData: FormData) =>
		addPlayer(formData),
	);
	const { mutateAsync: updateJoueurMutation, isLoading: isLoadingUpdate } = useMutation(
		(formData: FormData) => updateItemById({ endPoint: 'joueurs', formData }),
	);

	const hookForm = useForm({
		defaultValues: defaultData ?? {
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
				email: '',
				telephone: '',
				adresse: '',
			},
			pere_utilisateur: {
				email: '',
				telephone: '',
				adresse: '',
			},
			statistiqueJoueur: [],
			equipeId: '',
			photo: '',
		},
		// resolver: zodResolver(CLUB_FORM_SCHEMA),
	});

	const { handleSubmit, control, reset } = hookForm;

	const playerFormBlocks = [
		{
			title: 'Joueur photo',
			formFields: [
				{
					id: 'photo',
					name: 'photo',
					label: 'Chose your file',
					placeHolder: 'Chose you file',
					type: 'file',
					className: 'col-12',
				},
			],
		},
		{
			title: 'Personal Information',
			formFields: [
				{
					id: 'nom',
					name: 'nom',
					label: 'Nom de joueur',
					placeHolder: 'Nom de joueur',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'prenom',
					name: 'prenom',
					label: 'Prenom de joueur',
					placeHolder: 'Prenom de joueur',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'email',
					name: 'email',
					label: 'Mail',
					placeHolder: 'Mail',
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
					id: 'numeroLicence',
					name: 'numeroLicence',
					label: 'Numéro de licence',
					placeHolder: 'Numéro de licence',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'poste',
					name: 'poste',
					label: 'Poste',
					options: [
						{
							label: 'Attaquant',
							value: 'Attaquant',
						},
						{
							label: 'Milieu',
							value: 'Milieu',
						},
						{
							label: 'Défenseur',
							value: 'Défenseur',
						},
						{
							label: 'Gardien',
							value: 'Gardien',
						},
					],
					placeHolder: 'Poste',
					type: 'select',
					className: 'col-md-4',
				},
				{
					id: 'gender',
					name: 'gender',
					label: 'Gender',
					options: [
						{
							label: 'Garçon',
							value: 'Garçon',
						},
						{
							label: 'Fille',
							value: 'Fille',
						},
					],
					placeHolder: 'Gender',
					type: 'select',
					className: 'col-md-4',
				},
				{
					id: 'date_naissance',
					name: 'date_naissance',
					label: 'Date de naissance',
					placeHolder: 'Date de naissance',
					type: 'date',
					className: 'col-md-4',
				},
				{
					id: 'taille',
					name: 'taille',
					label: 'Taille',
					placeHolder: 'Taille',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'poids',
					name: 'poids',
					label: 'Poids',
					placeHolder: 'Poids',
					type: 'text',
					className: 'col-md-4',
				},
			],
		},
		{
			title: 'Professional Information',
			formFields: [
				{
					label: 'Club',
					placeholder: 'Sélectionner les Club',
					name: 'club',
					type: 'ReactSelect',
					callback: async (query: string) => {
						const data = await getCluub();
						if (!data?.content) return [];
						const { content } = data;
						return content.map((club) => {
							return {
								label: club.nom,
								value: club.id,
							};
						});
					},
					isAsync: true,
					className: 'col-md-4',
				},
				{
					id: 'equipe',
					label: 'Equipe',
					placeholder: 'Equpie',
					name: 'equipeId',
					type: 'ReactSelect',
					callback: async (query: string) => {
						const data = await getEquipes();
						if (!data?.content) return [];
						const { content } = data;
						return content.map((equipe) => {
							return {
								label: equipe.nom,
								value: equipe.id,
							};
						});
					},
					isAsync: true,
					className: 'col-md-4',
				},
				{
					id: 'pointure',
					label: 'Pointure',
					placeholder: 'Pointure',
					name: 'pointure',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'vma',
					label: 'Vma',
					placeholder: 'Vma',
					name: 'vma',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'tailleMaillot',
					label: 'TailleMaillot',
					placeholder: 'TailleMaillot',
					name: 'tailleMaillot',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'clubPrecedent',
					label: 'Club Precedent',
					placeholder: 'Club Precedent',
					name: 'clubPrecedent',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'niveau',
					label: 'Niveau',
					placeholder: 'Niveau',
					name: 'niveau',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'saisonActuelle',
					label: 'Saison Actuelle',
					placeholder: 'Saison Actuelle',
					name: 'saisonActuelle',
					type: 'text',
					className: 'col-md-4',
				},

				//   {
				// 	label: 'Fonction',
				// 	placeholder: 'Fonction',
				// 	name: 'fonction',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
				//   {
				// 	label: 'Drive',
				// 	placeholder: 'Drive',
				// 	name: 'drive',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
			],
		},
		{
			title: 'Mere Information',
			formFields: [
				{
					label: 'Email',
					placeholder: 'Email',
					name: 'mere_utilisateur.email',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'password',
					label: 'Password',
					placeholder: 'Password',
					name: 'mere_utilisateur.password',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'nom',
					label: 'Nom',
					placeholder: 'Nom',
					name: 'mere_utilisateur.nom',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'prenom',
					label: 'Prenom',
					placeholder: 'Prenom',
					name: 'mere_utilisateur.prenom',
					type: 'text',
					className: 'col-md-4',
				},
				//   {
				// 	label: 'Biographie',
				// 	placeholder: 'Biographie',
				// 	name: 'mere_utilisateur.biographie',
				// 	formControl: Control.Textarea,
				// 	className: 'col-md-4',
				//   },
				{
					id: 'telephone',
					label: 'Telephone',
					placeholder: 'Telephone',
					name: 'mere_utilisateur.telephone',
					type: 'tel',
					className: 'col-md-4',
				},
				//   {
				// 	label: 'Adresse',
				// 	placeholder: 'Adresse',
				// 	name: 'mere_utilisateur.adresse',
				// 	formControl: Control.TextInput,
				// 	className: 'col-md-4',
				//   },

				{
					label: 'Genre',
					placeholder: '',
					name: 'mere_utilisateur.gender',
					type: 'select',
					options: [
						{
							label: 'Garçon',
							value: 'Garçon',
						},
						{
							label: 'Fille',
							value: 'Fille',
						},
					],
					className: 'col-md-4',
				},
				//   {
				// 	label: 'Code Postal',
				// 	placeholder: 'Code Postal',
				// 	name: 'mere_utilisateur.code_postal',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
				//   {
				// 	label: 'Ville',
				// 	placeholder: 'Ville',
				// 	name: 'mere_utilisateur.ville',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
				//   {
				// 	label: 'Fonction',
				// 	placeholder: 'Fonction',
				// 	name: 'mere_utilisateur.fonction',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
			],
		},
		{
			title: 'Pere Information',
			formFields: [
				{
					label: 'Email',
					placeholder: 'Email',
					name: 'pere_utilisateur.email',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'password',
					label: 'Password',
					placeholder: 'Password',
					name: 'pere_utilisateur.password',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'nom',
					label: 'Nom',
					placeholder: 'Nom',
					name: 'pere_utilisateur.nom',
					type: 'text',
					className: 'col-md-4',
				},
				{
					id: 'prenom',
					label: 'Prenom',
					placeholder: 'Prenom',
					name: 'pere_utilisateur.prenom',
					type: 'text',
					className: 'col-md-4',
				},
				//   {
				// 	label: 'Biographie',
				// 	placeholder: 'Biographie',
				// 	name: 'pere_utilisateur.biographie',
				// 	formControl: Control.Textarea,
				// 	className: 'col-md-4',
				//   },
				{
					id: 'telephone',
					label: 'Telephone',
					placeholder: 'Telephone',
					name: 'pere_utilisateur.telephone',
					type: 'tel',
					className: 'col-md-4',
				},
				//   {
				// 	label: 'Adresse',
				// 	placeholder: 'Adresse',
				// 	name: 'pere_utilisateur.adresse',
				// 	formControl: Control.TextInput,
				// 	className: 'col-md-4',
				//   },

				{
					label: 'Genre',
					placeholder: '',
					name: 'pere_utilisateur.gender',
					type: 'select',
					options: [
						{
							label: 'Garçon',
							value: 'Garçon',
						},
						{
							label: 'Fille',
							value: 'Fille',
						},
					],
					className: 'col-md-4',
				},
				//   {
				// 	label: 'Code Postal',
				// 	placeholder: 'Code Postal',
				// 	name: 'pere_utilisateur.code_postal',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
				//   {
				// 	label: 'Ville',
				// 	placeholder: 'Ville',
				// 	name: 'pere_utilisateur.ville',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
				//   {
				// 	label: 'Fonction',
				// 	placeholder: 'Fonction',
				// 	name: 'pere_utilisateur.fonction',
				// 	formControl: Control.TextInput,
				// 	colProps: {
				// 	  sm: 6,
				// 	},
				//   },
			],
		},
	];

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
			<Page>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DevTool control={control} />
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
							<FormBlocks formBlocks={playerFormBlocks} hookForm={hookForm} />
						</div>
					</Page>
				</form>
				{/* <div className='row h-100 align-content-start'>
					<div className='col-md-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Person' iconColor='success'>
									<CardTitle tag='div' className='h5 text-capitalize'>
										Ajouter joueur
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-sm-2'>
										<button
											type='button'
											className='col-12 w-100'
											style={{
												display: 'flex',
												justifyContent: 'center',
												marginTop: '-15px',
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
										</button>
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
													/>
												</FormGroup>
											</div>

											<div className='col-md-6 mt-4'>
												<FormGroup id='poste' label='poste' isFloating>
													<Select
														ariaLabel=''
														id='poste'
														name='poste'
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
										<FormGroup id='gender' label='gender' isFloating>
											<Select
												id='gender'
												ariaLabel=''
												name='gender'
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
												value={formik.values.equipeId}
												onChange={formik.handleChange}
												ariaLabel=''>
												{equipes && equipes.length
													? equipes?.map((item) => (
															<Option key={item.id} value={item.id}>
																{item.nom}
															</Option>
													  ))
													: null}
											</Select>
										</FormGroup>
									</div>
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
														value={
															formik.values.pere_utilisateur.telephone
														}
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
														value={
															formik.values.mere_utilisateur.telephone
														}
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
														value={
															formik.values.mere_utilisateur.adresse
														}
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
										<CardTitle>Product Image</CardTitle>
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
						>
							Update
						</Button>
					</ModalFooter>
				</Modal> */}
			</Page>
		</PageWrapper>
	);
};

export default FormPlayer;
