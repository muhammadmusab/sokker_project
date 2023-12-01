import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
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
import { addCoach, getCoache } from '../../../requests';
import WizardCoach from '../../../components/WizardCoach';

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

const FormCoachesEdit = () => {
	const navigate = useNavigate();

	const { id } = useParams();

	const TABS = {
		ACCOUNT_DETAIL: 'Informations Details',
		PASSWORD: 'Password',
	};
	const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
	const [coach, setCoach] = useState<any>();
	const handleSubmit = async (values: any) => {
		try {
			await addCoach(values);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span className='text-capitalize'>Entraineur ajouter avec succés</span>
				</span>,
				'',
				'success',
			);
		} catch (error) {
			console.error('Error adding coach:', error);
		}
	};

	const formik = useFormik({
		initialValues: {
			nom: '',
			prenom: '',
			username: '',
			date_naissance: '',
			email: '',
			gender: '',
			photo: '',
			telephone: '',
			biographie: '',
			certification: '',
			adresse: '',
			ville: '',
			nomRole: 'Entraîneur',
			state: '',
			code_postal: '',
			password: '',
			confirmPassword: '',
			emailNotification: ['2'],
			pushNotification: ['1', '2', '3'],
		},
		// validate,
		onSubmit: (values) => {
			// handleSubmit(values);
			alert(JSON.stringify(values));
			navigate('/entraineurs');
		},
	});
	useEffect(() => {
		getCoache(Number(id))
			.then((res) => {
				setCoach(res);
				formik.setValues({
					...formik.values,
					nom: res.nom,
					prenom: res.prenom,
					gender: res.gender,
					date_naissance: res.date_naissance.split('T')[0],
					biographie: res.biographie,
					certification: res.certification,
					telephone: res.telephone,
					email: res.email,
					adresse: res.adresse,
					ville: res.ville,
					code_postal: res.code_postal,
				});
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editWizard.text}>
			<Page className='pt-0'>
				<h1 className='text-capitalize'>modifier entraineur</h1>
				<div className='row  pb-3' style={{ height: '100vh' }}>
					<div className='col-12'>
						{TABS.ACCOUNT_DETAIL === activeTab && (
							<WizardCoach
								isHeader
								stretch
								color='warning'
								noValidate
								onSubmit={formik.handleSubmit}
								className='shadow-3d-warning'>
								<WizardItem id='step1' title='Account Detail'>
									<Card>
										<CardHeader>
											<CardLabel icon='Edit' iconColor='warning'>
												<CardTitle>Personal Information</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pt-0'>
											<div className='row'>
												<div className='col-6 d-flex align-items-center'>
													<div className='row g-4 align-items-center'>
														<div className='col-12 text-center'>
															<img
																src='https://firebasestorage.googleapis.com/v0/b/whatsapp-befd6.appspot.com/o/pep.webp?alt=media&token=318c7738-4292-4901-875d-5039721d3503'
																width={200}
															/>
														</div>
														<div className='col-12'>
															<div className='row g-4 justify-content-center'>
																<div className='col-auto'>
																	<Input
																		id='photo'
																		name='photo'
																		type='file'
																		onChange={(event: any) => {
																			formik.setFieldValue(
																				'photo',
																				event.currentTarget
																					.files[0],
																			);
																		}}
																	/>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className='col-6'>
													<div className='row g-4'>
														<div className='col-md-6'>
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
																	invalidFeedback={
																		formik.errors.nom
																	}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
														</div>
														<div className='col-md-6'>
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
																	isTouched={
																		formik.touched.prenom
																	}
																	invalidFeedback={
																		formik.errors.prenom
																	}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
														</div>
														{/* <div className='col-md-6'>
													<FormGroup
														id='username'
														className='text-capitalize'
														label="nom d'utilisateur"
														isFloating
														formText='This will be how your name will be displayed in the account section and in reviews'>
														<Input
															placeholder="nom d'utilisateur"
															autoComplete='username'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.username}
															isValid={formik.isValid}
															isTouched={formik.touched.username}
															invalidFeedback={formik.errors.username}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div> */}
														<div className='col-md-6'>
															<FormGroup
																id='gender'
																className='text-capitalize'
																label='gender'
																isFloating>
																<Select
																	ariaLabel=''
																	className='text-capitalize'
																	onChange={formik.handleChange}
																	value={formik.values.gender}>
																	<Option value='masculin'>
																		masculin
																	</Option>
																	<Option value='masculin'>
																		féminin
																	</Option>
																</Select>
															</FormGroup>
														</div>
														<div className='col-md-6'>
															<FormGroup
																id='date_naissance'
																className='text-capitalize'
																label='date de naissance'
																isFloating>
																<Input
																	type='date'
																	onChange={formik.handleChange}
																	value={
																		formik.values.date_naissance
																	}
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
																isTouched={
																	formik.touched.biographie
																}
															/>
														</FormGroup>
													</div>
													<div className='col-12 mt-4'>
														<FormGroup
															id='certification'
															label='Certification'
															isFloating>
															<Textarea
																style={{ minHeight: '150px' }}
																placeholder='Certification'
																autoComplete='certification'
																onChange={formik.handleChange}
																value={formik.values.certification}
																isTouched={
																	formik.touched.certification
																}
															/>
														</FormGroup>
													</div>
												</div>
											</div>
										</CardBody>
									</Card>

									<Card className='mb-0'>
										<CardHeader>
											<CardLabel icon='MarkunreadMailbox' iconColor='warning'>
												<CardTitle>Contact Information</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-12'>
													<FormGroup
														id='telephone'
														label='Phone Number'
														isFloating>
														<Input
															placeholder='Phone Number'
															type='tel'
															autoComplete='tel'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.telephone}
															isValid={formik.isValid}
															isTouched={formik.touched.telephone}
															invalidFeedback={
																formik.errors.telephone
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												<div className='col-12'>
													<FormGroup
														id='email'
														label='Email address'
														isFloating>
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
												<div className='row g-4 mt-0'>
													<div className='col-lg-12'>
														<FormGroup
															id='adresse'
															label='Address Line'
															isFloating>
															<Input
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.adresse}
																isValid={formik.isValid}
																isTouched={formik.touched.adresse}
																invalidFeedback={
																	formik.errors.adresse
																}
																validFeedback='Looks good!'
															/>
														</FormGroup>
													</div>
													<div className='col-md-6'>
														<FormGroup
															id='code_postal'
															label='code_postal'
															isFloating>
															<Input
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.code_postal}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.code_postal
																}
																invalidFeedback={
																	formik.errors.code_postal
																}
															/>
														</FormGroup>
													</div>
													<div className='col-lg-6'>
														<FormGroup
															id='ville'
															label='ville'
															isFloating>
															<Input
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.ville}
																isValid={formik.isValid}
																isTouched={formik.touched.ville}
																invalidFeedback={
																	formik.errors.ville
																}
																validFeedback='Looks good!'
															/>
														</FormGroup>
													</div>
												</div>
											</div>
										</CardBody>
									</Card>

									{/* <Card
										stretch
										tag='form'
										noValidate
										className='mb-0 mt-4'
										onSubmit={formik.handleSubmit}>
										<CardHeader>
											<CardLabel icon='LocalPolice' iconColor='info'>
												<CardTitle>{TABS.PASSWORD}</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pb-0' isScrollable>
											<div className='row g-4 pb-4'>
												<div className='col-6'>
													<FormGroup
														id='password'
														label='New password'
														isFloating>
														<Input
															type='password'
															placeholder='New password'
															autoComplete='new-password'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.password}
															isValid={formik.isValid}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												<div className='col-6'>
													<FormGroup
														id='confirmPassword'
														label='Confirm new password'
														isFloating>
														<Input
															id='confirmPassword'
															name='confirmPassword'
															type='password'
															placeholder='Confirm new password'
															autoComplete='new-password'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															isValid={formik.isValid}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
											</div>
										</CardBody>
									</Card> */}
								</WizardItem>

								<WizardItem
									id='step2'
									title='Preview'
									style={{ minHeight: 'fit-content' }}>
									<div className='row g-3'>
										<div className='col-9 offset-3'>
											<h3 className='mt-4'>Entraineur Detail</h3>
											<h4 className='mt-4'>Personal Information</h4>
										</div>
										<PreviewItem title='Nom' value={formik.values.nom} />
										<PreviewItem title='Prenom' value={formik.values.prenom} />
										<PreviewItem title='Gendre' value={formik.values.gender} />
										<PreviewItem
											title='Date de naissance'
											value={formik.values.date_naissance}
										/>
										<div className='col-9 offset-3'>
											<h4 className='mt-4'>Contact Information</h4>
										</div>
										<PreviewItem
											title='Numero de telephone'
											value={formik.values.telephone}
										/>
										<PreviewItem title='Email' value={formik.values.email} />
										<PreviewItem
											title='Biographie'
											value={formik.values.biographie}
										/>
										<div className='col-9 offset-3'>
											<h3 className='mt-4'>Address</h3>
										</div>
										<PreviewItem
											title='Address Line'
											value={formik.values.adresse}
										/>

										<PreviewItem title='ville' value={formik.values.ville} />
										{/* <PreviewItem title='State' value={formik.values.state} /> */}
										<PreviewItem
											title='code_postal'
											value={formik.values.code_postal}
										/>
									</div>
								</WizardItem>
							</WizardCoach>
						)}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default FormCoachesEdit;
