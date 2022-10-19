import test from 'ava'

import Item from './Item'

interface Extension {
	key: string
	value: string
}

// constructor

function constructAndCompare(
	t: any,
	input: string,
	complete: boolean,
	priority: string | null,
	date: Date | null,
	body: string,
	contexts: string[],
	projects: string[],
	extensions: Extension[]
) {
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
	['chapel'],
	['chapelShelving'],
	[{key: 'due', value: '2016-05-03'}]
);

// Outputs

const sampleCompleted = 'x (Z) 2022-10-17 We should keep +todoItems in their @place when rendering out due:2022-10-22';

test('toString › Keeps positioning of tags', t => {
	const item = new Item(sampleCompleted);
	t.is(item.toString(), sampleCompleted);
});

test('toString › Appends new tags to the end', t => {
	const item = new Item(sampleCompleted);
	item.addProject('rewrite');
	item.addContext('computer');
	item.addExtension('h', '1');
	t.is(item.toString(), `${sampleCompleted} +rewrite @computer h:1`);
})

test('toAnnotatedString › Returns the correct string', t => {
	const itemStr = '(B) 2022-01-04 My @wall is +painted the color:blue';
	const item = new Item(itemStr);
	const annotated = item.toAnnotatedString();
	t.is(annotated.string, itemStr);
});

test('toAnnotatedString › Returns the correct ranges', t => {
	const itemStr = '(B) 2022-01-04 My @wall is +painted the color:blue';
	const item = new Item(itemStr);
	const annotated = item.toAnnotatedString();
	t.deepEqual(annotated.contexts, [{
		tag: 'wall',
		start: 18,
		end: 23,
	}]);
	t.deepEqual(annotated.projects, [{
		tag: 'painted',
		start: 27,
		end: 35,
	}]);
	t.deepEqual(annotated.extensions, [{
		key: 'color',
		value: 'blue',
		start: 40,
		end: 51,
	}]);
	t.is(annotated.string.slice(18, 23), '@wall');
	t.is(annotated.string.slice(27, 35), '+painted');
	t.is(annotated.string.slice(40, 51), 'color:blue');
});

// Header

test('setCompleted › Works marking complete', t => {
	const item = new Item('I have to do this.');
	t.false(item.completed());
	item.setCompleted(true);
	t.true(item.completed());
	t.is(item.toString(), 'x I have to do this.');
});

test('setCompleted › Works marking incomplete', t => {
	const item = new Item('x I have to do this.');
	t.true(item.completed());
	item.setCompleted(false);
	t.false(item.completed());
	t.is(item.toString(), 'I have to do this.');
});

test('setPriority › Adding', t => {
	const item = new Item('I have to do this.');
	item.setPriority('T');
	t.is(item.priority(), 'T');
	t.is(item.toString(), '(T) I have to do this.');
});

test('setPriority › Updating', t => {
	const item = new Item('(Z) I have to do this.');
	item.setPriority('T');
	t.is(item.priority(), 'T');
	t.is(item.toString(), '(T) I have to do this.');
});

test('setPriority › Removing', t => {
	const item = new Item('(L) I have to do this.');
	item.setPriority();
	t.is(item.priority(), null);
	t.is(item.toString(), 'I have to do this.');
});

test('setDueDate › Adding with Date', t => {
	const item = new Item('I have to do this.');
	const due = new Date(2022, 7, 1);
	item.setDate(due);
	t.deepEqual(item.date(), due);
});

test('setDueDate › Adding with string', t => {
	const item = new Item('I have to do this.');
	const due = new Date(2022, 6, 1);
	item.setDate('2022-07-01');
	t.deepEqual(item.date(), due);
});

test('setDueDate › Updating with Date', t => {
	const item = new Item('1999-04-12 I have to do this.');
	const due = new Date(2022, 7, 1);
	item.setDate(due);
	t.deepEqual(item.date(), due);
});

test('setDueDate › Updating with string', t => {
	const item = new Item('1999-04-12 I have to do this.');
	item.setDate('2022-07-01');
	t.deepEqual(item.date(), new Date(2022, 6, 1));
});

test('setDueDate › Removing', t => {
	const item = new Item('1999-04-12 I have to do this.');
	item.setDate();
	t.is(item.date(), null);
});

// Context

test('addContext › Adds new contexts', t => {
	const item = new Item(sampleCompleted);
	item.addContext('computer');
	t.deepEqual(item.contexts(), ['place', 'computer'])
});

test('addContext › Does not add projects which already exist', t => {
	const item = new Item(sampleCompleted);
	item.addContext('place');
	t.deepEqual(item.contexts(), ['place']);
});

test('addContext › Updates the body', t => {
	const item = new Item('Hello');
	item.addContext('world');
	t.is(item.body(), 'Hello @world');
});

test('removeContext › Removes contexts', t => {
	const item = new Item('Hello @home and @work with +projects and @work extensions:todo');
	item.removeContext('work');
	t.deepEqual(item.contexts(), ['home']);
});

test('removeContext › Updates the body', t => {
	const item = new Item('Hello @home and @work with +projects and @work extensions:todo');
	item.removeContext('work');
	t.is(item.body(), 'Hello @home and with +projects and extensions:todo');
});

// Project

test('addProject › Adds new projects', t => {
	const item = new Item(sampleCompleted);
	item.addProject('rewrite');
	t.deepEqual(item.projects(), ['todoItems', 'rewrite'])
});

test('addProject › Does not add projects which already exist', t => {
	const item = new Item(sampleCompleted);
	item.addProject('todoItems');
	t.deepEqual(item.projects(), ['todoItems']);
});

test('addProject › Updates the body', t => {
	const item = new Item('Hello');
	item.addProject('world');
	t.is(item.body(), 'Hello +world');
});

test('removeProject › Removes projects', t => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	item.removeProject('goals');
	t.deepEqual(item.projects(), ['projects']);
});

test('removeProject › Updates the body', t => {
	const item = new Item('Hello @home with +goals and +projects and +goals extensions:todo');
	item.removeProject('goals');
	t.is(item.body(), 'Hello @home with and +projects and extensions:todo')
});

// Extensions

test('setExtension › Overwrites existing values', t => {
	const item = new Item('Party like its due:2022-10-22');
	item.setExtension('due', '1999-12-31')
	t.deepEqual(item.extensions(), [{key: 'due', value: '1999-12-31'}]);
	t.is(item.body(), 'Party like its due:1999-12-31')
});

test('setExtension › Removes additional values', t => {
	const item = new Item('My wall is painted the color:blue color:yellow @home for +housePainting');
	item.setExtension('color', 'red')
	t.deepEqual(item.extensions(), [{key: 'color', value: 'red'}]);
	t.is(item.body(), 'My wall is painted the color:red @home for +housePainting')
});

test('addExtension › Allows for multiple of the same key', t => {
	const item = new Item('My wall is painted the color:blue');
	item.addExtension('color', 'red')
	t.deepEqual(item.extensions(), [{key: 'color', value:'blue'}, {key: 'color', value: 'red'}]);
	t.is(item.body(), 'My wall is painted the color:blue color:red')
});

test('removeExtension › Removes the extension by key', t => {
	const item = new Item('My room:kitchen wall is painted color:blue and color:red');
	item.removeExtension('color');
	t.deepEqual(item.extensions(), [{key: 'room', value: 'kitchen'}]);
	t.is(item.body(), 'My room:kitchen wall is painted and')
});

test('removeExtension › Removes the extension by key and value', t => {
	const item = new Item('My room:kitchen wall is painted color:blue and color:red');
	item.removeExtension('color', 'blue');
	t.deepEqual(item.extensions(), [{key: 'room', value: 'kitchen'}, {key: 'color', value: 'red'}]);
	t.is(item.body(), 'My room:kitchen wall is painted and color:red')
});

// Body

test('setBody › Updates contexts, projects and extensions', t => {
 const item = new Item('This is @before and +willDelete these tags:all');
 const newBody = 'A new @world with +newTags and extension:values';
 item.setBody(newBody);
 t.deepEqual(item.contexts(), ['world']);
 t.deepEqual(item.projects(), ['newTags']);
 t.deepEqual(item.extensions(), [{key: 'extension', value: 'values'}]);
 t.is(item.body(), newBody);
});
