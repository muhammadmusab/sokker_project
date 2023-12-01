import React, { FC, useState } from 'react';
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
import { addCoach } from '../../../requests';
import WizardCoach from '../../../components/WizardCoach';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';

interface IPreviewItemProps {
	title: string;
	value: any | any[];
}

const PreviewItem: FC<IPreviewItemProps> = ({ title, value }) => {
	return (
		<>
			<div className='col-3 text-end'>{title}</div>
			<div className='col-9 fw-bold'>{value || '-'}</div>
		</>
	);
};

const FormCoaches = () => {
	const navigate = useNavigate();
	const formData = new FormData();

	const handleSubmit = async (values: any) => {
		console.log(values);
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.photo;
		console.log(valuesWithoutPhoto);

		try {
			formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));

			formData.append('image', values.photo); // Add the image to FormData
			formData.append('cv', values.photo); // Add the image to FormData
			// Add Formik values as JSON to FormData

			axios
				.post('https://spring-boot-sokker.onrender.com/api/entraineurs', formData)
				.then((response) => {
					console.log('Image upload response:', response.data);
					// Handle the API response here
				})
				.catch((error) => {
					console.error('Error uploading image:', error);
					// Handle errors here
				});
		} catch (error) {
			console.error('Error adding coach:', error);
		}
	};

	const formik = useFormik({
		initialValues: {
			nom: '',
			prenom: '',
			date_naissance: '',
			email: '',
			gender: '',
			photo: null,
			telephone: '',
			biographie: '',
			certifications: '',
			adresse: '',
			ville: '',
			nomRole: 'Entraîneur',
			code_postal: '',
		},
		// validate,
		onSubmit: (values) => {
			// alert(JSON.stringify(values));

			handleSubmit(values);
			// navigate('/entraineurs');
		},
	});

	const [image, setImage] = useState<any>();

	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			const selectedImage = event.target.files[0];
			console.log(selectedImage);
			formik.setFieldValue('photo', selectedImage); // Store the image file in Formik

			setImage(URL.createObjectURL(selectedImage));
		}
	};

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editWizard.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						color='warning'
						isLink
						icon='ArrowBack'
						onClick={() => navigate('/entraineurs')}>
						revenir à la liste
					</Button>
					<SubheaderSeparator />

					<span className='text-muted text-capitalize'>ajouter entraineur</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button color='warning' icon='Add' onClick={formik.handleSubmit}>
						Add New
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row  pb-3' style={{ height: '100vh' }}>
					<div className=' col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Edit' iconColor='warning'>
									<CardTitle>Personal Information</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody className='pt-0'>
								<div className='row'>
									<div className='col-12'>
										<div className='row g-4'>
											<div
												className='col-md-2'
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

											<div className='col-md-5'>
												<FormGroup
													id='nom'
													className='text-capitalize'
													label='nom'
													isFloating>
													<Input
														placeholder='nom'
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
												<FormGroup
													id='gender'
													className='text-capitalize mt-4'
													label='gender'
													isFloating>
													<Select
														ariaLabel=''
														className='text-capitalize'
														onChange={formik.handleChange}
														value={formik.values.gender}>
														<Option value='masculin'>masculin</Option>
														<Option value='feminin'>féminin</Option>
													</Select>
												</FormGroup>
											</div>
											<div className='col-md-5'>
												<FormGroup
													id='prenom'
													className='text-capitalize'
													label='prenom'
													isFloating>
													<Input
														placeholder='prenom'
														autoComplete='family-name'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.prenom}
														isValid={formik.isValid}
														isTouched={formik.touched.prenom}
														invalidFeedback={formik.errors.prenom}
														validFeedback='Looks good!'
													/>
												</FormGroup>
												<FormGroup
													id='date_naissance'
													className='text-capitalize mt-4'
													label='date de naissance'
													isFloating>
													<Input
														type='date'
														onChange={formik.handleChange}
														value={formik.values.date_naissance}
													/>
												</FormGroup>
											</div>
										</div>
										<div className='col-12 mt-4'>
											<FormGroup
												id='biographie'
												label='Biographie'
												isFloating>
												<Textarea
													style={{ minHeight: '150px' }}
													placeholder='Biographie'
													autoComplete='email'
													onChange={formik.handleChange}
													value={formik.values.biographie}
													isTouched={formik.touched.biographie}
												/>
											</FormGroup>
										</div>
										<div className='col-12 mt-4'>
											<FormGroup
												id='certifications'
												label='certifications'
												isFloating>
												<Textarea
													style={{ minHeight: '150px' }}
													placeholder='certifications'
													autoComplete='certifications'
													onChange={formik.handleChange}
													value={formik.values.certifications}
													isTouched={formik.touched.certifications}
												/>
											</FormGroup>
										</div>
										<div className='col-12 mt-4 h-full'>
											<div className='row g-4 justify-content-center'>
												<div className='col-auto'>
													<h3 className='text-capitalize text-center text-muted'>
														entraineur cv
													</h3>
													<Input
														id='photo'
														name='photo'
														type='file'
														onChange={(event: any) => {
															formik.setFieldValue(
																'photo',
																event.currentTarget.files[0],
															);
														}}
														placeholder='Upload CV'
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						<Card className='mb-0'>
							<CardHeader>
								<CardLabel icon='MarkunreadMailbox' iconColor='success'>
									<CardTitle>Contact Information</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody className='pt-0'>
								<div className='row g-4'>
									<div className='col-12'>
										<FormGroup id='telephone' label='Phone Number' isFloating>
											<Input
												placeholder='Phone Number'
												type='tel'
												autoComplete='tel'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.telephone}
												isValid={formik.isValid}
												isTouched={formik.touched.telephone}
												invalidFeedback={formik.errors.telephone}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup id='email' label='Email address' isFloating>
											<Input
												type='email'
												placeholder='Email address'
												autoComplete='email'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.email}
												isValid={formik.isValid}
												isTouched={formik.touched.email}
												invalidFeedback={formik.errors.email}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-lg-12'>
										<FormGroup id='adresse' label='Address Line' isFloating>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.adresse}
												isValid={formik.isValid}
												isTouched={formik.touched.adresse}
												invalidFeedback={formik.errors.adresse}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>

									<div className='col-md-6'>
										<FormGroup id='code_postal' label='code_postal' isFloating>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.code_postal}
												isValid={formik.isValid}
												isTouched={formik.touched.code_postal}
												invalidFeedback={formik.errors.code_postal}
											/>
										</FormGroup>
									</div>
									<div className='col-lg-6'>
										<FormGroup id='ville' label='ville' isFloating>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.ville}
												isValid={formik.isValid}
												isTouched={formik.touched.ville}
												invalidFeedback={formik.errors.ville}
												validFeedback='Looks good!'
											/>
										</FormGroup>
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
			</Page>
		</PageWrapper>
	);
};

export default FormCoaches;
