describe( "TodoTxtItem", function () {

	var target = {
		raw: "2011-07-31 This is a task.",
		render: "2011-07-31 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: "2011-07-31",
		contexts: null,
		projects: null
	};

	var extremity1 = {
		raw: "2013-12-31 This is a task.",
		render: "2013-12-31 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: "2013-12-31",
		contexts: null,
		projects: null
	};

	var extremity2 = {
		raw: "2014-01-01 This is a task.",
		render: "2014-01-01 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: "2014-01-01",
		contexts: null,
		projects: null
	};


	var invalid = [
		// Date must immediately follow priority
		{ raw: "(A) Task text 2011-07-31", text: "Task text 2011-07-31" },
		// The first date on completed tasks belongs to the completion  
		{ raw: "x 2011-07-31 Task text", text: "Task text" }
	];

	describe( "when given a dated task", TodoTxtItemHelper( target ) );
	describe( "when given a dated task in December", TodoTxtItemHelper( extremity1 ) );
	describe( "when given a dated task in January", TodoTxtItemHelper( extremity2 ) );

	describe( "when given an invalid date", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw );
				expect( item.date ).toEqual( null );
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );


} );
