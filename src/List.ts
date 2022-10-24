import { Item, Priority } from './Item';

const rTrim = /[\r\n]*$/;

interface DateRange {
	start?: Date;
	end?: Date;
}

export interface ListFilter {
	complete?: boolean;
	priority?: Priority;
	created?: DateRange | null;
	completed?: DateRange | null;
	body?: RegExp | string;
	contextsAnd?: string[];
	contextsOr?: string[];
	contextsNot?: string[];
	projectsAnd?: string[];
	projectsOr?: string[];
	projectsNot?: string[];
}

export interface ListItem {
	index: number;
	item: Item;
}

export class List {
	#items: Item[] = [];

	constructor(input: string | string[]) {
		let lines: string[];
		if (typeof input === 'string') {
			lines = input.split('\n');
		} else {
			lines = input;
		}
		this.#items = lines.map((line) => new Item(line.replace(rTrim, '')));
	}

	toString(): string {
		return this.#items.map((item) => item.toString()).join('\n');
	}

	items(): Item[] {
		return this.#items;
	}

	projects(): string[] {
		return [
			...new Set(this.#items.map((item) => item.projects()).reduce((p, n) => [...p, ...n], [])),
		];
	}

	contexts(): string[] {
		return [
			...new Set(this.#items.map((item) => item.contexts()).reduce((p, n) => [...p, ...n], [])),
		];
	}

	extensions(): string[] {
		return [
			...new Set(
				this.#items
					.map((item) => item.extensions().map((ext) => ext.key))
					.reduce((p, n) => [...p, ...n], [])
			),
		];
	}

	filter(input: ListFilter): ListItem[] {
		return this.#items
			.map((item: Item, index: number): ListItem => {
				return {
					index,
					item,
				};
			})
			.filter(({ item }): boolean => {
				if (input.complete !== undefined && input.complete !== item.complete()) {
					return false;
				}

				if (input.priority !== undefined && input.priority !== item.priority()) {
					return false;
				}

				if (input.created !== undefined) {
					if (!filterDateRange(item.created(), input.created)) {
						return false;
					}
				}

				if (input.completed !== undefined) {
					if (!filterDateRange(item.completed(), input.completed)) {
						return false;
					}
				}

				if (input.body !== undefined) {
					if (input.body instanceof RegExp) {
						if (null === input.body.exec(item.body())) {
							return false;
						}
					} else {
						if (input.body !== item.body()) {
							return false;
						}
					}
				}

				const contexts = item.contexts();
				if (input.contextsAnd !== undefined) {
					if (
						input.contextsAnd.filter((context) => {
							return !contexts.includes(context);
						}).length !== 0
					) {
						return false;
					}
				}

				if (input.contextsOr !== undefined) {
					if (
						input.contextsOr.filter((context) => {
							return contexts.includes(context);
						}).length === 0
					) {
						return false;
					}
				}

				if (input.contextsNot !== undefined) {
					if (
						input.contextsNot.filter((context) => {
							return contexts.includes(context);
						}).length > 0
					) {
						return false;
					}
				}

				const projects = item.projects();
				if (input.projectsAnd !== undefined) {
					if (
						input.projectsAnd.filter((context) => {
							return !projects.includes(context);
						}).length !== 0
					) {
						return false;
					}
				}

				if (input.projectsOr !== undefined) {
					if (
						input.projectsOr.filter((context) => {
							return projects.includes(context);
						}).length === 0
					) {
						return false;
					}
				}

				if (input.projectsNot !== undefined) {
					if (
						input.projectsNot.filter((context) => {
							return projects.includes(context);
						}).length > 0
					) {
						return false;
					}
				}

				return true;
			});
	}
}

function filterDateRange(date: Date | null, range: DateRange | null): boolean {
	if (range === null) {
		if (date !== null) {
			return false;
		}
	} else {
		if (date === null) {
			return false;
		} else {
			if (range.start !== undefined && date < range.start) {
				return false;
			}
			if (range.end !== undefined && date > range.end) {
				return false;
			}
		}
	}
	return true;
}
