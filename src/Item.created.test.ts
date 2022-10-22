import test from 'ava';
import { Item } from './Item';

test('setCreated › Adding with Date', (t) => {
	const item = new Item('I have to do this.');
	const due = new Date(2022, 7, 1);
	item.setCreated(due);
	t.deepEqual(item.created(), due);
});

test('setCreated › Adding with string', (t) => {
	const item = new Item('I have to do this.');
	const due = new Date(2022, 6, 1);
	item.setCreated('2022-07-01');
	t.deepEqual(item.created(), due);
});

test('setCreated › Updating with Date', (t) => {
	const item = new Item('1999-04-12 I have to do this.');
	const due = new Date(2022, 7, 1);
	item.setCreated(due);
	t.deepEqual(item.created(), due);
});

test('setCreated › Updating with string', (t) => {
	const item = new Item('1999-04-12 I have to do this.');
	item.setCreated('2022-07-01');
	t.deepEqual(item.created(), new Date(2022, 6, 1));
});

test('setCreated › Removing works', (t) => {
	const item = new Item('1999-04-12 I have to do this.');
	item.setCreated();
	t.is(item.created(), null);
});

test('setCreated › Removing also removes completed date', (t) => {
	const item = new Item('x 2022-05-23 1999-04-12 I have to do this.');
	item.setCreated();
	t.is(item.created(), null);
	t.is(item.completed(), null);
});

test('setCreated › Throws an exception for invalid input', (t) => {
	const item = new Item('I have to do this.');
	t.throws(() => item.setCreated('20220102'));
});
