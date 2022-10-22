import test from 'ava';
import { Item } from './Item';

test('setComplete › Works marking complete', (t) => {
	const item = new Item('I have to do this.');
	t.false(item.complete());
	item.setComplete(true);
	t.true(item.complete());
	t.is(item.toString(), 'x I have to do this.');
});

test('setComplete › Works marking incomplete', (t) => {
	const item = new Item('x I have to do this.');
	t.true(item.complete());
	item.setComplete(false);
	t.false(item.complete());
	t.is(item.toString(), 'I have to do this.');
});
