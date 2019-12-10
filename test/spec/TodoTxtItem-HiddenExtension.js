describe( "TodoTxtItem with HiddenExtension", function() {
	var target = {
		raw: "This is a task. h:1",
		render: "This is a task. h:1",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: null,
		projects: null,
        hidden: true
	};

	var invalid = [
		// Date is required
		{ raw: "Task text h:0", text: "Task text h:0" },
		{ raw: "Task text h:", text: "Task text h:" },
		{ raw: "Task text hid:1", text: "Task text hid:1" },
	];

	describe( "when given a hidden task", function () {

		var item;

		beforeEach( function () {
			item = new TodoTxtItem( target.raw, [ new HiddenExtension() ]);
		} );

		it( "should have the correct text", function () {
			expect( item.text ).toEqual( target.text );
		} );

		it( "should have the correct priority", function () {
			expect( item.priority ).toEqual( target.priority );
		} );

		it( "should have the correct contexts", function () {
			expect( item.contexts ).toEqual( target.contexts );
		} );

		it( "should have the correct projects", function () {
			expect( item.projects ).toEqual( target.projects );
		} );

		it( "should have the correct date", function () {
			expect( item.dateString() ).toEqual( target.date );
		} );

		it( "should have the correct complete state", function () {
			expect( item.complete ).toEqual( target.complete );
		} );

		it( "should have the correct completed date", function () {
			expect( item.completedString() ).toEqual( target.completed );
		} );

		it( "should render correctly", function () {
			expect( item.toString() ).toEqual( target.render );
		} );

		it( "should be hidden", function() {
			expect( item.h ).toEqual( target.hidden );
		} );

	} );

	describe( "when given an invalid hidden string", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw, [ new HiddenExtension() ] );
				expect( item.h ).toBeUndefined();
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );
} )
