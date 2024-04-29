import test from 'ava';
import { Item } from './Item';

test('setCompleted › Adding with Date', (t) => {
	const item = new Item('2022-06-29 I have to do this.');
	const due = new Date(2022, 6, 1);
	item.setCompleted(due);
	t.deepEqual(item.completed(), due);
	t.true(item.complete());
	t.is(item.createdToString(), '2022-06-29');
	t.is(item.toString(), 'x 2022-07-01 2022-06-29 I have to do this.');
});

test('setCompleted › Set a task completed without a creating date ', (t) => {
	const item = new Item('I have to do this.');
	const due = new Date(2022, 6, 1);
	item.setCompleted(due);
	t.deepEqual(item.completed(), due);
	t.true(item.complete());
	t.is(item.created(), null);
	t.is(item.toString(), 'x 2022-07-01 I have to do this.');
});

test('setCompleted › Adding with string', (t) => {
	const item = new Item('2022-06-29 I have to do this.');
	const due = new Date(2022, 6, 1);
	item.setCompleted('2022-07-01');
	t.deepEqual(item.completed(), due);
	t.true(item.complete());
	t.is(item.toString(), 'x 2022-07-01 2022-06-29 I have to do this.');
});

test('setCompleted › Updating with Date', (t) => {
	const item = new Item('1999-04-12 I have to do this.');
	const due = new Date(2022, 6, 1);
	item.setCompleted(due);
	t.deepEqual(item.completed(), due);
	t.true(item.complete());
	t.is(item.toString(), 'x 2022-07-01 1999-04-12 I have to do this.');
});

test('setCompleted › Updating with string', (t) => {
	const item = new Item('1999-04-12 I have to do this.');
	item.setCompleted('2022-07-01');
	t.deepEqual(item.completed(), new Date(2022, 6, 1));
	t.true(item.complete());
	t.is(item.toString(), 'x 2022-07-01 1999-04-12 I have to do this.');
});

test('setCompleted › Removing', (t) => {
	const item = new Item('x 2022-06-01 1999-04-12 I have to do this.');
	item.setCompleted();
	t.is(item.completed(), null);
	t.is(item.toString(), 'x 1999-04-12 I have to do this.');
});

test('setCompleted › Throws an exception for invalid input', (t) => {
	const item = new Item('x I have to do this.');
	t.throws(() => item.setCompleted('20220102'));
});

test('clearCompleted › Removes the completed date', (t) => {
	const item = new Item('x 2022-06-01 1999-04-12 I have to do this.');
	item.clearCompleted();
	t.is(item.completed(), null);
	t.is(item.toString(), 'x 1999-04-12 I have to do this.');
});
