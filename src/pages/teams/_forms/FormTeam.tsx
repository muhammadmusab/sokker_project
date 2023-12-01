import React, { useEffect, useReducer, useState } from 'react';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { TeamMenuAdmin, demoPagesMenu } from '../../../menu';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Avatar from '../../../components/Avatar';
import Spinner from '../../../components/bootstrap/Spinner';
import USERS from '../../../common/data/userDummyData';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';

import Select from '../../../components/bootstrap/forms/Select';

import { addEquipe, getCoaches, getPlayer } from '../../../requests';
import PaginationButtons, {
	PER_COUNT,
	dataPagination,
} from '../../../components/PaginationButtons';
import useSortableData, { useSortableDataCoach } from '../../../hooks/useSortableData';
import useSelectTable from '../../../hooks/useSelectTable';
import data from '../../../common/data/dummyProductData';
import { CoachTableRow, PlayeTableRow } from '../../_common/CommonTableRow';
import Option from '../../../components/bootstrap/Option';

const FormTeam = () => {
	const navigate = useNavigate();
	// list

	const [joueurs, setJoueurs] = useState<any | undefined>(undefined);
	const [entraineur, setEntraineur] = useState<any | undefined>(undefined);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);
	const filteredData = data.filter((f) => f);
	const { items, requestSort, getClassNamesFor } = useSortableData(joueurs || filteredData);
	const onCurrentPageItems = dataPagination(items, currentPage, perPage);
	const { selectJoueur, SelectAllCheckJoueur } = useSelectTable(onCurrentPageItems);
	const { items1, requestSortCoach, getClassNamesForCoach } = useSortableDataCoach(
		entraineur || filteredData,
	);
	const onCurrentPageCoach = dataPagination(items1, currentPage, perPage);
	const { selectCoach, SelectAllCheckCoach } = useSelectTable(onCurrentPageCoach);
	const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');

	useEffect(() => {
		getPlayer()
			.then((res) => setJoueurs(res))
			.catch((err) => console.log(err));

		getCoaches()
			.then((res) => setEntraineur(res))
			.catch((err) => console.log(err));
	}, []);

	/**
	 * Common
	 */

	const handleSave = async (values: any) => {
		try {
			await addEquipe(values);
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
	// const formik = useFormik({
	// 	initialValues: {
	// 		nom: '',
	// 		genre: 'masculin',
	// 		categorieAge: 'Moins de 7 ans',
	// 		avatar: null,
	// 		nbr_joueur: 1,
	// 		nbrJoueurs: 1,
	// 		joueur_ids: [],
	// 		coach_ids: [],
	// 	},
	// 	onSubmit: (values) => {
	// 		setIsLoading(true);
	// 		setTimeout(() => {
	// 			handleSave(values);
	// 		}, 2000);
	// 	},
	// });
	const formik = useFormik({
		initialValues: {
			nom: '',
			genre: 'Masculin',
			categorieAge: 'Moins de 7 ans',
			avatar: null,
			nbrJoueurs: null,
			joueur_ids: [] as number[],
			coach_ids: [] as number[],
			status: true,
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: (values) => {
			setIsLoading(true);
			const joueurIds = selectJoueur.values.selectedList.map((id) => parseInt(id, 10));
			const coachIds = selectCoach.values.selectedList.map((id) => parseInt(id, 10));
			values.joueur_ids = joueurIds;
			values.coach_ids = coachIds;
			handleSave(values);
		},
	});

	const categorie = [
		{ id: 'U7', text: 'Moins de 7 ans' },
		{ id: 'U9', text: 'Moins de 9 ans' },
		{ id: 'U11', text: 'Moins de 11 ans' },
		{ id: 'U13', text: 'Moins de 13 ans' },
		{ id: 'U15', text: 'Moins de 15 ans' },
		{ id: 'U17', text: 'Moins de 17 ans' },
		{ id: 'U19', text: 'Moins de 19 ans' },
		{ id: 'Séniors', text: '20 ans et plus' },
	];
	const onImageChange = (event: any) => {
		if (event.target.files && event.target.files[0]) {
			setImage(URL.createObjectURL(event.target.files[0]));
		}
	};
	return (
		<PageWrapper>
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
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'Saving') || 'Publishing'
							: (lastSave && 'Save') || 'Publish'}
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<Card className=' col-lg-8'>
					<CardBody>
						<div className='col-12'>
							<div className='row g-4 align-items-center'>
								<div className='col-lg-auto'>
									<Avatar
										src='https://firebasestorage.googleapis.com/v0/b/whatsapp-befd6.appspot.com/o/Paris_Saint-Germain_Logo.svg.png?alt=media&token=66395679-1918-4be6-a63a-80ad3a17dbb8'
										rounded={3}
									/>
								</div>
								<div className='col-lg'>
									<div className='row g-4'>
										<div className='col-auto'>
											<Input
												type='file'
												autoComplete='photo'
												onChange={onImageChange}
												ariaLabel='Upload image file'
											/>
										</div>
										<div className='col-auto'>
											<Button
												color='dark'
												isLight
												icon='Delete'
												onClick={() => setImage('')}>
												Delete Avatar
											</Button>
										</div>
										<div className='col-12'>
											<p className='lead text-muted'>
												Avatar helps your teammates get to know you.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
				<Card>
					<CardHeader>
						<CardLabel icon='Person' iconColor='success'>
							<CardTitle tag='div' className='h5 text-capitalize'>
								équipe Information
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody>
						<div className='row g-4'>
							<div className='col-md-6'>
								<FormGroup id='nom' label="Nom de l'équipe" isFloating>
									<Input
										placeholder="Nom de l'équipe"
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
								<FormGroup id='genre' label='Genre' isFloating>
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
							<div className='col-12'>
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
										defaultValue={formik.values.categorieAge}
										onChange={formik.handleChange}>
										{categorie.map((element) => (
											<Option value={element.text} key={element.id}>
												{element.text}
											</Option>
										))}
									</Select>
								</FormGroup>
							</div>
							<div className='col-md-6'>
								<FormGroup id='nbrJoueurs' label="nombre de joueur" isFloating>
									<Input
										placeholder="nombre de joueur"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.nbrJoueurs}
										isValid={formik.isValid}
										isTouched={formik.touched.nbrJoueurs}
										invalidFeedback={formik.errors.nbrJoueurs}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>
							{/* nombre de joueur */}
							{/* <div className='col-12'>
										<FormGroup
											id='lastName'
											label='nombre de joueur'
											className='text-capitalize'
											isFloating>
											<Input
												type='number'
												name='nbr_joueur'
												onChange={formik.handleChange}
												min={5}
												value={formik.values.nbr_joueur}></Input>
										</FormGroup>
									</div> */}
						</div>
					</CardBody>
				</Card>
				{joueurs || entraineur ? (
					<>
						{/* entraineur table */}
						<Card stretch data-tour='list' style={{ minHeight: '700px' }}>
							<CardHeader>
								<CardLabel icon='person' iconColor='info'>
									<CardTitle tag='div' className='h5'>
										Entraineurs
									</CardTitle>
								</CardLabel>
								{/* <CardActions>
									<div className='d-flex'>
										<label
											className='border-0 bg-transparent cursor-pointer me-0'
											htmlFor='searchInput'>
											<Icon icon='Search' size='2x' color='primary' />
										</label>
										<Input
											id='searchInput'
											type='search'
											className='border-0 shadow-none bg-transparent'
											placeholder='Search...'
											onChange={formik.handleChange}
											// value={formik.values.searchInput}
										/>
									</div>
								</CardActions> */}
							</CardHeader>
							<CardBody className='table-responsive' isScrollable>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th>select</th>
											<th
												scope='col'
												// onClick={() => requestSort('id')}
												className='cursor-pointer'>
												#
											</th>
											<th scope='col'>Image</th>
											<th scope='col'>Nom</th>
											<th scope='col'>Prenom</th>
											<th scope='col'>status</th>
										</tr>
									</thead>
									<tbody>
										{onCurrentPageCoach.map((i, index) => (
											<CoachTableRow
												key={i.id}
												// eslint-disable-next-line react/jsx-props-no-spreading
												{...i}
												selectName='selectedList'
												selectOnChange={selectCoach.handleChange}
												selectChecked={selectCoach.values.selectedList.includes(
													// @ts-ignore
													i.id.toString(),
												)}
												rowNumber={index + 1}
											/>
										))}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={items}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
						{/* joueur table */}
						{/* <Card
							stretch
							data-tour='list'
							style={{ maxHeight: '700px', minHeight: '500px' }}>
							<CardHeader>
								<CardLabel icon='person' iconColor='info'>
									<CardTitle tag='div' className='h5 text-capitalize'>
										joueurs
									</CardTitle>
								</CardLabel>
								<CardActions>
									<div className='d-flex'>
										<label
											className='border-0 bg-transparent cursor-pointer me-0'
											htmlFor='searchInput'>
											<Icon icon='Search' size='2x' color='primary' />
										</label>
										<Input
											id='searchInput'
											type='search'
											className='border-0 shadow-none bg-transparent'
											placeholder='Search...'
											onChange={formik.handleChange}
											// value={formik.values.searchInput}
										/>
									</div>
								</CardActions>
							</CardHeader>
							<CardBody className='table-responsive' isScrollable>
								<table className='table table-modern table-hover '>
									<thead>
										<tr>
											
											<th>Select</th>
											<th
												scope='col'
												// onClick={() => requestSort('id')}
												className='cursor-pointer '>
												#
												
											</th>
											<th scope='col'>Image</th>
											<th scope='col'>Nom</th>
											<th scope='col'>Prenom</th>
											<th scope='col'>Genre</th>
											<th scope='col'>Post</th>
											<th scope='col'>Age</th>
											<th scope='col'>Statut</th>
										</tr>
									</thead>
									<tbody className=''>
										{onCurrentPageItems.map((i, index) => (
											<PlayeTableRow
												key={i.id}
												// eslint-disable-next-line react/jsx-props-no-spreading
												{...i}
												selectName='selectedList'
												selectOnChange={selectJoueur.handleChange}
												selectChecked={selectJoueur.values.selectedList.includes(
													// @ts-ignore
													i.id.toString(),
												)}
												rowNumber={index + 1}
											/>
										))}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={items}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card> */}
					</>
				) : (
					<div
						className='d-flex justify-content-center align-items-center'
						style={{ height: '100vh' }}>
						<div className='spinner-border text-primary' role='status'>
							<span className='visually-hidden'>Loading...</span>
						</div>
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};

export default FormTeam;
