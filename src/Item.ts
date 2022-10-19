const rTodo = /^((x) )?(\(([A-Z])\) )?(((\d{4}-\d{2}-\d{2}) (\d{4}-\d{2}-\d{2})|(\d{4}-\d{2}-\d{2})) )?(.*)$/;
const rTags = /([^\s:]+:[^\s:]+|[+@]\S+)/g;

interface Tag {
	tag: string
	start: number
	end?: number
}

interface Extension {
	tag?: string
	key: string
	value: string
	start: number
	end?: number
}

type Context = Tag;
type Project = Tag;

type Priority = string | null;

interface AnnotatedItem {
	string: string
	// todo: date, priority, etc
	contexts: Context[]
	projects: Project[]
	extensions: Extension[]
}

function parseBody(body: string) {
	let start = 0;
	const tags = (body.match(rTags) || []).map((tag):[string, number] => {
		const tagStart = body.indexOf(tag, start);
		if(tagStart != -1) { start = tagStart + tag.length; }
		return [tag, tagStart];
	});


	const contexts: Context[] = [];
	const projects: Project[] = [];
	const extensions: Extension[] = [];

	tags.forEach(([tag, start]) => {
		if(tag[0] == '@') {
			contexts.push({ tag: tag.slice(1), start });
		} else if (tag[0] == '+'){
			projects.push({ tag: tag.slice(1), start });
		} else {
			const split = tag.split(':', 2)
			extensions.push({key: split[0], value: split[1], start});
		}
	});

	return { contexts, projects, extensions }
}

function dateFromString(input: string):Date {
	return new Date(
		parseInt(input.slice(0, 4), 10),
		parseInt(input.slice(5, 7), 10) - 1, // months are zero indexed
		parseInt(input.slice(8), 10)
	);
}

export default class Item {
	#complete: boolean = false;
	#priority: Priority = null;
	#created: Date | null = null;
	#completed: Date | null = null;
	#body: string = '';
	#contexts: Context[] = [];
	#projects: Project[] = [];
	#extensions: Extension[] = [];

	constructor(line: string) {
		const match = rTodo.exec(line);
		if(match === null) {
			return;
		}

		this.#complete = match[2] === 'x'
		this.#priority = match[4] || null;

		if(typeof match[9] !== 'undefined') {
			this.#created = dateFromString(match[9]);
		} else if(typeof match[7] !== 'undefined') {
			this.#completed = dateFromString(match[7]);
			this.#created = dateFromString(match[8]);
		}

		this.setBody(match[10]);
	}

	toString() {
		const parts = [
			(this.#complete) ? 'x': '',
			(this.#priority) ? `(${this.#priority})` : '',
			this.completedString(),
			this.createdString(),
			this.#body,
		];

		return parts.filter((v) => v !== null && v !== '').join(' ');
	}

	toAnnotatedString():AnnotatedItem {
		const str = this.toString()
		const headerLength = str.length - this.#body.length;

		function tagRemap (prefix:string) {
			return function(tag:Tag):Tag {
				const fullTag = [prefix, tag.tag].join('');
				return {
					tag: fullTag,
					start: tag.start + headerLength,
					end: tag.start + headerLength + fullTag.length
				};
			};
		}

		function extensionsRemap (ext:Extension):Extension {
			const tag = `${ext.key}:${ext.value}`;
			return {
				tag,
				key: ext.key,
				value: ext.value,
				start: ext.start + headerLength,
				end: ext.start + headerLength + tag.length
			};
		};

		return {
			string: str,
			contexts: this.#contexts.map(tagRemap('@')),
			projects: this.#projects.map(tagRemap('+')),
			extensions: this.#extensions.map(extensionsRemap)
		}
	}

	complete() {
		return this.#complete;
	}

	setComplete(completed: boolean) {
		this.#complete = completed;
	}

	priority() {
		return this.#priority;
	}

	setPriority(priority:string|null=null) {
		// todo: validate priority
		this.#priority = priority;
	}

	created() {
		return this.#created;
	}

	createdString():string {
		return dateString(this.#created);
	};

	setCreated(date: Date|string|null=null) {
		if(date === null) {
			this.#created = null;
			this.#completed = null;
		} else if (date instanceof Date) {
			this.#created = <Date> date;
		} else {
			// todo: validate date string
			this.#created = dateFromString(<string> date);
		}
	}

	completed() {
		return this.#completed;
	}

	completedString():string {
		return dateString(this.#completed);
	};

	setCompleted(date: Date|string|null=null) {
		if(date === null ) {
			this.#completed = null;
		} else {
			// todo: error if created is not set
			if(date instanceof Date) {
				this.#completed = <Date|null> date;
			} else {
				// todo: validate date string
				this.#completed = dateFromString(<string> date);
			}
			this.#complete = true;
		}
	}

	body() {
		return this.#body;
	}

	setBody(body:string) {
		const { contexts, projects, extensions } = parseBody(body);
		this.#body = body;
		this.#contexts = contexts;
		this.#projects = projects;
		this.#extensions = extensions;
	}

	contexts() {
		return this.#contexts.map(({tag}) => tag);
	}

	addContext(tag: string) {
		if(this.#contexts.filter((v) => tag === v.tag).length > 0) {
			return
		}
		this.#contexts.push({tag, start: this.#body.length});
		this.#body = [this.#body, `@${tag}`].join(' ');
	}

	removeContext(tag: string) {
		const body = removeTag(this.#body, this.#contexts, tag);
		if(body !== null) {
			this.#body = body;

			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		}
	}

	projects() {
		return this.#projects.map(({tag}) => tag);
	}

	addProject(tag: string) {
		if(this.#projects.filter((v) => tag === v.tag).length > 0) {
			return
		}
		this.#projects.push({tag, start: this.#body.length});
		this.#body = [this.#body, `+${tag}`].join(' ');
	}

	removeProject(tag: string) {
		const body = removeTag(this.#body, this.#projects, tag);
		if(body !== null) {
			this.#body = body;

			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		}
	}

	extensions() {
		return this.#extensions.map(({key, value}) => { return {key, value} });
	}

	setExtension(key: string, value: string) {
		let found: boolean = false;

		this.#extensions.forEach(ext => {
			if(ext.key === key) {
				const prefix = this.#body.slice(0, ext.start);
				const suffix = this.#body.slice(ext.start + ext.key.length + ext.value.length + 1);
				if(found) {
					this.#body = [
						prefix.slice(0, prefix.length - 1), // take the extra space off the end of prefix
						suffix
					].join('');
				} else {
					this.#body = [
						prefix,
						`${key}:${value}`,
						suffix
					].join('');
				}
				found = true;
			}
		});

		if(found) {
			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		} else {
			this.addExtension(key, value);
		}
	}

	addExtension(key: string, value: string) {
		this.#extensions.push({key, value, start: this.#body.length});
		this.#body = [this.#body, `${key}:${value}`].join(' ');
	}

	removeExtension(key: string, value: string|null=null) {
		const spans = this.#extensions
			.filter(ext => {
				return ext.key === key && (value === null || ext.value === value)
			})
			.map(ext => { return {start: ext.start, end: ext.start + ext.key.length + ext.value.length + 1} })
			.sort((a, b) => (a.start < b.start) ? 1 : -1);

		if(spans.length > 0) {
			this.#body = cutOutSpans(this.#body, spans);

			const { contexts, projects, extensions } = parseBody(this.#body);
			this.#contexts = contexts;
			this.#projects = projects;
			this.#extensions = extensions;
		}
	}
}

function dateString(date:Date|null):string {
	if(date !== null) {
		return date.getFullYear() + '-' +
			( ( date.getMonth() + 1 < 10 ) ? '0' : '' ) + ( date.getMonth() + 1 ) + '-' +
			( ( date.getDate() < 10 ) ? '0' : '' ) + date.getDate();
	}
	return '';
}

interface Span {
	start: number
	end: number
}

function cutOutSpans(body: string, spans: Span[]):string {
	spans.forEach(({start, end}) => {
		body = [
			body.slice(0, start - 1),
			body.slice(end)
		].join('');
	})

	return body;
}

function removeTag(body: string, tags: Tag[], tag: string):string|null {
	const spans = tags
		.filter(ctx => ctx.tag === tag)
		.map(ctx => { return {start: ctx.start, end: ctx.start + ctx.tag.length + 1} })
		.sort((a, b) => (a.start < b.start) ? 1 : -1);

	if(spans.length === 0) {
		return null;
	}

	return cutOutSpans(body, spans);
}
