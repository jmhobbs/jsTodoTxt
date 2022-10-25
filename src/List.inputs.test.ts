import test from 'ava';
import { List } from './List';

test('constructor › string', (t) => {
	const list = new List('first item\nsecond item');
	t.is(list.items().length, 2);
});

test('constructor › string › strips blank lines', (t) => {
	const list = new List('first item\nsecond item\n\nthird item\n\n');
	t.is(list.items().length, 3);
});

test('constructor › array', (t) => {
	const list = new List(['first item', 'second item', 'third item']);
	t.is(list.items().length, 3);
});

test('constructor › array › strips blank lines', (t) => {
	const list = new List(['first item', '', 'second item', '   ', '\t', 'third item']);
	t.is(list.items().length, 3);
});
