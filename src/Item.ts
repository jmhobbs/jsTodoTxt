const rTodo = /^((x) )?(\(([A-Z])\) )?((\d{4}-\d{2}-\d{2}) )?(.*)$/;
const rTags = /([^\s:]+:[^\s:]+|[+@]\S+)/g;

interface Tag {
	tag: string
	start: number
	end?: number
}

interface Extension {
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
	#date: Date | null = null;
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
		if(typeof match[6] !== 'undefined') {
			this.#date = dateFromString(match[6]);
		}
		this.setBody(match[7]);
	}

	toString() {
		const parts = [
			(this.#complete) ? 'x': '',
			(this.#priority) ? `(${this.#priority})` : '',
			this.dateString(),
			this.#body,
		];

		return parts.filter((v) => v !== null && v !== '').join(' ');
	}

	toAnnotatedString():AnnotatedItem {
		const str = this.toString()
		const headerLength = str.length - this.#body.length;

		function tagRemap (tag:Tag):Tag {
			return {
				tag: tag.tag,
				start: tag.start + headerLength,
				end: tag.start + headerLength + tag.tag.length + 1
			};
		};

		function extensionsRemap (ext:Extension):Extension {
			return {
				key: ext.key,
				value: ext.value,
				start: ext.start + headerLength,
				end: ext.start + headerLength + `${ext.key}:${ext.value}`.length + 1
			};
		};

		return {
			string: str,
			contexts: this.#contexts.map(tagRemap),
			projects: this.#projects.map(tagRemap),
			extensions: this.#extensions.map(extensionsRemap)
		}
	}

	completed() {
		return this.#complete;
	}

	setCompleted(completed: boolean) {
		this.#complete = completed;
	}

	priority() {
		return this.#priority;
	}

	setPriority(priority:string|null=null) {
		// todo: validate priority
		this.#priority = priority;
	}

	date() {
		return this.#date;
	}

	dateString() {
		if(this.#date) {
			return this.#date.getFullYear() + '-' +
				( ( this.#date.getMonth() + 1 < 10 ) ? '0' : '' ) + ( this.#date.getMonth() + 1 ) + '-' +
				( ( this.#date.getDate() < 10 ) ? '0' : '' ) + this.#date.getDate();
		}
		return '';
	};

	setDate(date: Date|string|null=null) {
		if(date === null || date instanceof Date) {
			this.#date = <Date|null> date;
		} else {
			// todo: validate date string
			this.#date = dateFromString(<string> date);
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
