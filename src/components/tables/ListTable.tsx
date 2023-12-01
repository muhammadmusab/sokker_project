import React, { ReactElement } from 'react';

type ListTableProps = {
	children: ReactElement;
	headerData: string[];
};

export default function ListTable({ children, headerData }: ListTableProps) {
	return (
		<table className='table table-modern table-hover'>
			<thead>
				<tr>
					{headerData.map((headerTitle) => {
						return (
							<th key={headerTitle} scope='col'>
								{headerTitle}
							</th>
						);
					})}
				</tr>
			</thead>

			<tbody>{children}</tbody>
		</table>
	);
}
