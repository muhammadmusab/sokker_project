import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useTourStep from '../../../hooks/useTourStep';
import { deleteListItem, getListData } from '../../../requests';
import { Cluub, GetData } from '../../../types';
import { RequestWrapper } from '../../../layout/PageWrapper/RequestWrapper';
import ListCard from '../../../components/cards/ListCard';
import ListTable from '../../../components/tables/ListTable';
import RowTable from '../../../components/tables/RowTable';
import PaginationButtons from '../../../components/PaginationButtons';
import { formatDataList } from '../../../helpers/helpers';
import { TableAction } from '../../presentation/project-management/type/types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ListClub = () => {
	const queryClient = useQueryClient();
	const endPoint = 'clubs';
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const {
		data: clubs,
		isLoading,
		error,
	} = useQuery<GetData<Cluub>, AxiosError>({
		queryKey: [endPoint, { page: currentPage }],
		queryFn: () => getListData({ endPoint, currentPage }),
		refetchOnWindowFocus: false,
	});
	const { mutateAsync: deleteClub, isLoading: isLoadingDelete } = useMutation(
		(id: number | string) => deleteListItem({ endPoint, id }),
	);

	useTourStep(6);
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
					deleteClub(id)
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

	const headerData = [
		'#',
		'Logo',
		'Nom',
		'Ville',
		'Responsable',
		'Nbre de licenciés',
		'Identifiant FFF',
		'Statut',
		'Actions',
	];
	const dataKeyToDisplay = [
		'id',
		'logo',
		'nom',
		'ville',
		'responsableNom',
		'nbre_licencies',
		'id_fff',
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
					totalPages={clubs?.totalPages ?? 0}
				/>
			}
			cardTitle={'Gestion des Clubs'}
			actions={tableActions}>
			<ListTable headerData={headerData}>
				{
					<RequestWrapper
						dataIsEmpty={clubs?.content?.length === 0}
						errorMessage={error?.message}
						isLoading={isLoading}>
						<>
							{formatDataList<Cluub>(clubs, dataKeyToDisplay, 'id')?.map((item) => (
								<RowTable actions={rowActions} key={item[0].value} dataRow={item} />
							))}
						</>
					</RequestWrapper>
				}
			</ListTable>
		</ListCard>
	);
};

export default ListClub;
