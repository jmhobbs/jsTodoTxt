import test from 'ava';
import { Item } from './Item';

test('extensions › Reads extensions', (t) => {
	const item = new Item('due:today Hello there extensions:todo and color:red');
	t.deepEqual(item.extensions(), [
		{ key: 'due', value: 'today' },
		{ key: 'extensions', value: 'todo' },
		{ key: 'color', value: 'red' },
	]);
});

test('setExtension › Overwrites existing values', (t) => {
	const item = new Item('Party like its due:2022-10-22');
	item.setExtension('due', '1999-12-31');
	t.deepEqual(item.extensions(), [{ key: 'due', value: '1999-12-31' }]);
	t.is(item.body(), 'Party like its due:1999-12-31');
});

test('setExtension › Removes additional values', (t) => {
	const item = new Item('My wall is painted the color:blue color:yellow @home for +housePainting');
	item.setExtension('color', 'red');
	t.deepEqual(item.extensions(), [{ key: 'color', value: 'red' }]);
	t.is(item.body(), 'My wall is painted the color:red @home for +housePainting');
});

test('setExtension › Not found', (t) => {
	const item = new Item('My wall is painted the color:blue @home for +housePainting');
	item.setExtension('finish', 'matte');
	t.deepEqual(item.extensions(), [
		{ key: 'color', value: 'blue' },
		{ key: 'finish', value: 'matte' },
	]);
	t.is(item.body(), 'My wall is painted the color:blue @home for +housePainting finish:matte');
});

test('addExtension › Allows for multiple of the same key', (t) => {
	const item = new Item('My wall is painted the color:blue');
	item.addExtension('color', 'red');
	t.deepEqual(item.extensions(), [
		{ key: 'color', value: 'blue' },
		{ key: 'color', value: 'red' },
	]);
	t.is(item.body(), 'My wall is painted the color:blue color:red');
});

test('removeExtension › Removes the extension by key', (t) => {
	const item = new Item('My room:kitchen wall is painted color:blue and color:red');
	item.removeExtension('color');
	t.deepEqual(item.extensions(), [{ key: 'room', value: 'kitchen' }]);
	t.is(item.body(), 'My room:kitchen wall is painted and');
});

test('removeExtension › Removes the extension by key and value', (t) => {
	const item = new Item('My room:kitchen wall is painted color:blue and color:red');
	item.removeExtension('color', 'blue');
	t.deepEqual(item.extensions(), [
		{ key: 'room', value: 'kitchen' },
		{ key: 'color', value: 'red' },
	]);
	t.is(item.body(), 'My room:kitchen wall is painted and color:red');
});
