<script>
	import { List as TodoList } from 'jstodotxt';
	import List from './lib/List.svelte';

	const list = new TodoList(
		[
			'x Write an example app using List +demo',
			'Have multiple items in the +demo',
			'(A) Thank Mom for the meatballs @phone',
			'(B) Schedule Goodwill pickup +GarageSale @phone',
			'Post signs around the neighborhood +GarageSale',
			'@GroceryStore Eskimo pies',
			'(A) Call Mom',
			'2011-03-02 Document +TodoTxt task format',
			"x 2011-03-02 2011-03-01 Review Tim's pull request +TodoTxtTouch @github",
		].join('\n')
	);

	let items = list.items();

	function filter() {
		const project = document.getElementById('project').value;
		const context = document.getElementById('context').value;

		const f = {};
		if (project !== '') {
			f.projectsOr = [project];
		}
		if (context !== '') {
			f.contextsOr = [context];
		}

		items = list.filter(f).map((li) => li.item);
	}
</script>

<main>
	<h1>todo.txt</h1>

	<form>
		<label>
			Project
			<select id="project" on:change={filter}>
				<option />
				{#each list.projects() as project}
					<option>{project}</option>
				{/each}
			</select>
		</label>
		<label>
			Context
			<select id="context" on:change={filter}>
				<option />
				{#each list.contexts() as context}
					<option>{context}</option>
				{/each}
			</select>
		</label>
	</form>

	<List list={items} />
</main>

<style>
	form {
		margin: 1.5rem 0;
	}
	label {
		margin: 0 1rem 0 0;
	}
</style>
