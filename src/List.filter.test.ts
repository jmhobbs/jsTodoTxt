import test, { ExecutionContext } from 'ava';
import { List, ListFilter } from './List';

const NOT_COMPLETE = 'not complete';
const COMPLETE = 'x complete';
const PRIORITY = '(A) Priority';
const EVERYTHING = 'x (B) 2020-06-22 2020-05-17 Everything @everywhere +allAtOnce due:2022-02-01';
const CREATED_MARCH = '2021-03-01 Created in March';
const CREATED_JULY = '2021-07-01 Created in July';
const COMPLETED_AUGUST = 'x 2020-08-01 2020-07-01 Completed in August';
const COMPLETED_DECEMBER = 'x 2020-12-01 2020-10-01 Completed in December';
const CONTEXT_HOME = 'Close windows @home';
const CONTEXT_COMPUTER = 'Check email @computer';
const CONTEXTS = 'Work on @computer when @home';
const PROJECT_REPORT = 'Create an outline for my +report';
const PROJECT_SHED = 'Put siding on the +shed';
const PROJECTS = 'Gather dimensions for my +report on my +shed build';
const EXTENSION_BLUE = 'Paint room color:blue';
const EXTENSION_RED = 'Paint room color:red';

const lines = [
	NOT_COMPLETE,
	COMPLETE,
	PRIORITY,
	EVERYTHING,
	CREATED_MARCH,
	CREATED_JULY,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
	CONTEXT_HOME,
	CONTEXT_COMPUTER,
	CONTEXTS,
	PROJECT_REPORT,
	PROJECT_SHED,
	PROJECTS,
	EXTENSION_BLUE,
	EXTENSION_RED,
];

const linesIndex = Object.fromEntries(lines.map((v, i) => [v, i]));

const list = new List(lines);

function compare(
	t: ExecutionContext,
	filter: ListFilter,
	included: string[] | null,
	excluded: string[] | null = null
) {
	const filtered = list.filter(filter);
	let expected: string[] = [];
	if (included !== null) {
		t.is(filtered.length, included.length);
		expected = included;
	} else if (excluded !== null) {
		t.is(filtered.length, lines.length - excluded.length);
		expected = lines.filter((line) => excluded.indexOf(line) === -1);
	}
	expected.forEach((line: string, index: number) => {
		t.is(
			filtered[index].item.toString(),
			line,
			`expected line "${line}", got "${filtered[index].item.toString()}"`
		);
		t.is(filtered[index].index, linesIndex[line], `index does not match for ${line}`);
	});
}

test(
	'filter › all',
	compare,
	{
		complete: true,
		priority: 'B',
		created: { start: new Date(2020, 4, 1), end: new Date(2020, 5, 1) },
		completed: { start: new Date(2020, 5, 1), end: new Date(2020, 6, 1) },
		body: /^Everything/,
	},
	[EVERYTHING]
);

test('filter › complete', compare, { complete: true }, [
	COMPLETE,
	EVERYTHING,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test('filter › ! complete', compare, { complete: false }, null, [
	COMPLETE,
	EVERYTHING,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test('filter › priority', compare, { priority: 'A' }, [PRIORITY]);

test('filter › priority (no match)', compare, { priority: 'Z' }, []);

test('filter › ! priority', compare, { priority: null }, null, [PRIORITY, EVERYTHING]);

test('filter › created › after start', compare, { created: { start: new Date(2021, 0, 1) } }, [
	CREATED_MARCH,
	CREATED_JULY,
]);

test('filter › created › before end', compare, { created: { end: new Date(2021, 5, 1) } }, [
	EVERYTHING,
	CREATED_MARCH,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test(
	'filter › created › between',
	compare,
	{ created: { start: new Date(2021, 0, 1), end: new Date(2021, 5, 1) } },
	[CREATED_MARCH]
);

test('filter › ! created', compare, { created: null }, null, [
	EVERYTHING,
	CREATED_MARCH,
	CREATED_JULY,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test('filter › completed › after start', compare, { completed: { start: new Date(2020, 6, 1) } }, [
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test('filter › completed › before end', compare, { completed: { end: new Date(2020, 11, 30) } }, [
	EVERYTHING,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test(
	'filter › completed › between',
	compare,
	{ completed: { start: new Date(2020, 10, 1), end: new Date(2021, 0, 1) } },
	[COMPLETED_DECEMBER]
);

test('filter › ! completed', compare, { completed: null }, null, [
	EVERYTHING,
	COMPLETED_AUGUST,
	COMPLETED_DECEMBER,
]);

test('filter › body › regex', compare, { body: /^Created in/ }, [CREATED_MARCH, CREATED_JULY]);

test('filter › body › string', compare, { body: 'complete' }, [COMPLETE]);

test('filter › contexts › and › single', compare, { contextsAnd: ['home'] }, [
	CONTEXT_HOME,
	CONTEXTS,
]);

test('filter › contexts › and › multiple', compare, { contextsAnd: ['home', 'computer'] }, [
	CONTEXTS,
]);

test('filter › contexts › or › single', compare, { contextsOr: ['home'] }, [
	CONTEXT_HOME,
	CONTEXTS,
]);

test('filter › contexts › or › multiple', compare, { contextsOr: ['home', 'computer'] }, [
	CONTEXT_HOME,
	CONTEXT_COMPUTER,
	CONTEXTS,
]);

test('filter › contexts › not', compare, { contextsNot: ['everywhere'] }, null, [EVERYTHING]);

test(
	'filter › contexts › or + not',
	compare,
	{ contextsOr: ['home', 'computer'], contextsNot: ['home'] },
	[CONTEXT_COMPUTER]
);

test('filter › projects › and › single', compare, { projectsAnd: ['shed'] }, [
	PROJECT_SHED,
	PROJECTS,
]);

test('filter › projects › and › multiple', compare, { projectsAnd: ['shed', 'report'] }, [
	PROJECTS,
]);

test('filter › projects › or › single', compare, { projectsOr: ['shed'] }, [
	PROJECT_SHED,
	PROJECTS,
]);

test('filter › projects › or › multiple', compare, { projectsOr: ['shed', 'report'] }, [
	PROJECT_REPORT,
	PROJECT_SHED,
	PROJECTS,
]);

test('filter › projects › not', compare, { projectsNot: ['allAtOnce'] }, null, [EVERYTHING]);

test(
	'filter › projects › or + not',
	compare,
	{ projectsOr: ['shed', 'report'], projectsNot: ['shed'] },
	[PROJECT_REPORT]
);

test(
	'filter › extensions › by key',
	compare,
	{
		extensions: ['color'],
	},
	[EXTENSION_BLUE, EXTENSION_RED]
);

test(
	'filter › extensions › by function',
	compare,
	{
		extensions: (extensions: { key: string; value: string }[]): boolean => {
			return extensions.filter(({ key, value }) => key === 'color' && value === 'blue').length > 0;
		},
	},
	[EXTENSION_BLUE]
);
