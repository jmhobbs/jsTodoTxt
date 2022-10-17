const rTodo = /^((x) )?(\(([A-Z])\) )?((\d{4}-\d{2}-\d{2}) )?(.*)$/;
const rTags = /([^\s:]+:[^\s:]+|[+@]\S+)/g;

export default class Item {
	#complete = false;
	#priority = null;
	#date = null;
	#body = '';
	#contexts = [];
	#projects = [];
	#extensions = [];

	constructor(line) {
		const match = rTodo.exec(line);
		this.#complete = match[2] === 'x'
		this.#priority = match[4] || null;
		if(typeof match[6] !== 'undefined') {
			this.#date = new Date(
				match[6].slice(0, 4),
				parseInt(match[6].slice(5, 7), 10) - 1, // months are zero indexed
				match[6].slice(8)
			);
		}
		this.#body = match[7];

		let offset = 0;
		const tags = (this.#body.match(rTags) || []).map((tag) => {
			const tagOffset = this.#body.indexOf(tag, offset);
			if(tagOffset != -1) { offset = tagOffset + tag.length; }
			return [tag, tagOffset];
		});

		tags.forEach(([tag, offset]) => {
			if(tag[0] == '+') {
				this.#contexts.push([tag.slice(1), offset]);
			} else if (tag[0] == '@'){
				this.#projects.push([tag.slice(1), offset]);
			} else {
				this.#extensions.push([...tag.split(':', 2), offset]);
			}
		});

		return this;
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
		return this.#contexts.map(([tag]) => tag);
	}

	projects() {
		return this.#projects.map(([tag]) => tag);
	}

	extensions() {
		return this.#extensions.map(([tag, value]) => [tag, value]);
	}
}
