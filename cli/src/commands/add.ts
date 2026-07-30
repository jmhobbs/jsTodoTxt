import state from '../state.js';
import Format from '../util/format.js';

export default function Add(item: string): void {
	const listItem = state.todo.add(item);
	state.sink.writeLine(Format(state.chalk, listItem));
	state.sink.writeLine(`TODO: ${listItem.index} added.`);
}
