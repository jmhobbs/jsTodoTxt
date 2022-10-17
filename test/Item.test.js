import test from 'ava'
import Item from '../src/Item.js'

function constructAndCompare(t, input, complete, priority, date, body, contexts, projects, extensions) {
	const item = new Item(input);
	t.is(item.completed(), complete);
	t.is(item.priority(), priority);
	t.deepEqual(item.date(), date);
	t.is(item.body(), body);
	t.deepEqual(item.projects(), projects);
	t.deepEqual(item.contexts(), contexts);
	t.deepEqual(item.extensions(), extensions);
}

test(
	'Constructor › Basic',
	constructAndCompare,
	'Just the body.',
	false,
	null,
	null,
	'Just the body.',
	[],
	[],
	[]
);

test(
	'Constructor › Complete',
	constructAndCompare,
	'x (A) 2016-01-02 measure space for +chapelShelving @chapel due:2016-05-03',
	true,
	'A',
	new Date(2016, 0, 2),
	'measure space for +chapelShelving @chapel due:2016-05-03',
	['chapelShelving'],
	['chapel'],
	[['due', '2016-05-03']]
);


test('toString › Keeps positioning of tags', t => {
	const itemString = 'x (Z) 2022-10-17 We should keep +todoItems in their @place when rendering out';
	const item = new Item(itemString);
	t.is(item.toString(), itemString);
});
