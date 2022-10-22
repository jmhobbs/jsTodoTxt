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

interface TrackedExtension {
	key: string;
	value: string;
	start: number;
}

type TrackedContext = TrackedTag;
type TrackedProject = TrackedTag;

function parseBody(body: string) {
	let start = 0;
	const tags = (body.match(rTags) || []).map((tag): [string, number] => {
		const tagStart = body.indexOf(tag, start);
		if (tagStart != -1) {
			start = tagStart + tag.length;
		}
		return [tag, tagStart];
	});

	const contexts: TrackedContext[] = [];
	const projects: TrackedProject[] = [];
	const extensions: TrackedExtension[] = [];

	tags.forEach(([tag, start]) => {
		if (tag[0] == '@') {
			contexts.push({ tag: tag.slice(1), start });
		} else if (tag[0] == '+') {
			projects.push({ tag: tag.slice(1), start });
		} else {
			const split = tag.split(':', 2);
			extensions.push({ key: split[0], value: split[1], start });
		}
	});

	return { contexts, projects, extensions };
}

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
	#body = '';
	#contexts: TrackedContext[] = [];
	#projects: TrackedProject[] = [];
	#extensions: TrackedExtension[] = [];

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
		this.#body = '';
		this.#contexts = [];
		this.#projects = [];
		this.#extensions = [];

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
			this.#body,
		];

		return parts.filter((v) => v !== null && v !== '').join(' ');
	}

	/**
	 * Generate the full todo.txt line of this Item, as well as spans describing the
	 * location of all of it's component parts.
	 */
	toAnnotatedString(): AnnotatedItem {
		const str = this.toString();
		const headerLength = str.length - this.#body.length;

		function tagRemap(prefix: string) {
			return function (tag: TrackedTag): Tag {
				const fullTag = [prefix, tag.tag].join('');
				return {
					string: fullTag,
					span: {
						start: tag.start + headerLength,
						end: tag.start + headerLength + fullTag.length,
					},
				};
			};
		}

		function extensionsRemap(ext: TrackedExtension): Extension {
			const tag = `${ext.key}:${ext.value}`;
			return {
				string: tag,
				parsed: {
					key: ext.key,
					value: ext.value,
				},
				span: {
					start: ext.start + headerLength,
					end: ext.start + headerLength + tag.length,
				},
			};
		}

		return {
			string: str,
			contexts: this.#contexts.map(tagRemap('@')),
			projects: this.#projects.map(tagRemap('+')),
			extensions: this.#extensions.map(extensionsRemap),
		};
	}

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
		return this.#body;
	}

	/**
	 * Parse and set the body and body elements.
	 *
	 * **Side Effect**
	 *
	 * This will clear and re-load contexts, projects and extensions.
	 *
	 * @param body A todo.txt description string.
	 */
	setBody(body: string) {
		const { contexts, projects, extensions } = parseBody(body);
		this.#body = body;
		this.#contexts = contexts;
		this.#projects = projects;
		this.#extensions = extensions;
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
		if (this.#contexts.filter((v) => tag === v.tag).length === 0) {
			this.#contexts.push({ tag, start: this.#body.length });
			this.#body = [this.#body, `@${tag}`].join(' ');
		}
	}

	/**
	 * Remove a context from the task, if present.
	 *
	 * @param tag A valid context, without the `@`
	 */
	removeContext(tag: string) {
		const body = removeTag(this.#body, this.#contexts, tag);
		if (body !== null) {
			this.#body = body;

			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		}
	}

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
		if (this.#projects.filter((v) => tag === v.tag).length === 0) {
			this.#projects.push({ tag, start: this.#body.length });
			this.#body = [this.#body, `+${tag}`].join(' ');
		}
	}

	/**
	 * Remove a project from the task, if present.
	 *
	 * @param tag A valid project, without the `+`
	 */
	removeProject(tag: string) {
		const body = removeTag(this.#body, this.#projects, tag);
		if (body !== null) {
			this.#body = body;

			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		}
	}

	/**
	 * Get all of the project tags on the task.
	 *
	 * @returns Project tags, without the `+`
	 */
	extensions() {
		return this.#extensions.map(({ key, value }) => {
			return { key, value };
		});
	}

	setExtension(key: string, value: string) {
		let found = false;

		this.#extensions.forEach((ext) => {
			if (ext.key === key) {
				const prefix = this.#body.slice(0, ext.start);
				const suffix = this.#body.slice(ext.start + ext.key.length + ext.value.length + 1);
				if (found) {
					this.#body = [
						prefix.slice(0, prefix.length - 1), // take the extra space off the end of prefix
						suffix,
					].join('');
				} else {
					this.#body = [prefix, `${key}:${value}`, suffix].join('');
				}
				found = true;
			}
		});

		if (found) {
			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		} else {
			this.addExtension(key, value);
		}
	}

	addExtension(key: string, value: string) {
		this.#extensions.push({ key, value, start: this.#body.length });
		this.#body = [this.#body, `${key}:${value}`].join(' ');
	}

	removeExtension(key: string, value: string | null = null) {
		const spans = this.#extensions
			.filter((ext) => {
				return ext.key === key && (value === null || ext.value === value);
			})
			.map((ext) => {
				return { start: ext.start, end: ext.start + ext.key.length + ext.value.length + 1 };
			})
			.sort((a, b) => (a.start < b.start ? 1 : -1));

		if (spans.length > 0) {
			this.#body = cutOutSpans(this.#body, spans);

			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		}
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

function cutOutSpans(body: string, spans: Span[]): string {
	spans.forEach(({ start, end }) => {
		body = [body.slice(0, start - 1), body.slice(end)].join('');
	});

	return body;
}

function removeTag(body: string, tags: TrackedTag[], tag: string): string | null {
	const spans = tags
		.filter((ctx) => ctx.tag === tag)
		.map((ctx) => {
			return { start: ctx.start, end: ctx.start + ctx.tag.length + 1 };
		})
		.sort((a, b) => (a.start < b.start ? 1 : -1));

	if (spans.length === 0) {
		return null;
	}

	return cutOutSpans(body, spans);
}
