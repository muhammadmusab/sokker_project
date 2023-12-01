// /* eslint-disable jsx-a11y/control-has-associated-label */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetData, Player_type, equipe } from '../../../types';
import { AxiosError } from 'axios';
import { deleteListItem, getListData } from '../../../requests';
import useTourStep from '../../../hooks/useTourStep';
import ListCard from '../../../components/cards/ListCard';
import PaginationButtons from '../../../components/PaginationButtons';
import ListTable from '../../../components/tables/ListTable';
import RequestWrapper from '../../../layout/PageWrapper/RequestWrapper';
import RowTable from '../../../components/tables/RowTable';
import { formatDataList } from '../../../helpers/helpers';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { TableAction } from '../../presentation/project-management/type/types';
import toast from 'react-hot-toast';

export const ListTeam = () => {
	const queryClient = useQueryClient();
	const endPoint = 'joueurs';
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const {
		data: teams,
		isLoading,
		error,
	} = useQuery<GetData<Player_type>, AxiosError>({
		queryKey: [endPoint, { page: currentPage }],
		queryFn: () => getListData({ endPoint, currentPage }),
	});
	const { mutateAsync: deletePalyer, isLoading: isLoadingDelete } = useMutation(
		(id: number | string) => deleteListItem({ endPoint, id }),
	);

	const tableActions = [
		{
			btnIconName: 'Add',
			btnTitle: 'Ajouter',
			onClick: () => {
				navigate(`/${endPoint}/ajouter`);
			},
		},
	];
	const rowActions: TableAction[] = [
		{
			btnIconName: 'Edit',
			btnTitle: 'Modifier',
			onClick: (id) => {
				navigate(`/${endPoint}/modifier/${id}`);
			},
		},
		{
			btnIconName: 'Delete',
			btnTitle: isLoadingDelete ? 'Chargement...' : 'Delete',
			onClick: async (id) => {
				if (id)
					deletePalyer(id)
						.then(() => {
							queryClient.invalidateQueries({
								queryKey: [endPoint, { page: currentPage }],
							});
							toast.success('Club supprimé avec succès!');
						})
						.catch((error) => {
							toast.error(error.message);
						});
			},
			disable: isLoading,
		},
	];

	useTourStep(6);

	const headerData = [
		'#',
		'Photo',
		'Nom',
		'Genre',
		'Equipe',
		'Post',
		'Age',
		'VMA',
		'Niveau',
		'Statut',
		'Actions',
	];
	const dataKeyToDisplay = [
		'id',
		'photo',
		'nom',
		'gender',
		'club',
		'poste',
		'age',
		'vma',
		'niveau',
		'status',
	];

	return (
		<ListCard
			iconName='people'
			cardFooter={
				<PaginationButtons
					label='items'
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					totalPages={teams?.totalPages ?? 0}
				/>
			}
			cardTitle={'Gestion des Joueurs'}
			actions={tableActions}>
			<ListTable headerData={headerData}>
				{
					<RequestWrapper
						dataIsEmpty={teams?.content?.length === 0}
						errorMessage={error?.message}
						isLoading={isLoading}>
						<>
							{formatDataList<Player_type>(teams, dataKeyToDisplay, 'id')?.map(
								(item) => (
									<RowTable
										actions={rowActions}
										key={item[0].value}
										dataRow={item}
									/>
								),
							)}
						</>
					</RequestWrapper>
				}
			</ListTable>
		</ListCard>
	);
};

export default ListTeam;
