import { useMemo, useState } from 'react';

const useSortableData = (items: any[], config = null) => {
	const [sortConfig, setSortConfig] = useState(config);

	const sortedItems = useMemo(() => {
		const sortableItems = [...items];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				// @ts-ignore
				if (a[sortConfig.key] < b[sortConfig.key]) {
					// @ts-ignore
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				// @ts-ignore
				if (a[sortConfig.key] > b[sortConfig.key]) {
					// @ts-ignore
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [items, sortConfig]);

	const requestSort = (key: any) => {
		let direction = 'ascending';
		// @ts-ignore
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		// @ts-ignore
		setSortConfig({ key, direction });
	};

	const getClassNamesFor = (key: any) => {
		if (!sortConfig) {
			return 'd-none';
		}
		// eslint-disable-next-line consistent-return
		// @ts-ignore
		return sortConfig.key === key ? sortConfig.direction : 'd-none';
	};

	return { items: sortedItems, requestSort, getClassNamesFor, sortConfig };
};
const useSortableDataCoach = (items1: any[], config = null) => {
	const [sortConfig, setSortConfig] = useState(config);

	const sortedItems = useMemo(() => {
		const sortableItems = [...items1];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				// @ts-ignore
				if (a[sortConfig.key] < b[sortConfig.key]) {
					// @ts-ignore
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				// @ts-ignore
				if (a[sortConfig.key] > b[sortConfig.key]) {
					// @ts-ignore
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [items1, sortConfig]);

	const requestSortCoach = (key: any) => {
		let direction = 'ascending';
		// @ts-ignore
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		// @ts-ignore
		setSortConfig({ key, direction });
	};

	const getClassNamesForCoach = (key: any) => {
		if (!sortConfig) {
			return 'd-none';
		}
		// eslint-disable-next-line consistent-return
		// @ts-ignore
		return sortConfig.key === key ? sortConfig.direction : 'd-none';
	};

	return { items1: sortedItems, requestSortCoach, getClassNamesForCoach, sortConfig };
};

export default useSortableData;
export { useSortableDataCoach };
