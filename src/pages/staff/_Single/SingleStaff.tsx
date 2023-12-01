import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import { demoPagesMenu } from '../../../menu';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import { getFonction, getRoles, getStaffById, getStaffDelet } from '../../../requests';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Option from '../../../components/bootstrap/Option';
import Select from '../../../components/bootstrap/forms/Select';
import { Roles, Staff, fonction } from '../../../types';

const ProductViewPage = () => {
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	const [roles, setRoles] = useState<Roles[] | undefined>(undefined);
	const [editRoleIds, setEditRoleIds] = useState<number[]>([]);
	const { id } = useParams();
	const navigate = useNavigate();

	type TTabs = 'Summary' | 'Comments' | 'Edit' | 'Chart' | 'Logo';
	interface ITabs {
		[key: string]: TTabs;
	}
	const TABS: ITabs = {
		SUMMARY: 'Summary',
		COMMENTS: 'Comments',
		EDIT: 'Edit',
		CHARTSS: 'Chart',
		LOGOO: 'Logo',
	};
	const [activeTab, setActiveTab] = useState(TABS.SUMMARY);
	const [fonction, setFonction] = useState<Roles[] | undefined>(undefined);
	const [profile, setProfile] = useState<fonction[] | undefined>(undefined);
	const [image, setImage] = useState<string>('');

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

	const formData = new FormData();
	const handleSubmit = async (values: any) => {
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.photo;
		formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
		formData.append('image', values.photo);

		try {
			const response = await axios.put(
				'https://spring-boot-sokker.onrender.com/api/staff/',
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
			id,
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
			// status: '',
			club: null,
			absences: [],
			nomRole: '',
			profile: '',
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});

	// Get all data in json server useing useEffect() and filter by id
	const [StaffById, setStaffById] = useState<Staff | undefined>(undefined);
	useEffect(() => {
		if (id) {
			const numericId = parseInt(id, 10);
			if (!isNaN(numericId)) {
				getStaffById(numericId)
					.then((res) => {
						setStaffById(res);
					})
					.catch((err) => console.error(err));
			} else {
				console.error('Invalid ID provided');
			}
		}
	}, [id]);

	useEffect(() => {
		getStaffById(Number(id)).then((res) => {
			formik.setValues({
				...formik.values,
				gender: res.gender,
				email: res.email,
				password: res.password,
				nom: res.nom,
				prenom: res.prenom,
				telephone: res.telephone,
				adresse: res.adresse,
				code_postal: res.code_postal,
				// status: res.status ? "Active" : "Inactive",
				ville: res.ville,
				nomRole: res.role?.nomRole ?? '',
				biographie: res.biographie,
				date_naissance: new Date(res.date_naissance).toISOString().split('T')[0],
				profile: res.profile,
				photo: res.photo,
			});
		});
	}, [id]);

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
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Back to List
					</Button>
					<SubheaderSeparator />
					<Avatar
						srcSet={USERS.RYAN.srcSet}
						src='https://seeklogo.com/images/R/Raja-logo-29E13B1469-seeklogo.com.png'
						size={32}
						color={USERS.RYAN.color}
					/>
					<span>
						<strong>{StaffById?.nom ? StaffById?.nom : 'NOT FOUND'}</strong>
					</span>
					<span className='text-muted'>
						{StaffById?.role?.nomRole ? StaffById?.role.nomRole : 'NOT FOUND'}
					</span>
				</SubHeaderLeft>
			</SubHeader>
			<Page>
				<div className='row h-100'>
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
										icon='Delete'
										color='danger'
										isLight
										className='w-100 p-3'
										onClick={() => {
											getStaffDelet(Number(id));
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
											<CardTitle>Staff Details</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4' style={{ marginTop: '-38px' }}>
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

											<div className='col-md-6'>
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

											<div className='col-md-6'>
												<FormGroup id='gender' label='Gender' isFloating>
													<Input
														id='gender'
														placeholder='gender'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														defaultValue={0}
														value={formik.values.gender}
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
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

											<div className='col-md-6'>
												<FormGroup
													id='telephone'
													label='Téléphone'
													isFloating>
													<Input
														id='telephone'
														name='telephone'
														placeholder='telephone'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.telephone}
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='ville' label='Ville' isFloating>
													<Input
														id='ville'
														name='ville'
														placeholder='ville'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.ville}
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='status' label='Status' isFloating>
													<Input
														id='status'
														name='status'
														placeholder='status'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														// value={formik.values.status}
														value='Active'
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='profil' label='Profil' isFloating>
													<Input
														id='profil'
														name='profil'
														placeholder='profil'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.profile}
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='nomRole' label='Fonction' isFloating>
													<Input
														id='nomRole'
														name='nomRole'
														placeholder='nomRole'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.nomRole}
														disabled
													/>
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
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup
													id='code_postal'
													label='Code postal'
													isFloating>
													<Input
														id='code_postal'
														name='code_postal'
														placeholder='code_postal'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.code_postal}
														type='number'
														disabled
													/>
												</FormGroup>
											</div>

											<div className='col-md-12'>
												<FormGroup
													id='biographie'
													label='Biographie'
													isFloating>
													<Textarea
														id='biographie'
														name='biographie'
														value={formik.values.biographie}
														onChange={formik.handleChange}
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
									<CardHeader>
										<CardLabel icon='Edit' iconColor='success'>
											<CardTitle tag='div' className='h5'>
												Modification Staff
											</CardTitle>
										</CardLabel>
										<Button
											color='info'
											icon='Save'
											type='submit'
											isDisable={!formik.isValid && !!formik.submitCount}
											className='d-inline-block'
											style={{ position: 'relative', left: '210px' }}
											onClick={formik.handleSubmit}>
											Save
										</Button>
										<Button
											color='danger'
											icon='cancel'
											onClick={() => setActiveTab(TABS.SUMMARY)}
											isLight={activeTab !== TABS.SUMMARY}>
											Cancel
										</Button>
									</CardHeader>
									<CardBody isScrollable>
										{/* <CardBody> */}
										<div className='row g-4' style={{ marginTop: '-38px' }}>
											<div className='col-md-6 '>
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
													/>
												</FormGroup>
											</div>

											<div className='col-md-6 '>
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
												<FormGroup id='gender' label='Gender' isFloating>
													<Input
														id='gender'
														placeholder='gender'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														defaultValue={0}
														value={formik.values.gender}
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
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
												<FormGroup
													id='telephone'
													label='Téléphone'
													isFloating>
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

											<div className='col-md-6'>
												<FormGroup id='ville' label='Ville' isFloating>
													<Input
														id='ville'
														name='ville'
														placeholder='ville'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.ville}
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='status' label='Status' isFloating>
													<Select
														ariaLabel=''
														id='status'
														name='status'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														// value={formik.values.status}
													>
														<Option value='Admin'>Admin</Option>
														<Option value='Staff'>Staff</Option>
													</Select>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup id='profile' label='Profile' isFloating>
													<Select
														ariaLabel=''
														name='profile'
														id='profile'
														className='text-capitalize'
														value={formik.values.profile}
														onChange={formik.handleChange}>
														<Option value='Admin'>Admin</Option>
														<Option value='Staff'>Staff</Option>
													</Select>
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
															<Option value={item.nomRole}>
																{item.nomRole}
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
												<FormGroup
													id='code_postal'
													label='Code postal'
													isFloating>
													<Input
														id='code_postal'
														name='code_postal'
														placeholder='code_postal'
														autoComplete='additional-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.code_postal}
														type='number'
													/>
												</FormGroup>
											</div>

											<div className='col-md-12'>
												<FormGroup
													id='biographie'
													label='Biographie'
													isFloating>
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
								</>
							)}
						</Card>
					</div>
				</div>
				{StaffById ? (
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
				) : (
					''
				)}
			</Page>
		</PageWrapper>
	);
};

export default ProductViewPage;
