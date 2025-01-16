import test from 'ava';
import { Item } from './Item';

const sampleCompleted =
	'x (Z) 2022-10-17 We should keep +todoItems in their @place when rendering out due:2022-10-22';

test('projects › Deduplicates', (t) => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	t.deepEqual(item.projects(), ['goals', 'projects']);
});

test('projects › Does not parse context without a space', (t) => {
	const item = new Item('A small computation: 1+1 = 2');
	t.deepEqual(item.projects(), []);
});

test('projects › Parses context at start of line', (t) => {
	const item = new Item('+goals Do the thing');
	t.deepEqual(item.projects(), ['goals']);
});

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

test('removeProject › Removes projects (none present)', (t) => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	item.removeProject('nothing');
	t.deepEqual(item.projects(), ['goals', 'projects']);
});

test('removeProject › Updates the body', (t) => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	item.removeProject('goals');
	t.is(item.body(), 'Hello @home with and +projects and extensions:todo');
});
