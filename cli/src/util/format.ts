import chalk from 'chalk';
import { ListItem } from 'jstodotxt';

export default function Format(chalk: chalk.Chalk, listItem: ListItem): string {
	let lineStr = `${listItem.index + 1} ${listItem.item.toString()}`;
	if (listItem.item.priority() !== null) {
		switch (listItem.item.priority()) {
			case 'A':
				lineStr = chalk.bold.yellow(lineStr);
				break;
			case 'B':
				lineStr = chalk.green(lineStr);
				break;
			case 'C':
				lineStr = chalk.bold.blue(lineStr);
				break;
			default:
				lineStr = chalk.bold.white(lineStr);
				break;
		}
	}
	return lineStr;
}
