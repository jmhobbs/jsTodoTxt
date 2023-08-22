const rTodo =
	/^((x) )?(\(([A-Z])\) )?(((\d{4}-\d{2}-\d{2}) (\d{4}-\d{2}-\d{2})|(\d{4}-\d{2}-\d{2})) )?(.*)$/;
const rTags = /([^\s:]+:[^\s:]+|[+@]\S+)/g;
const rDate = /^\d{4}-\d{2}-\d{2}$/;

// External types

interface Span {
	start: number;
	end: number;
}

interface Tag {
	string: string;
	span: Span;
}

interface Extension {
	string: string;
	parsed: {
		key: string;
		value: string;
	};
	span: Span;
}

export type Context = Tag;
export type Project = Tag;
export type Priority = string | null;

export type AnnotatedItem = {
	readonly string: string;
	// todo: date, priority, etc
	readonly contexts: Context[];
	readonly projects: Project[];
	readonly extensions: Extension[];
};

// Internal types

interface TrackedTag {
	tag: string;
	start: number;
}

type TrackedContext = TrackedTag;
type TrackedProject = TrackedTag;

function dateFromString(input: string): Date {
	if (null === rDate.exec(input)) {
		throw new Error('Invalid Date Format');
	}
	return new Date(
		parseInt(input.slice(0, 4), 10),
		parseInt(input.slice(5, 7), 10) - 1, // months are zero indexed
		parseInt(input.slice(8), 10)
	);
}

/**
 * Represents a single line in a todo.txt file.
 */
export class Item {
	#complete = false;
	#priority: Priority = null;
	#created: Date | null = null;
	#completed: Date | null = null;
	#body: string[] = [];
	#contexts: TrackedContext[] = [];
	#projects: TrackedProject[] = [];
	#extensions: Map<string, number[]> = new Map();

	constructor(line: string) {
		this.parse(line);
	}

	/**
	 * Parse in a full todo.txt line, replacing and resetting all fields.
	 *
	 * @param line A full todo.txt task line
	 */
	parse(line: string) {
		// reset all fields
		this.#complete = false;
		this.#priority = null;
		this.#created = null;
		this.#completed = null;
		this.#body = [];
		this.#contexts = [];
		this.#projects = [];
		this.#extensions = new Map();

		// this can't _not_ match due to the .* at the end
		const match = <RegExpExecArray>rTodo.exec(line);

		this.#complete = match[2] === 'x';
		this.#priority = match[4] || null;

		if (typeof match[9] !== 'undefined') {
			this.#created = dateFromString(match[9]);
		} else if (typeof match[7] !== 'undefined') {
			this.#completed = dateFromString(match[7]);
			this.#created = dateFromString(match[8]);
		}

		this.setBody(match[10]);
	}

	/**
	 * Generate a full todo.txt line out of this Item.
	 */
	toString(): string {
		const parts = [
			this.#complete ? 'x' : '',
			this.#priority ? `(${this.#priority})` : '',
			this.completedToString(),
			this.createdToString(),
			this.body(),
		];

		return parts.filter((v) => v !== null && v !== '').join(' ');
	}

	/**
	 * Generate the full todo.txt line of this Item, as well as spans describing the
	 * location of all of it's component parts.
	 */
	// toAnnotatedString(): AnnotatedItem {
	// 	const str = this.toString();
	// 	const headerLength = str.length - this.#body.length;

	// 	function tagRemap(prefix: string) {
	// 		return function (tag: TrackedTag): Tag {
	// 			const fullTag = [prefix, tag.tag].join('');
	// 			return {
	// 				string: fullTag,
	// 				span: {
	// 					start: tag.start + headerLength,
	// 					end: tag.start + headerLength + fullTag.length,
	// 				},
	// 			};
	// 		};
	// 	}

	// 	function extensionsRemap(ext: TrackedExtension): Extension {
	// 		const tag = `${ext.key}:${ext.value}`;
	// 		return {
	// 			string: tag,
	// 			parsed: {
	// 				key: ext.key,
	// 				value: ext.value,
	// 			},
	// 			span: {
	// 				start: ext.start + headerLength,
	// 				end: ext.start + headerLength + tag.length,
	// 			},
	// 		};
	// 	}

	// 	return {
	// 		string: str,
	// 		contexts: this.#contexts.map(tagRemap('@')),
	// 		projects: this.#projects.map(tagRemap('+')),
	// 		extensions: [], // TODO this.#extensions.map(extensionsRemap)
	// 	};
	// }

	/**
	 * Is this task complete?
	 */
	complete(): boolean {
		return this.#complete;
	}

	/**
	 * Set if this task is complete.
	 *
	 * **Side Effect**
	 *
	 * Setting this to false will clear the completed date.
	 *
	 * @param complete True if the task is complete.
	 */
	setComplete(complete: boolean) {
		this.#complete = complete;
		if (!complete) {
			this.clearCompleted();
		}
	}

	/**
	 * Get the priority of this Item, or null if not present.
	 */
	priority(): string | null {
		return this.#priority;
	}

	/**
	 * Set the priority of the task.  Passing `null` or no argument clears priority.
	 *
	 * @param priority A priority from A-Z or null to clear priority.
	 * @throws An Error when the input is invalid.
	 */
	setPriority(priority: Priority = null) {
		if (priority) {
			const char = priority.charCodeAt(0);
			if (priority.length !== 1 || char < 65 || char > 90) {
				throw new Error('Invalid Priority');
			}
		}
		this.#priority = priority;
	}

	/**
	 * Remove the priority from this task.
	 */
	clearPriority() {
		this.#priority = null;
	}

	/**
	 * Get the creation date of this task.
	 *
	 * @returns The creation date, or null if not set.
	 */
	created(): Date | null {
		return this.#created;
	}

	/**
	 * Get the creation date as string, or an empty string if not set.
	 *
	 * @returns The creation date as a string formatted for todo.txt (YYYY-MM-DD)
	 */
	createdToString(): string {
		return dateString(this.#created);
	}

	/**
	 * Set the created date for the task. Passing `null` or no argument clears the created date.
	 *
	 * **Side Effect**
	 *
	 * Clearing the created date will also unset the completed date.
	 *
	 * @param date
	 * @throws An Error when the date is provided as a string and is invalid.
	 */
	setCreated(date: Date | string | null = null) {
		if (date === null) {
			this.clearCreated();
		} else if (date instanceof Date) {
			this.#created = <Date>date;
		} else {
			this.#created = dateFromString(<string>date);
		}
	}

	/**
	 * Remove the created date from the task.
	 *
	 * **Side Effect**
	 *
	 * Clearing the created date will also unset the completed date.
	 */
	clearCreated() {
		this.#created = null;
		this.#completed = null;
	}

	/**
	 * Get the completed date of this task.
	 *
	 * @returns The completed date, or null if not set.
	 */
	completed(): Date | null {
		return this.#completed;
	}

	/**
	 * Get the completed date as string, or an empty string if not set.
	 *
	 * @returns The completed date as a string formatted for todo.txt (YYYY-MM-DD)
	 */
	completedToString(): string {
		return dateString(this.#completed);
	}

	/**
	 * Set the completed date for the task. Passing `null` or no argument clears the completed date.
	 *
	 * **Side Effect**
	 *
	 * Setting completed will set complete to true.
	 *
	 * @param date
	 * @throws An Error when the date is provided as a string and is invalid.
	 * @throws An Error when the created date is not set.
	 */
	setCompleted(date: Date | string | null = null) {
		if (date === null) {
			this.clearCompleted();
		} else {
			if (this.#created === null) {
				throw new Error('Can not set completed date without a created date set.');
			}
			if (date instanceof Date) {
				this.#completed = <Date | null>date;
			} else {
				this.#completed = dateFromString(<string>date);
			}
			this.#complete = true;
		}
	}

	/**
	 * Remove the completed date from the task.
	 */
	clearCompleted() {
		this.#completed = null;
	}

	/**
	 * Get the body of the task.
	 * @returns The body portion of the task.
	 */
	body(): string {
		return this.#body.join(" ");
	}

	/**
	 * Parse and set the body and body elements.
	 *
	 * **Side Effect**
	 *
	 * This will clear and re-load contexts, projects and extensions.
	 *
	 * @param text A todo.txt description string.
	 */
	setBody(text: string) {
		let start = 0;
		const tags = (text.match(rTags) || []).map((tag): [string, number] => {
			const tagStart = text.indexOf(tag, start);
			if (tagStart != -1) {
				start = tagStart + tag.length;
			}
			return [tag, tagStart];
		});

		this.#body = [];
		this.#contexts = [];
		this.#projects = [];
		this.#extensions = new Map();

		for (const str of text.split(" ")) {
			if (str.match(rTags)) {
				if (!(str.startsWith("@") || str.startsWith("+"))) {
					const split = str.split(':', 2);
					this.addExtension(split[0], split[1]);
					continue;
				}
			}
			this.#body.push(str);
		}

		// TODO refactor Project and Context to not use span logic
		tags.forEach(([tag, start]) => {
			if (tag[0] == '@') {
				this.#contexts.push({ tag: tag.slice(1), start });
			} else if (tag[0] == '+') {
				this.#projects.push({ tag: tag.slice(1), start });
			}
		});
	}

	/**
	 * Get all of the context tags on the task.
	 *
	 * @returns Context tags, without the `@`
	 */
	contexts(): string[] {
		return [...new Set(this.#contexts.map(({ tag }) => tag))];
	}

	/**
	 * Add a new context to the task. Will append to the end.
	 * If the context is already present, it will not be added.
	 *
	 * @param tag A valid context, without the `@`
	 */
	addContext(tag: string) {
		if (!this.#contexts.some((v) => tag === v.tag)) {
			this.#contexts.push({ tag, start: this.#body.length });
			this.#body.push("@" + tag);
		}
	}

	/**
	 * Remove a context from the task, if present.
	 *
	 * @param tag A valid context, without the `@`
	 */
	// removeContext(tag: string) {
	// 	const body = removeTag(this.#body, this.#contexts, tag);
	// 	if (body !== null) {
	// 		this.#body = body;
	// }

	/**
	 * Get all of the project tags on the task.
	 *
	 * @returns Project tags, without the `+`
	 */
	projects(): string[] {
		return [...new Set(this.#projects.map(({ tag }) => tag))];
	}

	/**
	 * Add a new project to the task. Will append to the end.
	 * If the project is already present, it will not be added.
	 *
	 * @param tag A valid project, without the `+`
	 */
	addProject(tag: string) {
		if (!this.#projects.some((v) => tag === v.tag)) {
			this.#projects.push({ tag, start: this.#body.length });
			this.#body.push("+" + tag); 
		}
	}

	/**
	 * Remove a project from the task, if present.
	 *
	 * @param tag A valid project, without the `+`
	 */
	// removeProject(tag: string) {
	// 	const body = removeTag(this.#body, this.#projects, tag);
	// 	if (body !== null) {
	// 		this.#body = body;
	// }

	/**
	 * Get all of the extensions on the task.
	 *
	 * @returns Extensions iterator
	 */
	extensions() {
		return this.#extensions.entries();
	}

	setExtension(key: string, value: string) {
		let found = false;
		const str = key + ":" + value;

		for (const [k, indices] of this.#extensions.entries()) {
			if (key === k) {
				indices.forEach(idx => {
					this.#body[idx] = str;
				});
				found = true;
			}
		}

		if (!found) {
			this.addExtension(key, value);
		}
	}

	addExtension(key: string, value: string) {
		this.#body.push(key + ":" + value);
		const indices = this.#extensions.get(key);
		if (indices) {
			indices.push(this.#body.length - 1);
		} else {
			this.#extensions.set(key, [this.#body.length - 1]);
		}
	}

	removeExtension(key: string, value?: string, indices?: number[]) {
		const idxs = this.#extensions.get(key);
		if (!idxs) return;
		for (const [i, idx] of idxs.entries()) {
			if (
				(!value && !indices)
				|| (value && this.#body[idx] === value)
				|| (indices && indices.findIndex(i => i === idx) > -1)
			) {
				// @ts-ignore Marking for deletion
				this.#body[idx] = null;
				// @ts-ignore Marking for deletion
				idxs[i] = null;
			}
		}
		this.#extensions.set(key, idxs.filter(o => o !== null));
		if (!this.#extensions.get(key)?.length) {
			this.#extensions.delete(key);
		}
		const newBody = this.#body.filter(o => o !== null);
		if (newBody.length !== this.#body.length) {
			this.setBody(newBody.join(" "));
		}
	}

	getExtensions(key:string): { value: string, index: number }[] {
		return this.#extensions.get(key)?.map(index => {
			return { value: this.#body[index].split(":", 2)[1], index };
		}) || [];
	}
}

function dateString(date: Date | null): string {
	if (date !== null) {
		return (
			date.getFullYear() +
			'-' +
			(date.getMonth() + 1 < 10 ? '0' : '') +
			(date.getMonth() + 1) +
			'-' +
			(date.getDate() < 10 ? '0' : '') +
			date.getDate()
		);
	}
	return '';
}

// TODO function cutOutSpans(body: string, spans: Span[]): string {
// 	spans.forEach(({ start, end }) => {
// 		body = [body.slice(0, start - 1), body.slice(end)].join('');
// 	});

// 	return body;
// }

// function removeTag(body: string, tags: TrackedTag[], tag: string): string | null {
// 	const spans = tags
// 		.filter((ctx) => ctx.tag === tag)
// 		.map((ctx) => {
// 			return { start: ctx.start, end: ctx.start + ctx.tag.length + 1 };
// 		})
// 		.sort((a, b) => (a.start < b.start ? 1 : -1));

// 	if (spans.length === 0) {
// 		return null;
// 	}

// 	return cutOutSpans(body, spans);
// }
