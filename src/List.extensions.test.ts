import test from 'ava';
import { List } from './List';

test('extensions › get extensions', (t) => {
	const list = new List('first item ext-1:value-1\nsecond item ext-2:value-2');
	t.deepEqual(list.extensions(), {
		'ext-1': ['value-1'],
		'ext-2': ['value-2'],
	});
});

test('extensions › deduplicate', (t) => {
	const list = new List('first item ext-1:value-1\nsecond item ext-1:value-1 ext-1:value-2');
	t.deepEqual(list.extensions(), {
		'ext-1': ['value-1', 'value-2'],
	});
});
