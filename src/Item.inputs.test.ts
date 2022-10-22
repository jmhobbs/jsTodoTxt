import test, { ExecutionContext } from 'ava';
import { Item } from './Item';

interface Extension {
	key: string;
	value: string;
}

function compare(
	t: ExecutionContext,
	item: Item,
	complete: boolean,
	priority: string | null,
	created: Date | null,
	completed: Date | null,
	body: string,
	contexts: string[],
	projects: string[],
	extensions: Extension[]
) {
	t.is(item.complete(), complete);
	t.is(item.priority(), priority);
	t.deepEqual(item.created(), created);
	t.deepEqual(item.completed(), completed);
	t.is(item.body(), body);
	t.deepEqual(item.projects(), projects);
	t.deepEqual(item.contexts(), contexts);
	t.deepEqual(item.extensions(), extensions);
}

function constructAndCompare(
	t: ExecutionContext,
	input: string,
	complete: boolean,
	priority: string | null,
	created: Date | null,
	completed: Date | null,
	body: string,
	contexts: string[],
	projects: string[],
	extensions: Extension[]
) {
	const item = new Item(input);
	compare(t, item, complete, priority, created, completed, body, contexts, projects, extensions);
}

test(
	'Constructor › Basic',
	constructAndCompare,
	'Just the body.',
	false,
	null,
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
	'x (A) 2016-01-03 2016-01-02 measure space for +chapelShelving @chapel due:2016-01-04',
	true,
	'A',
	new Date(2016, 0, 2),
	new Date(2016, 0, 3),
	'measure space for +chapelShelving @chapel due:2016-01-04',
	['chapel'],
	['chapelShelving'],
	[{ key: 'due', value: '2016-01-04' }]
);

test('parse › Resets everything', (t) => {
	const item = new Item(
		'x (A) 2016-01-03 2016-01-02 measure space for +chapelShelving @chapel due:2016-01-04'
	);
	item.parse('Hello');
	compare(t, item, false, null, null, null, 'Hello', [], [], []);
});
