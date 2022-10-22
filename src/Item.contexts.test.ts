import test from 'ava';
import { Item } from './Item';

const sampleCompleted =
	'x (Z) 2022-10-17 We should keep +todoItems in their @place when rendering out due:2022-10-22';

test('addContext › Adds new contexts', (t) => {
	const item = new Item(sampleCompleted);
	item.addContext('computer');
	t.deepEqual(item.contexts(), ['place', 'computer']);
});

test('addContext › Does not add contexts which already exist', (t) => {
	const item = new Item(sampleCompleted);
	item.addContext('place');
	t.deepEqual(item.contexts(), ['place']);
});

test('addContext › Updates the body', (t) => {
	const item = new Item('Hello');
	item.addContext('world');
	t.is(item.body(), 'Hello @world');
});

test('removeContext › Removes contexts', (t) => {
	const item = new Item('Hello @home and @work with +projects and @work extensions:todo');
	item.removeContext('work');
	t.deepEqual(item.contexts(), ['home']);
});

test('removeContext › Updates the body', (t) => {
	const item = new Item('Hello @home and @work with +projects and @work extensions:todo');
	item.removeContext('work');
	t.is(item.body(), 'Hello @home and with +projects and extensions:todo');
});
