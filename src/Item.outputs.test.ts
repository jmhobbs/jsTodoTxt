import test from 'ava';
import { Item } from './Item';

const sampleCompleted =
	'x (Z) 2022-10-17 2022-09-03 We should keep +todoItems in their @place when rendering out due:2022-10-22';

test('toString › Keeps positioning of tags', (t) => {
	const item = new Item(sampleCompleted);
	t.is(item.toString(), sampleCompleted);
});

test('toString › Appends new tags to the end', (t) => {
	const item = new Item(sampleCompleted);
	item.addProject('rewrite');
	item.addContext('computer');
	item.addExtension('h', '1');
	t.is(item.toString(), `${sampleCompleted} +rewrite @computer h:1`);
});

test('toAnnotatedString › Returns the correct string', (t) => {
	const itemStr = '(B) 2022-01-04 My @wall is +painted the color:blue';
	const item = new Item(itemStr);
	const annotated = item.toAnnotatedString();
	t.is(annotated.string, itemStr);
});

test('toAnnotatedString › Returns the correct ranges', (t) => {
	const itemStr = '(B) 2022-01-04 My @wall is +painted the color:blue';
	const item = new Item(itemStr);
	const annotated = item.toAnnotatedString();
	t.deepEqual(
		annotated.contexts.map((ctx) => ctx.string),
		['@wall']
	);
	t.deepEqual(
		annotated.projects.map((prj) => prj.string),
		['+painted']
	);
	t.deepEqual(
		annotated.extensions.map((ext) => ext.string),
		['color:blue']
	);
	annotated.contexts.forEach((ctx) => {
		t.is(annotated.string.slice(ctx.span.start, ctx.span.end), ctx.string);
	});
	annotated.projects.forEach((prj) => {
		t.is(annotated.string.slice(prj.span.start, prj.span.end), prj.string);
	});
	annotated.extensions.forEach((ext) => {
		t.is(annotated.string.slice(ext.span.start, ext.span.end), ext.string);
	});
});
