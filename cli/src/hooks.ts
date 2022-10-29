import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

import { List } from 'jstodotxt';

import state from './state';

export function setup(program: Command) {
	state.chalk = new chalk.Instance({ level: program.opts()['p'] ? 0 : 3 });
	state.todo = loadList('todo.txt');
	state.done = loadList('done.txt');
}

function loadList(list: string): List {
	const txt = readFileSync(path.join(homedir(), '.todo', list));
	return new List(txt.toString('utf8'));
}

export function shutdown() {
	writeFileSync(path.join(homedir(), '.todo', 'todo.txt'), state.todo.toString());
	writeFileSync(path.join(homedir(), '.todo', 'done.txt'), state.done.toString());
}
