import state from '../state';
import Format from '../util/format';
import { IndexedItem, IndexItems } from '../util/indexedItem';
import Filter from '../util/filter';

export default function List(andFilters: string | string[]): void {
	let indexedItems = IndexItems(state.todo.items());
	const count = indexedItems.length;

	if (typeof andFilters === 'string') {
		andFilters = [andFilters];
	}

	andFilters.map((filter: string) => (indexedItems = Filter(filter, indexedItems)));

	indexedItems
		.sort((a: IndexedItem, b: IndexedItem): number => {
			const aPrio = a.item.priority() || '[';
			const bPrio = b.item.priority() || '[';
			if (aPrio === bPrio) {
				return a.item.body() > b.item.body() ? 1 : -1;
			}
			return aPrio > bPrio ? 1 : -1;
		})
		.forEach((line: IndexedItem) => {
			state.sink.writeLine(Format(state.chalk, line));
		});

	state.sink.writeLine('--');
	state.sink.writeLine(`TODO: ${indexedItems.length} of ${count} tasks shown`);
}
