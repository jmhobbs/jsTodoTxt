describe( "TodoTxtItem", function () {

	var target = {
		raw: "x 2011-07-31 This is a task.",
		render: "x 2011-07-31 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: true,
		completed: "2011-07-31",
		date: null,
		contexts: null,
		projects: null
	};

	var extremity1 = {
		raw: "x 2013-12-01 This is a task.",
		render: "x 2013-12-01 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: true,
		completed: "2013-12-01",
		date: null,
		contexts: null,
		projects: null
	};

	var extremity2 = {
		raw: "x 2014-01-01 This is a task.",
		render: "x 2014-01-01 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: true,
		completed: "2014-01-01",
		date: null,
		contexts: null,
		projects: null
	};

	var invalid = [
		// Date is required
		{ raw: "x Task text", text: "x Task text" }
	];

	describe( "when given a completed task", TodoTxtItemHelper( target ) );
	describe( "when given a completed task in December", TodoTxtItemHelper( extremity1 ) );
	describe( "when given a completed task in January", TodoTxtItemHelper( extremity2 ) );

	describe( "when given an invalid completed string", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw );
				expect( item.completed ).toEqual( null );
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );

} );
