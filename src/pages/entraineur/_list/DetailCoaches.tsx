import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { getUserDataWithId } from '../../../common/data/userDummyData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/icon/Icon';
import { demoPagesMenu } from '../../../menu';
import Badge from '../../../components/bootstrap/Badge';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Chart, { IChartOptions } from '../../../components/extras/Chart';
import dummyEventsData from '../../../common/data/dummyEventsData';
import { priceFormat } from '../../../helpers/helpers';
import EVENT_STATUS from '../../../common/data/enumEventStatus';
import Alert from '../../../components/bootstrap/Alert';
import CommonAvatarTeam from '../../../common/other/CommonAvatarTeam';
import COLORS from '../../../common/data/enumColors';
import useDarkMode from '../../../hooks/useDarkMode';
import useTourStep from '../../../hooks/useTourStep';
import { getCoache } from '../../../requests';
import { coach } from '../../../types';
import logo from '../../../assets/img/wanna/ancceloti.webp';

const DetailCoaches = () => {
	useTourStep(19);
	const { darkModeStatus } = useDarkMode();
	const [coache, setCoache] = useState<coach>();
	const { id } = useParams();
	const data = getUserDataWithId(id);

	const [dayHours] = useState<IChartOptions>({
		series: [
			{
				data: [8, 12, 15, 20, 15, 22, 9],
			},
		],
		options: {
			colors: [import.meta.env.VITE_REACT_APP_SUCCESS_COLOR],
			chart: {
				type: 'radar',
				width: 200,
				height: 200,
				sparkline: {
					enabled: true,
				},
			},
			xaxis: {
				categories: [
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
					'Sunday',
				],
				// convertedCatToNumeric: false,
			},
			tooltip: {
				theme: 'dark',
				fixed: {
					enabled: false,
				},
				x: {
					show: true,
				},
				y: {
					title: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						formatter(seriesName) {
							return 'Hours';
						},
					},
				},
			},
			stroke: {
				curve: 'smooth',
				width: 2,
			},
			plotOptions: {
				radar: {
					polygons: {
						strokeColors: `${COLORS.SUCCESS.code}50`,
						strokeWidth: '1',
						connectorColors: `${COLORS.SUCCESS.code}50`,
					},
				},
			},
		},
	});
	useEffect(() => {
		getCoache(Number(id))
			.then((res) => {
				console.log(res);
				setCoache(res);
			})
			.catch((err) => console.log(err));
	}, [id]);

	const userTasks = dummyEventsData.filter((f) => f.assigned.username === data.username);

	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{coache ? (
				<PageWrapper title={`${coache.nom} ${coache.prenom}`}>
					{/* <SubHeader>
						<SubHeaderLeft>
							<SubheaderSeparator />
						</SubHeaderLeft>
					</SubHeader> */}
					<Page className='pt-0'>
						<div className=' d-flex align-items-center'>
							<Button
								color='warning'
								isLink
								icon='ArrowBack'
								tag='a'
								to='/entraineurs'>
								Back to List
							</Button>
						</div>
						<div className='row'>
							<div className='col-lg-4'>
								<Card className='shadow-3d-warning'>
									<CardBody>
										<div className='d-flex justify-content-end '>
											<Button
												icon='Edit'
												color='warning'
												isLight
												hoverShadow='sm'
												tag='a'
												to={`/entraineur/modifier/${coache.id}`}
												aria-label='Modifier'
											/>
										</div>
										<div className='row g-5'>
											<div className='col-12 d-flex justify-content-center'>
												<img src={coache.photo} width={100} />
											</div>
											<div className='col-12'>
												<div className='row g-2'>
													<div className='col-12'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Portrait'
																	size='3x'
																	color='warning'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{coache.nom}
																	{coache.prenom}
																</div>
																<div className='text-muted'>
																	Nom et prenom
																</div>
															</div>
														</div>
													</div>
													<div className='col-12'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Mail'
																	size='3x'
																	color='warning'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{coache.email}
																</div>
																<div className='text-muted'>
																	Email Address
																</div>
															</div>
														</div>
													</div>
													<div className='col-12'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='phone'
																	size='3x'
																	color='warning'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{coache.telephone}
																</div>
																<div className='text-muted'>
																	numéro de telephone
																</div>
															</div>
														</div>
													</div>
													<div className='col-12'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Tag'
																	size='3x'
																	color='warning'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{`@${coache.nom}${coache.prenom}`}
																</div>
																<div className='text-muted'>
																	Social name
																</div>
															</div>
														</div>
													</div>
													<div className='col-12'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='CalendarToday'
																	size='3x'
																	color='warning'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{
																		coache.date_naissance.split(
																			'T',
																		)[0]
																	}
																</div>
																<div className='text-muted text-capitalize'>
																	date de naissance
																</div>
															</div>
														</div>
													</div>
													<div className='col-12'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='info'
																	size='3x'
																	color='warning'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{coache.status
																		? 'actif'
																		: 'indisponible'}
																</div>
																<div className='text-muted text-capitalize'>
																	status
																</div>
															</div>
														</div>
													</div>
													<div className='col-12 text-end'>
														<Button className='text-uppercase bg-warning text-white p-3'>
															DOWNLOAD CV
														</Button>
													</div>
												</div>
											</div>
										</div>
									</CardBody>
								</Card>
								<Card>
									<CardHeader>
										<CardLabel icon='Stream' iconColor='warning'>
											<CardTitle tag='div' className='h5 text-capitalize'>
												équipes
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										{coache.equipes ? (
											<div className='row g-2'>
												{coache.equipes.map((equipe) => (
													<div key={equipe.nom} className='col-auto'>
														<Badge isLight className='px-3 py-2'>
															{equipe.nom}
														</Badge>
													</div>
												))}
											</div>
										) : (
											<div className='row'>
												<div className='col'>
													<Alert
														color='warning'
														isLight
														icon='Report'
														className='mb-0'>
														No results to show
													</Alert>
												</div>
											</div>
										)}
									</CardBody>
								</Card>
							</div>
							<div className='col-lg-8'>
								<Card>
									<CardHeader>
										<CardLabel icon='description' iconColor='warning'>
											<CardTitle>
												<CardLabel tag='div' className='h5'>
													biographie
												</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<p>{coache.biographie}</p>
									</CardBody>
								</Card>
								<Card>
									<CardHeader>
										<CardLabel icon='description' iconColor='warning'>
											<CardTitle>
												<CardLabel tag='div' className='h5'>
													certification
												</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<p>{coache.certification}</p>
									</CardBody>
								</Card>
							</div>
						</div>
					</Page>
				</PageWrapper>
			) : (
				''
			)}
		</>
	);
};

export default DetailCoaches;
