import test from 'ava';
import { List } from 'jstodotxt';

import Filter from './filter';
import { IndexItems } from './indexedItem';

const BIRD = 'This has a bird';
const FISH = 'This has a fish';
const BOTH = 'This has a bird and a fish';
const NEITHER = 'This has neither';

const indexedItems = IndexItems(new List([BIRD, FISH, BOTH, NEITHER]).items());

test('applies single positive filters', (t) => {
	const filtered = Filter('bird', indexedItems);
	t.deepEqual(
		filtered.map((idxItm) => idxItm.item.body()),
		[BIRD, BOTH]
	);
});

test('applies single negative filters', (t) => {
	const filtered = Filter('-bird', indexedItems);
	t.deepEqual(
		filtered.map((idxItm) => idxItm.item.body()),
		[FISH, NEITHER]
	);
});

test('applies multiple positive filters', (t) => {
	const filtered = Filter('bird|fish', indexedItems);
	t.deepEqual(
		filtered.map((idxItm) => idxItm.item.body()),
		[BIRD, FISH, BOTH]
	);
});

test('applies multiple negative filters', (t) => {
	const filtered = Filter('-bird|-fish', indexedItems);
	t.deepEqual(
		filtered.map((idxItm) => idxItm.item.body()),
		[NEITHER]
	);
});

test('applies positive and negative filters', (t) => {
	const filtered = Filter('bird|-fish', indexedItems);
	t.deepEqual(
		filtered.map((idxItm) => idxItm.item.body()),
		[BIRD, BOTH, NEITHER]
	);
});
