import { Item, ListItem } from 'jstodotxt';

export interface IndexedItem {
	item: Item;
	index: number;
	body: string;
}

export function IndexItems(listItems: ListItem[]): IndexedItem[] {
	return listItems.map(({ item, index }): IndexedItem => {
		return { item, index, body: item.body().toLowerCase() };
	});
}
