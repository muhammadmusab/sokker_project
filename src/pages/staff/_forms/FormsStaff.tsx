import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { getCluub, getFonction, getRoles } from '../../../requests';
import Wizard, { WizardItem } from '../../../components/Wizard';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import { Roles, fonction } from '../../../types';

const FormTeam = () => {
	const [fonction, setFonction] = useState<Roles[] | undefined>(undefined);
	const [profile, setProfile] = useState<fonction[] | undefined>(undefined);

	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const navigate = useNavigate();
	const formData = new FormData();

	useEffect(() => {
		getRoles()
			.then((res) => {
				setFonction(res);
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		getFonction()
			.then((res) => {
				setProfile(res);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleSubmit = async (values: any) => {
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.photo;
		formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
		formData.append('image', values.photo);
		try {
			const response = await axios.post(
				'https://spring-boot-sokker.onrender.com/api/staff',
				formData,
			);
			navigate('/staff');
			console.log('API response:', response);
		} catch (error) {
			console.error('API error:', error);
		}
	};

	const formik = useFormik({
		initialValues: {
			gender: '',
			email: '',
			password: '',
			nom: '',
			prenom: '',
			photo: '',
			date_naissance: '',
			telephone: '',
			adresse: '',
			code_postal: '',
			ville: '',
			biographie: '',
			status: true,
			fonction: null,
			club: null,
			absences: [],
			nomRole: '',
			profile: '',
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			const selectedImage = event.target.files[0];
			console.log(selectedImage);
			formik.setFieldValue('photo', selectedImage); // Store the image file in Formik
			setImage(URL.createObjectURL(selectedImage));
		}
	};

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'Staff', to: '/staff' },
							{ title: 'Ajouter staff', to: '/' },
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
				<div className='row  align-content-start'>
					<Card>
						<CardHeader className='mt-4'>
							<CardLabel icon='person' iconColor='info'>
								<CardTitle>Ajouter Staff</CardTitle>
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
													style={{ height: '30px' }}
												/>
											</FormGroup>
										</div>
										<div className='col-4 col-sm-6'>
											<FormGroup id='prenom' label='Prenom' isFloating>
												<Input
													id='prenom'
													name='prenom'
													placeholder='prenom'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.prenom}
												/>
											</FormGroup>
										</div>

										<div className='col-4 col-sm-6 mt-4'>
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
										<div className='col-4 col-sm-6 mt-4'>
											<FormGroup id='telephone' label='Téléphone' isFloating>
												<Input
													id='telephone'
													name='telephone'
													placeholder='telephone'
													autoComplete='additional-name'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.telephone}
												/>
											</FormGroup>
										</div>
									</div>
								</div>

								<div className='col-md-2'>
									<FormGroup id='gender' label='Gender' isFloating>
										<Select
											ariaLabel=''
											name='gender'
											className='text-capitalize'
											value={formik.values.gender}
											onChange={formik.handleChange}>
											<Option value='masculin'>Masculin</Option>
											<Option value='female'>Female</Option>
										</Select>
									</FormGroup>
								</div>

								<div className='col-md-10'>
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

								<div className='col-md-6'>
									<FormGroup id='nomRole' label='Fonction' isFloating>
										<Select
											ariaLabel=''
											name='nomRole'
											id='nomRole'
											className='text-capitalize'
											value={formik.values.nomRole}
											onChange={formik.handleChange}>
											{fonction?.map((item) => (
												<Option value={item.nomRole}>{item.nomRole}</Option>
											))}
										</Select>
									</FormGroup>
								</div>

								<div className='col-md-6'>
									<FormGroup id='profile' label='Profil' isFloating>
										<Select
											ariaLabel=''
											name='profile'
											id='profile'
											className='text-capitalize'
											value={formik.values.profile}
											onChange={formik.handleChange}>
											{profile?.map((item) => (
												<Option value={item.fonction}>
													{item.fonction}
												</Option>
											))}
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
											placeholder='date_naissance'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.date_naissance}
											type='date'
										/>
									</FormGroup>
								</div>

								<div className='col-md-6'>
									<FormGroup id='code_postal' label='Code postal' isFloating>
										<Input
											id='code_postal'
											name='code_postal'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											defaultValue={0}
											value={formik.values.code_postal}
											type='number'
										/>
									</FormGroup>
								</div>

								<div className='col-md-3'>
									<FormGroup id='ville' label='Ville' isFloating>
										<Input
											id='ville'
											name='ville'
											placeholder='Ville.'
											autoComplete='additional-name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.ville}
										/>
									</FormGroup>
								</div>

								<div className='col-md-9'>
									<FormGroup id='biographie' label='Biographie' isFloating>
										<Textarea
											id='biographie'
											name='biographie'
											value={formik.values.biographie}
											onChange={formik.handleChange}
										/>
									</FormGroup>
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
														onClick={() => {}}>
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
