import test from 'ava';
import { List } from './List';

test('toString', (t) => {
	const list = new List(['first item', 'second item', 'third item']);
	t.is(list.toString(), 'first item\nsecond item\nthird item');
});

test('projects', (t) => {
	const list = new List(['first +item', 'second +item', 'third +task']);
	t.deepEqual(list.projects(), ['item', 'task']);
});

test('contexts', (t) => {
	const list = new List(['first @item', 'second @task', 'third @item']);
	t.deepEqual(list.contexts(), ['item', 'task']);
});

test('extensions', (t) => {
	const list = new List(['first item is due:2022-01-05', 'second item h:1', 'third h:0']);
	t.deepEqual(list.extensions(), { due: ['2022-01-05'], h: ['1', '0'] });
});
