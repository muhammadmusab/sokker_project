import React, { ReactElement, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../menu';

import useTourStep from '../../hooks/useTourStep';
import Card, {
	CardActions,
	CardBody,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../bootstrap/Card';
import Button from '../bootstrap/Button';
import Dropdown, { DropdownMenu, DropdownToggle } from '../bootstrap/Dropdown';
import FormGroup from '../bootstrap/forms/FormGroup';
import Page from '../../layout/Page/Page';
import Label from '../bootstrap/forms/Label';
import Input from '../bootstrap/forms/Input';
import { TColor } from '../../type/color-type';
import { TableAction } from '../../pages/presentation/project-management/type/types';

type ListCardProps = {
	cardTitle: string;
	iconName: string;
	actions?: TableAction[];
	children: ReactElement;
	cardFooter: ReactElement;
};

const ListCard = ({ actions, cardTitle, iconName, children, cardFooter }: ListCardProps) => {
	const [filterMenu, setFilterMenu] = useState<boolean>(false);

	useTourStep(6);

	return (
		<PageWrapper title={demoPagesMenu.listPages.subMenu.listBoxed.text}>
			<Page>
				<Card stretch data-tour='list'>
					<CardHeader>
						<CardLabel icon={iconName} iconColor='info'>
							<CardTitle tag='div' className='h5'>
								{cardTitle}
							</CardTitle>
						</CardLabel>
						<CardActions>
							{actions?.map(({ btnIconName, btnTitle, onClick, disable = false }) => {
								return (
									<Button
										key={btnTitle}
										color='warning'
										icon={btnIconName}
										onClick={onClick}
										isDisable={disable}>
										{btnTitle}
									</Button>
								);
							})}

							<Dropdown
								isOpen={filterMenu}
								setIsOpen={setFilterMenu}
								className='d-inline-block'>
								<DropdownToggle hasIcon={false}>
									<Button icon='Filter' color='warning' data-tour='filter'>
										Filter
									</Button>
								</DropdownToggle>
								<DropdownMenu
									isAlignmentEnd
									size='lg'
									isCloseAfterLeave={false}
									data-tour='filter-menu'>
									<div className='container py-2'>
										<form className='row g-3'>
											<div className='col-12'>
												<FormGroup>
													<Label htmlFor='nom_club'>Nom</Label>
													<Input
														id='nom'
														placeholder='Nom.'
														name='nom_club'
														ariaLabel='Nom'
													/>
												</FormGroup>
											</div>

											<div className='col-12'>
												<FormGroup>
													<Label htmlFor='ville_club'>Ville</Label>
													<Input
														id='ville'
														ariaLabel='Ville'
														placeholder='Ville.'
														name='ville_club'
													/>
												</FormGroup>
											</div>

											<div className='col-6'>
												<Button color='primary' isOutline className='w-100'>
													Reset
												</Button>
											</div>
											<div className='col-6'>
												<Button color='primary' className='w-100'>
													Filter
												</Button>
											</div>
										</form>
									</div>
								</DropdownMenu>
							</Dropdown>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive overflow-y-auto max-vh-100' isScrollable>
						{children}
					</CardBody>
					<CardFooterRight className='flex '>{cardFooter}</CardFooterRight>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export default ListCard;
