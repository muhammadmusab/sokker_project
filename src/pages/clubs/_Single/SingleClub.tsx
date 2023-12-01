/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
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
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import { Cluub } from '../../../types';
import { getClubById, getClubDelete } from '../../../requests';
import Modal, { ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import { RequestWrapper } from '../../../layout/PageWrapper/RequestWrapper';

type TTabs = 'Summary' | 'Comments' | 'Edit' | 'Chart' | 'Logo';
interface ITabs {
	[key: string]: TTabs;
}
const ProductViewPage = () => {
	const TABS: ITabs = {
		SUMMARY: 'Summary',
		COMMENTS: 'Comments',
		EDIT: 'Edit',
		CHARTSS: 'Chart',
		LOGOO: 'Logo',
	};
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		data: club,
		error,
		isLoading,
	} = useQuery<Cluub, AxiosError>({
		queryFn: () => getClubById(id),
		queryKey: ['club', id],
	});

	const { register, control, getValues, reset } = useForm({ values: club });

	const formData = new FormData();
	const handleSubmit = async (values: any) => {
		const valuesWithoutPhoto = { ...values };
		delete valuesWithoutPhoto.logo;
		console.log(valuesWithoutPhoto);
		formData.append('jsonData', JSON.stringify(valuesWithoutPhoto));
		formData.append('image', values.logo);
		try {
			const response = await axios.put(
				'https://spring-boot-sokker.onrender.com/api/clubs',
				formData,
			);
			navigate('/club');
			console.log('API response:', response);
		} catch (error) {
			console.error('API error:', error);
		}
	};

	const formik = useFormik({
		initialValues: {
			id,
			nom: '',
			logo: '',
			adresse: '',
			nbre_licencies: '',
			responsableEmail: '',
			telephone: '',
			site_web: '',
			date_fondation: '',
			stade: '',
			code_postal: '',
			ville: '',
			responsableNom: '',
			id_fff: '',
			status: '',
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});
	const [image, setImage] = useState<string>('');
	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			const selectedImage = event.target.files[0];
			console.log(selectedImage);
			formik.setFieldValue('logo', selectedImage); // Store the image file in Formik
			setImage(URL.createObjectURL(selectedImage));
		}
	};

	const [activeTab, setActiveTab] = useState(TABS.SUMMARY);

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);

	useEffect(() => {
		reset(club);
	}, [club]);

	return (
		<PageWrapper>
			<RequestWrapper isLoading={isLoading} errorMessage={error?.message}>
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
							<strong>{getValues('nom')}</strong>
						</span>
						<span className='text-muted'>Club</span>
					</SubHeaderLeft>
				</SubHeader>
				<Page>
					<div className='display-4 fw-bold ' />
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
									<div className='row g-3 '>
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
														formik.values.logo
															? formik.values.logo
															: image
													}`}
													className='rounded'
													style={{
														width: 'fit-content',
														maxWidth: '100%',
													}}
												/>
											)}
										</div>
									</div>
								</CardBody>
								<CardFooter>
									<CardFooterLeft className='w-100 h-50 mb-4'>
										<Button
											icon='Delete'
											color='danger'
											isLight
											className='w-100 p-3'
											onClick={() => {
												getClubDelete(Number(id));
												navigate('/club');
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
							<Card stretch className='overflow-hidden' tag='form' noValidate>
								{activeTab === TABS.SUMMARY && (
									<>
										<CardHeader>
											<CardLabel icon='Description' iconColor='success'>
												<CardTitle>Club Details</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody>
											<div
												className='row g-4 h-75 '
												style={{ marginTop: '-30px' }}>
												<div className='col-md-6'>
													<FormGroup id='nom' label='Nom' isFloating>
														<Input
															id='nom'
															placeholder='Nom.'
															disabled
															{...register('nom')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='responsableNom'
														label='responsableNom'
														isFloating>
														<Input
															id='responsableNom'
															placeholder='Nom.'
															autoComplete='additional-name'
															isValid={formik.isValid}
															disabled
															validFeedback='Looks good!'
															{...register('responsableNom')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='responsableEmail'
														label='E-mail'
														isFloating>
														<Input
															id='responsableEmail'
															placeholder='email'
															type='email'
															disabled
															{...register('responsableEmail')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='site_web'
														label='Site web'
														isFloating>
														<Input
															id='site_web'
															placeholder='site_web'
															autoComplete='additional-name'
															value={formik.values.site_web}
															disabled
															{...register('site_web')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup id='stade' label='Stade' isFloating>
														<Input
															id='stade'
															placeholder='Stade.'
															autoComplete='additional-name'
															disabled
															{...register('stade')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='adresse'
														label='adresse'
														isFloating>
														<Input
															id='adresse'
															placeholder='adresse.'
															autoComplete='additional-name'
															disabled
															{...register('stade')}
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup id='ville' label='ville' isFloating>
														<Input
															id='ville'
															placeholder='Ville.'
															autoComplete='additional-name'
															disabled
															{...register('ville')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='nbre_licencies'
														label='Nombre licencies'
														isFloating>
														<Input
															id='nbre_licencies'
															placeholder='Nbre licencies'
															autoComplete='additional-name'
															defaultValue={0}
															type='number'
															disabled
															{...register('nbre_licencies')}
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
															placeholder='Code postal'
															autoComplete='additional-name'
															defaultValue={0}
															type='number'
															disabled
															{...register('code_postal')}
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
															placeholder='Téléphone'
															autoComplete='tel'
															type='tel'
															disabled
															{...register('telephone')}
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='id_fff'
														label='Identifiant FFF'
														isFloating>
														<Input
															id='id_fff'
															name='id_fff'
															placeholder='Identifiant FFF.'
															autoComplete='additional-name'
															value={formik.values.id_fff}
															disabled
														/>
													</FormGroup>
												</div>

												<div className='col-md-6'>
													<FormGroup
														id='date_fondation'
														label='Date de fondation'
														isFloating>
														<Input
															id='date_fondation'
															name='date_fondation'
															placeholder='Date de fondation'
															autoComplete='additional-name'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.date_fondation}
															type='date'
															disabled
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='status'
														label='status'
														isFloating>
														<Input
															id='status'
															name='status'
															placeholder='status.'
															autoComplete='additional-name'
															value={formik.values.status}
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
													Modification Club
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
											<CardBody>
												<div
													className='row g-4'
													style={{ marginTop: '-50px' }}>
													<div className='col-md-6'>
														<FormGroup id='nom' label='nom' isFloating>
															<Input
																id='nom'
																name='nom'
																placeholder='Nom.'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.nom}
																isValid={formik.isValid}
																validFeedback='Looks good!'
															/>
														</FormGroup>
													</div>

													<div className='col-md-6'>
														<FormGroup
															id='responsableNom'
															label='responsableNom'
															isFloating>
															<Input
																id='responsableNom'
																name='responsableNom'
																placeholder='responsableNom.'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.responsableNom}
															/>
														</FormGroup>
													</div>

													<div className='col-md-6'>
														<FormGroup
															id='responsableEmail'
															label='E-mail'
															isFloating>
															<Input
																id='responsableEmail'
																name='responsableEmail'
																placeholder='email'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={
																	formik.values.responsableEmail
																}
																type='email'
															/>
														</FormGroup>
													</div>

													<div className='col-md-6'>
														<FormGroup
															id='site_web'
															label='Site web'
															isFloating>
															<Input
																id='site_web'
																name='site_web'
																placeholder='site_web'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.site_web}
															/>
														</FormGroup>
													</div>

													<div className='col-md-3'>
														<FormGroup
															id='stade'
															label='Stade'
															isFloating>
															<Input
																id='stade'
																name='stade'
																placeholder='Stade'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.stade}
															/>
														</FormGroup>
													</div>

													<div className='col-md-9'>
														<FormGroup
															id='adresse'
															label='Adresse'
															isFloating>
															<Input
																id='adresse'
																name='adresse'
																placeholder='Date de fondation'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.adresse}
															/>
														</FormGroup>
													</div>

													<div className='col-md-6'>
														<FormGroup
															id='ville'
															label='ville'
															isFloating>
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

													<div className='col-md-6'>
														<FormGroup
															id='telephone'
															label='Téléphone'
															isFloating>
															<Input
																id='telephone'
																name='telephone'
																placeholder='Téléphone'
																autoComplete='tel'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																type='tel'
																value={formik.values.telephone}
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
																placeholder='Code postal'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																defaultValue={0}
																value={formik.values.code_postal}
																type='number'
															/>
														</FormGroup>
													</div>

													<div className='col-md-6'>
														<FormGroup
															id='nbre_licencies'
															label='Nbre licencies'
															isFloating>
															<Input
																id='nbre_licencies'
																placeholder='Nbre licencies'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																defaultValue={0}
																value={formik.values.nbre_licencies}
																type='number'
															/>
														</FormGroup>
													</div>
													<div className='col-md-6'>
														<FormGroup
															id='id_fff'
															label='Identifiant FFF'
															isFloating>
															<Input
																id='id_fff'
																name='id_fff'
																placeholder='Identifiant FFF.'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.id_fff}
															/>
														</FormGroup>
													</div>
													<div className='col-md-6'>
														<FormGroup
															id='date_fondation'
															label='Date de fondationnn'
															isFloating>
															<Input
																id='date_fondation'
																name='date_fondation'
																placeholder='Date de fondation'
																autoComplete='additional-name'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.date_fondation}
																type='date'
															/>
														</FormGroup>
													</div>
													<div className='col-md-6'>
														<FormGroup
															id='status'
															label='status'
															isFloating>
															<Select
																ariaLabel=''
																id='status'
																name='status'
																className='text-capitalize'
																value={formik.values.status}
																onChange={formik.handleChange}>
																<Option value='true'>Actif</Option>
																<Option value='false'>
																	Inactif
																</Option>
															</Select>
														</FormGroup>
													</div>
												</div>
											</CardBody>
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
															formik.values.logo
																? formik.values.logo
																: image
														}`}
														className='rounded'
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
							<Button color='success' className='w-100' onClick={formik.handleSubmit}>
								Update
							</Button>
						</ModalFooter>
					</Modal>
				</Page>
			</RequestWrapper>
			<DevTool control={control} />
		</PageWrapper>
	);
};

export default ProductViewPage;
