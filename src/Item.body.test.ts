import test from 'ava';
import { Item } from './Item';

test('setBody › Updates contexts, projects and extensions', (t) => {
	const item = new Item('This is @before and +willDelete these tags:all');
	const newBody = 'A new @world with +newTags and extension:values';
	item.setBody(newBody);
	t.deepEqual(item.contexts(), ['world']);
	t.deepEqual(item.projects(), ['newTags']);
	t.deepEqual(item.extensions(), [{ key: 'extension', value: 'values' }]);
	t.is(item.body(), newBody);
});
