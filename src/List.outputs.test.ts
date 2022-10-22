import test from 'ava';
import { List } from './List';

test('toString', (t) => {
	const list = new List(['first item', 'second item', 'third item']);
	t.is(list.toString(), 'first item\nsecond item\nthird item');
});
