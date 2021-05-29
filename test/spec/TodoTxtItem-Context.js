describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task. @Home",
		render: "This is a task. @Home",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: [ "Home" ],
		projects: null
	},
	leading_target = {
		raw: "@Home This is a task.",
		render: "This is a task. @Home",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: [ "Home" ],
		projects: null
	},
	target_with_at_and_context = {
		raw: "This task contains user@example.com addr. @work",
		render: "This task contains user@example.com addr. @work",
		text: "This task contains user@example.com addr.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: [ "work" ],
		projects: null
	};

	describe( "when given a context bound task", TodoTxtItemHelper( target ) );

	describe( "when given a leading context bound task", TodoTxtItemHelper( leading_target ) );

	describe( "when given a task containing @ and a context", TodoTxtItemHelper( target_with_at_and_context ) );

	var invalid = [
		// Whitespace is required in front of the context
		{ raw: "This is not a context john@example.com", text: "This is not a context john@example.com" }
	];

	describe( "when given an invalid project string", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw );
				expect( item.contexts ).toEqual( null );
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );

} );
