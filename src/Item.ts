const rTodo = /^((x) )?(\(([A-Z])\) )?((\d{4}-\d{2}-\d{2}) )?(.*)$/;
const rTags = /([^\s:]+:[^\s:]+|[+@]\S+)/g;

interface Context {
	tag: string
	offset: number
}

interface Project {
	tag: string
	offset: number
}

interface Extension {
	tag: string
	value: string
	offset: number
}

type Priority = string | null;

export default class Item {
	#complete: boolean = false;
	#priority: Priority = null;
	#date: Date | null = null;
	#body: string = '';
	#contexts = new Array<Context>();
	#projects = new Array<Project>();;
	#extensions = new Array<Extension>();

	constructor(line: string) {
		const match = rTodo.exec(line);
		if(match === null) {
			return;
		}

		this.#complete = match[2] === 'x'
		this.#priority = match[4] || null;
		if(typeof match[6] !== 'undefined') {
			this.#date = new Date(
				parseInt(match[6].slice(0, 4), 10),
				parseInt(match[6].slice(5, 7), 10) - 1, // months are zero indexed
				parseInt(match[6].slice(8), 10)
			);
		}
		this.#body = match[7];

		let offset = 0;
		const tags = (this.#body.match(rTags) || []).map((tag):[string, number] => {
			const tagOffset = this.#body.indexOf(tag, offset);
			if(tagOffset != -1) { offset = tagOffset + tag.length; }
			return [tag, tagOffset];
		});

		tags.forEach(([tag, offset]) => {
			if(tag[0] == '+') {
				this.#contexts.push({ tag: tag.slice(1), offset });
			} else if (tag[0] == '@'){
				this.#projects.push({ tag: tag.slice(1), offset });
			} else {
				const split = tag.split(':', 2)
				this.#extensions.push({tag: split[0], value: split[1], offset});
			}
		});
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

	completed() {
		return this.#complete;
	}

	priority() {
		return this.#priority;
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

	body() {
		return this.#body;
	}

	contexts() {
		return this.#contexts.map(({tag}) => tag);
	}

	projects() {
		return this.#projects.map(({tag}) => tag);
	}

	extensions() {
		return this.#extensions.map(({tag, value}) => { return {tag, value} });
	}
}
