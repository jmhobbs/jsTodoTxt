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
	};

	describe( "when given a context bound task", TodoTxtItemHelper( target ) );

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
