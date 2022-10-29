import { Item, Priority } from './Item';

export interface DateRange {
	start?: Date;
	end?: Date;
}

export type ExtensionFilterFunction = (extensions: { key: string; value: string }[]) => boolean;

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
	extensions?: ExtensionFilterFunction | string[];
}

export interface ListItem {
	index: number;
	item: Item;
}

interface KeysForExtensions {
	[key: string]: string[];
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

		this.#items = lines
			.map((line) => line.trimEnd())
			.filter((line) => line.length > 0)
			.map((line) => new Item(line.trimEnd()));
	}

	toString(): string {
		return this.#items.map((item) => item.toString()).join('\n');
	}

	items(): ListItem[] {
		return this.#items.map((item: Item, index: number): ListItem => {
			return {
				index,
				item,
			};
		});
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

	extensions(): KeysForExtensions {
		const ret: KeysForExtensions = {};

		this.#items.forEach((item) => {
			item.extensions().forEach((ext) => {
				const values = ret[ext.key] || [];
				values.push(ext.value);
				ret[ext.key] = [...new Set(values)];
			});
		});

		return ret;
	}

	filter(input: ListFilter): ListItem[] {
		return this.items().filter(({ item }): boolean => {
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
				if (input.contextsAnd.some((context) => !contexts.includes(context))) {
					return false;
				}
			}

			if (input.contextsOr !== undefined) {
				if (!input.contextsOr.some((context) => contexts.includes(context))) {
					return false;
				}
			}

			if (input.contextsNot !== undefined) {
				if (input.contextsNot.some((context) => contexts.includes(context))) {
					return false;
				}
			}

			const projects = item.projects();
			if (input.projectsAnd !== undefined) {
				if (input.projectsAnd.some((context) => !projects.includes(context))) {
					return false;
				}
			}

			if (input.projectsOr !== undefined) {
				if (!input.projectsOr.some((context) => projects.includes(context))) {
					return false;
				}
			}

			if (input.projectsNot !== undefined) {
				if (input.projectsNot.some((context) => projects.includes(context))) {
					return false;
				}
			}

			if (input.extensions !== undefined) {
				if (typeof input.extensions === 'function') {
					if (!input.extensions(item.extensions())) {
						return false;
					}
				} else if (
					!item.extensions().some(({ key }) => (<string[]>input.extensions).includes(key))
				) {
					return false;
				}
			}

			return true;
		});
	}

	/**
	 * Add a new Item to the end of the List
	 */
	add(item: Item | string): ListItem {
		if (typeof item === 'string') {
			this.#items.push(new Item(item));
		} else {
			this.#items.push(item);
		}
		return { item: this.#items[this.#items.length - 1], index: this.#items.length - 1 };
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
