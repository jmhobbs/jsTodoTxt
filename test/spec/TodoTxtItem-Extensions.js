describe( "TodoTxtItem with multiple extensions", function() {
	var target = {
		raw: "x 2016-07-14 (A) 2016-07-10 This is a task. h:1 due:2016-07-15 @Home +Website @Computer +Laundry",
		render: "x 2016-07-14 (A) 2016-07-10 This is a task. h:1 due:2016-07-15 +Website +Laundry @Home @Computer",
		text: "This is a task.",
		priority: "A",
		complete: true,
		completed: "2016-07-14",
		date: "2016-07-10",
		contexts: [ "Home", "Computer" ],
		projects: [ "Website", "Laundry" ],
		hidden: true,
		due: "2016-07-15"
	};

	describe( "when given a task with multiple extensions", function () {

		var item;

		beforeEach( function () {
			item = new TodoTxtItem( target.raw, [ new HiddenExtension(), new DueExtension() ]);
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

		it ( "should have the correct due date", function() {
			expect( item.dueString ).toEqual( target.due );
		})

	} );
} );
