describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task. +Project",
		render: "This is a task. +Project",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: null,
		projects: [ "Project" ]
	};

	var invalid = [
		// Spaces are not allowed between the + and the project
		{ raw: "This is a task + Project", text: "This is a task + Project" },
		// Whitespace is required in front of the project listing
		{ raw: "This is not a priority 5+7", text: "This is not a priority 5+7" }
	];

	describe( "when given a project task", TodoTxtItemHelper( target ) );

	describe( "when given an invalid project string", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw );
				expect( item.projects ).toEqual( null );
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );

	describe( "when given multiple projects", function () {
		it( "should collect them all", function () {
			var item = new TodoTxtItem( "Multiple projects +One +Two" );
			expect( item.projects ).toEqual( [ "One", "Two"]  );
		} );
	} );

} );
