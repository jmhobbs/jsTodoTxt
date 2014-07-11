describe( "TodoTxtItem", function () {

	var target = {
		raw: "(A) This is a task.",
		render: "(A) This is a task.",
		text: "This is a task.",
		priority: "A",
		complete: false,
		completed: null,
		date: null,
		contexts: null,
		projects: null
	};

	var invalid = [
		// Lower case is invalid
		{ raw: "(a) Task text", text: "(a) Task text" },
		// Numbers aren't valid
		{ raw: "(0) Task text", text: "(0) Task text" },
		// Only one letter priority
		{ raw: "(AB) Task text", text: "(AB) Task text" },
		// It's got to be up front
		{ raw: "Task text (A)", text: "Task text (A)" }
	];

	describe( "when given a prioritized task", TodoTxtItemHelper( target ) );

	describe( "when given an invalid priority string", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw );
				expect( item.priority ).toEqual( null );
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );

} );
