// /* eslint-disable jsx-a11y/control-has-associated-label */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetData, coach } from '../../../types';
import { AxiosError } from 'axios';
import { deleteListItem, getListData } from '../../../requests';
import useTourStep from '../../../hooks/useTourStep';
import ListCard from '../../../components/cards/ListCard';
import PaginationButtons from '../../../components/PaginationButtons';
import RequestWrapper from '../../../layout/PageWrapper/RequestWrapper';
import { useState } from 'react';
import UserContact from '../../../components/UserContact';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ListCoach = () => {
	const queryClient = useQueryClient();
	const endPoint = 'entraineurs';
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();
	const {
		data: coaches,
		isLoading,
		error,
	} = useQuery<GetData<coach>, AxiosError>({
		queryKey: ['coaches', { page: currentPage }],
		queryFn: () => getListData({ endPoint, currentPage }),
	});
	const { mutateAsync: deleteCoach, isLoading: isLoadingDelete } = useMutation(
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

	return (
		<ListCard
			iconName='people'
			cardFooter={
				<PaginationButtons
					label='items'
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					totalPages={coaches?.totalPages ?? 0}
				/>
			}
			cardTitle={'Gestion des Entraineurs'}
			actions={tableActions}>
			<RequestWrapper isLoading={isLoading} errorMessage={error?.message}>
				<div className='row'>
					{coaches?.content?.map(({ id, nom, prenom, photo }) => (
						<div key={id} className='col-12 col-md-6 col-lg-4'>
							<UserContact
								idItem={id}
								cardBodyClassName='d-flex flex-row-reverse gap-5'
								src={
									photo
										? `data:image/png;base64,${photo || ''}`
										: 'https://placehold.co/600x400'
								}
								name={`${nom} ${prenom}`}
								position={`@${nom}${prenom}`}
								onEdit={(id) => {
									navigate(`/${endPoint}/${id}`);
								}}
								onDelete={(id) => {
									deleteCoach(id)
										.then(() => {
											queryClient.invalidateQueries({
												queryKey: ['coaches', { page: currentPage }],
											});
											toast.success('Club supprimé avec succès!');
										})
										.catch((error) => {
											toast.error(error.message);
										});
								}}
							/>
						</div>
					))}
				</div>
			</RequestWrapper>
		</ListCard>
	);
};

export default ListCoach;
