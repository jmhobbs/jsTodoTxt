import test from 'ava';
import { Item } from './Item';

test('setPriority › Adding', (t) => {
	const item = new Item('I have to do this.');
	item.setPriority('T');
	t.is(item.priority(), 'T');
	t.is(item.toString(), '(T) I have to do this.');
});

test('setPriority › Updating', (t) => {
	const item = new Item('(Z) I have to do this.');
	item.setPriority('T');
	t.is(item.priority(), 'T');
	t.is(item.toString(), '(T) I have to do this.');
});

test('setPriority › Removing', (t) => {
	const item = new Item('(L) I have to do this.');
	item.setPriority();
	t.is(item.priority(), null);
	t.is(item.toString(), 'I have to do this.');
});

test('setPriority › Throws an exception when provided invalid input', (t) => {
	const item = new Item('(L) I have to do this.');
	t.throws(() => item.setPriority('6'));
});

test('clearPriority › Clears the priority from a task', (t) => {
	const item = new Item('(L) I have to do this.');
	item.clearPriority();
	t.is(item.priority(), null);
});
