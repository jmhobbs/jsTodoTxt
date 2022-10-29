import { IndexedItem } from './indexedItem';

/**
 * Applies a filter string to a list of items, returning the items which satisfy the filter.
 *
 * @param filter A string of terms to match, or not match if prefixed with `-`.  Filters with multiple terms separated by `|` are satisfied when any terms match.
 * @param indexedItems An array of items to filter.
 *
 * @returns An arrya of filtered items.
 */
export default function Filter(filter: string, indexedItems: IndexedItem[]): IndexedItem[] {
	const filters = filter.split('|').map((filter: string) => filter.toLowerCase());
	if (filters.length === 0) {
		return indexedItems;
	}

	const positiveFilters = filters.filter((filter: string) => filter[0] !== '-');
	const negativeFilters = filters
		.filter((filter: string) => filter[0] === '-')
		.map((filter: string) => filter.slice(1));

	let filtered: IndexedItem[] = [];

	if (positiveFilters.length > 0) {
		filtered = indexedItems.filter((line: IndexedItem) => {
			return (
				positiveFilters.filter((filter: string) => line.body.indexOf(filter) !== -1).length > 0
			);
		});
	}

	if (negativeFilters.length > 0) {
		filtered = [
			...filtered,
			...indexedItems.filter((line: IndexedItem) => {
				return (
					negativeFilters.filter((filter: string) => line.body.indexOf(filter) !== -1).length === 0
				);
			}),
		];
	}

	return [...new Set(filtered)];
}
