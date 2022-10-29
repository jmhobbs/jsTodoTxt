import state from '../state';
import Format from '../util/format';

export default function Add(item: string): void {
	const listItem = state.todo.add(item);
	state.sink.writeLine(Format(state.chalk, listItem));
	state.sink.writeLine(`TODO: ${listItem.index} added.`);
}
