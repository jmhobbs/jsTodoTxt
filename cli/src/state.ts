import { List } from 'jstodotxt';

import chalk from 'chalk';
import { Writable } from 'stream';

export interface Sink {
	write(str: string): void;
	writeLine(str: string): void;
}

class WritableSink {
	#drain: Writable;

	constructor(drain: Writable) {
		this.#drain = drain;
	}

	write(str: string): void {
		this.#drain.write(str);
	}

	writeLine(str: string): void {
		this.#drain.write(str);
		this.#drain.write('\n');
	}
}

interface State {
	todo: List;
	done: List;
	chalk: chalk.Chalk;
	sink: Sink;
}

const state: State = {
	todo: new List([]),
	done: new List([]),
	chalk,
	sink: new WritableSink(process.stdout),
};

export default state;
