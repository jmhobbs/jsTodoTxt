#!/usr/bin/env node

import { Command } from 'commander';

import { setup, shutdown } from './hooks';

import Add from './commands/add';
import List from './commands/list';

const program = new Command();

program
	.name('todo')
	.description('todo.txt tool')
	.version('1.0.0')
	.enablePositionalOptions()
	.option('-p', 'Plain mode turns off colors', false)
	.hook('preAction', setup)
	.hook('postAction', shutdown);

program
	.command('add')
	.alias('a')
	.description('Add a task to todo.txt')
	.argument('<task>', 'Task to add')
	.action(Add);

program
	.command('list')
	.alias('ls')
	.passThroughOptions()
	.description('List tasks')
	.argument('[term...]', 'Filter by project, context or string', '')
	.action(List);

program.parse();
