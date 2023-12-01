import { useNavigate } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../bootstrap/Dropdown';
import Button from '../bootstrap/Button';
import { DataTableRow, TableAction } from '../../pages/presentation/project-management/type/types';

type RowTableProps = {
	dataRow: DataTableRow[];
	actions?: TableAction[];
};

export const RowTable = ({ dataRow, actions }: RowTableProps) => {
	const { themeStatus } = useDarkMode();
	const navigate = useNavigate();

	const navigateToDetails = () => {
		navigate(`/club/details/${dataRow[0].id}`);
	};
	return (
		<tr className='cursor-pointer'>
			{dataRow.map(({ value, type }, index) => {
				if (type === 'img') {
					return (
						<td key={index}>
							<img
								src={
									value
										? `data:image/png;base64,${value || ''}`
										: 'https://placehold.co/600x400'
								}
								className='rounded'
								width='69'
								height='69'
								alt='logo'
							/>
						</td>
					);
				}
				if (type === 'date') {
					return (
						<td onClick={navigateToDetails} key={index}>
							{value}
						</td>
					);
				}
				return (
					<td onClick={navigateToDetails} key={index}>
						{value}
					</td>
				);
			})}
			{actions && (
				<td className='text-center'>
					<Dropdown className='d-inline'>
						<DropdownToggle hasIcon={false}>
							<Button
								type='button'
								color={themeStatus}
								icon='MoreHoriz'
								aria-label='Actions'
							/>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd className='me-5'>
							{actions?.map(({ btnIconName, btnTitle, onClick, disable = false }) => {
								return (
									<DropdownItem key={btnTitle}>
										<Button
											color='warning'
											isDisable={disable}
											key={btnTitle}
											icon={btnIconName}
											onClick={() => {
												onClick(dataRow[0].id);
											}}>
											{btnTitle}
										</Button>
									</DropdownItem>
								);
							})}
						</DropdownMenu>
					</Dropdown>
				</td>
			)}
		</tr>
	);
};

export default RowTable;
