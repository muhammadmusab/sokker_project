import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import { clubMenuAdmin } from '../../../menu';
import { Cluub } from '../../../types';
import useDarkMode from '../../../hooks/useDarkMode';

type RowClub = {
	club: Cluub;
};

export const RowClub = ({ club }: RowClub) => {
	const { themeStatus } = useDarkMode();
	const navigate = useNavigate();

	const {
		id,
		logo,
		nom,
		ville,
		responsableNom,
		nbre_licencies: nbreLicencies,
		id_fff: idFFF,
		status,
	} = club;
	const navigateToDetails = () => {
		navigate(`/club/details/${id}`);
	};
	return (
		<tr className='cursor-pointer' key={id}>
			<td>{id}</td>
			<td onClick={navigateToDetails}>
				<img
					src={`data:image/png;base64,${logo || ''}`}
					className='rounded'
					width='69'
					height='69'
					alt='logo-club'
				/>
			</td>
			<td onClick={navigateToDetails}>{nom}</td>
			<td onClick={navigateToDetails}>{ville}</td>
			<td onClick={navigateToDetails}>{responsableNom}</td>
			<td onClick={navigateToDetails}>{nbreLicencies}</td>
			<td onClick={navigateToDetails}>{idFFF}</td>
			<td onClick={navigateToDetails}>{status === true ? 'Active' : 'Inactive'}</td>
			<td className='text-center'>
				<Dropdown className='d-inline'>
					<DropdownToggle hasIcon={false}>
						<Button
							type='button'
							onClick={(e) => {
								console.log(e);
							}}
							color={themeStatus}
							icon='MoreHoriz'
							aria-label='Actions'
						/>
					</DropdownToggle>

					<DropdownMenu isAlignmentEnd className='me-5'>
						<DropdownItem>
							<Button
								icon='Edit'
								onClick={() =>
									navigate(
										`../${clubMenuAdmin.listPages.subMenu.editClub.path}/${id}`,
									)
								}>
								Modifier
							</Button>
						</DropdownItem>
						<DropdownItem>
							<Button icon='Delete' onClick={() => {}}>
								Supprimer
							</Button>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</td>
		</tr>
	);
};

export default RowClub;
