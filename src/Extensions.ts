import { Item } from './Item';

export interface Extension {}

export type ExtensionFactory = (item: Item, key: string, value: string) => Extension|null;

const register = new Map<string, ExtensionFactory>();

export function RegisterExtension(keys: string[], parsingFunction:ExtensionFactory) {
	for (const key of keys) {
		if(register.has(key)) {
			throw new Error(`An extension handler for "${key}" is already registered.`);
		}
		register.set(key, parsingFunction);
	}
}

export function NewExtension(item: Item, key: string, value: string):Extension|null {
	const fn = register.get(key);
	if(typeof fn !== 'undefined') {
		return fn(item, key, value);
	}
	return null;
}
