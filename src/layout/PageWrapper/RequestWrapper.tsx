/* eslint-disable react/prop-types */
import React from 'react';
import Spinner from '../../components/bootstrap/Spinner';

type RequestWrapperProps = {
	children: React.ReactElement[] | React.ReactElement | undefined;
	errorMessage: string | undefined;
	isLoading: boolean;
	dataIsEmpty?: boolean;
};
export const RequestWrapper = ({
	children,
	errorMessage,
	isLoading,
	dataIsEmpty,
}: RequestWrapperProps) => {
	if (isLoading)
		return (
			<tr className='pt-5 bg-ref-d--'>
				<td colSpan={9} className='text-primary text-center'>
					<Spinner size={40} color='warning' />
				</td>
			</tr>
		);
	if (errorMessage)
		return (
			<tr>
				<td colSpan={9} className='text-danger text-center'>
					{errorMessage}
				</td>
			</tr>
		);
	if (dataIsEmpty)
		return (
			<tr>
				<td className='text-danger text-center fs-2' colSpan={9}>
					Aucun club trouvé
				</td>
			</tr>
		);
	return children;
};

export default RequestWrapper;
