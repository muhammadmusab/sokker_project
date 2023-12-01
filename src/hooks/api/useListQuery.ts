import { AxiosError } from 'axios';
import React from 'react';
import { GetData } from '../../types';
import { useQuery } from '@tanstack/react-query';

type ListQueryProps = {
	currentPage: number;
	queryFn: (...args: unknown[]) => void;
};

export default function useListQuery<ListType>({ currentPage, queryFn }: ListQueryProps) {
	const { data, isLoading, error } = useQuery<GetData<ListType>, AxiosError>({
		queryKey: ['clubs', currentPage],
		queryFn: () => queryFn(currentPage),
	});
	return { data, isLoading, error };
}
