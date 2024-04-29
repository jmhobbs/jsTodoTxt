import test from 'ava';
import { List } from './List';

test('projects › get projects', (t) => {
	const list = new List('first item +project-1\nsecond item +project-2');
	t.deepEqual(list.projects(), ['project-1', 'project-2']);
});

test('projects › deduplicate', (t) => {
	const list = new List('first item +project-1\nsecond item +project-1');
	t.deepEqual(list.projects(), ['project-1']);
});
