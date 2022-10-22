import test from 'ava';
import { Item } from './Item';

const sampleCompleted =
	'x (Z) 2022-10-17 We should keep +todoItems in their @place when rendering out due:2022-10-22';

test('addProject › Adds new projects', (t) => {
	const item = new Item(sampleCompleted);
	item.addProject('rewrite');
	t.deepEqual(item.projects(), ['todoItems', 'rewrite']);
});

test('addProject › Does not add projects which already exist', (t) => {
	const item = new Item(sampleCompleted);
	item.addProject('todoItems');
	t.deepEqual(item.projects(), ['todoItems']);
});

test('addProject › Updates the body', (t) => {
	const item = new Item('Hello');
	item.addProject('world');
	t.is(item.body(), 'Hello +world');
});

test('removeProject › Removes projects', (t) => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	item.removeProject('goals');
	t.deepEqual(item.projects(), ['projects']);
});

test('removeProject › Updates the body', (t) => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	item.removeProject('goals');
	t.is(item.body(), 'Hello @home with and +projects and extensions:todo');
});
