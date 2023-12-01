import React from 'react';
import ClubForm from '.';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getItemById } from '../../../requests';
import RequestWrapper from '../../../layout/PageWrapper/RequestWrapper';
import { Cluub } from '../../../types';
import { AxiosError } from 'axios';

export default function EditClub() {
	const { id } = useParams();
	const {
		data: club,
		isLoading,
		error,
	} = useQuery<Cluub, AxiosError>({
		queryKey: ['club', { id }],
		queryFn: () => getItemById({ endPoint: 'clubs', id: id ?? 0 }),
	});
	return (
		<RequestWrapper isLoading={isLoading} errorMessage={error?.message}>
			<ClubForm mode='edit' defaultData={club} />
		</RequestWrapper>
	);
}
