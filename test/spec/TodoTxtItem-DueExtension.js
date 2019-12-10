describe( "TodoTxtItem with DueExtension", function() {
	var target = {
		raw: "This is a task. due:2016-12-31",
		render: "This is a task. due:2016-12-31",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: null,
		projects: null,
		due: "2016-12-31"
	};

	var invalid = [
		// Date is required
		{ raw: "Task text due:", text: "Task text due:" },
		{ raw: "Task text due:2016-", text: "Task text due:2016-" }
	];

	function dateToString(date) {
		return date.getFullYear() + '-' +
				( ( date.getMonth() + 1 < 10 ) ? '0' : '' ) + ( date.getMonth() + 1 ) + '-' +
				( ( date.getDate() < 10 ) ? '0' : '' ) + date.getDate();
	}

	describe( "when given a task with a due date", function () {

		var item;

		beforeEach( function () {
			item = new TodoTxtItem( target.raw, [ new DueExtension() ]);
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

		it( "should have the correct due date", function() {
			expect( item.due instanceof Date ).toBe( true );
			expect( dateToString(item.due) ).toEqual( target.due );
			expect( item.dueString ).toEqual( target.due );
		} );

	} );

	describe( "when given an invalid due string", function () {
		it( "should not parse it", function () {
			var item;
			for( i in invalid ) {
				item = new TodoTxtItem( invalid[i].raw, [ new HiddenExtension() ] );
				expect( item.due ).toBeUndefined();
				expect( item.text ).toEqual( invalid[i].text );
			}
		} );
	} );
} );
