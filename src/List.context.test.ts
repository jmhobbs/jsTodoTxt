import test from 'ava';
import { List } from './List';

test('context › get contexts', (t) => {
	const list = new List('first item @context-1\nsecond item @context-2');
	t.deepEqual(list.contexts(), ['context-1', 'context-2']);
});

test('context › deduplicate', (t) => {
	const list = new List('first item @context-1\nsecond item @context-1');
	t.deepEqual(list.contexts(), ['context-1']);
});
