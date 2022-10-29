import test from 'ava';
import { List } from './List';
import { Item } from './Item';

test('add › string', (t) => {
	const list = new List(['first item', 'second item', 'third item']);
	const listItem = list.add('fourth item');
	t.is(listItem.index, 3);
	t.is(listItem.item.toString(), 'fourth item');
});

test('add › Item', (t) => {
	const list = new List(['first item', 'second item', 'third item']);
	const listItem = list.add(new Item('fourth item'));
	t.is(listItem.index, 3);
	t.is(listItem.item.toString(), 'fourth item');
});
