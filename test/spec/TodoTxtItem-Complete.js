describe( "TodoTxtItem", function () {

	var target = {
		raw: "x 2011-07-31 This is a task.",
		render: "x 2011-07-31 This is a task.",
		text: "This is a task.",
		priority: null,
		complete: true,
		date: "2011-07-31",
		location: null,
		project: null
	};

	describe( "when given a completed task", function () {

		var item;

		beforeEach( function () {
			item = new TodoTxtItem( target.raw );
		} );

		it( "should have the correct text", function () {
			expect( item.text ).toEqual( target.text );
		} );

		it( "should have no priority", function () {
			expect( item.priority ).toEqual( target.priority );
		} );

		it( "should have no location", function () {
			expect( item.location ).toEqual( target.location );
		} );

		it( "should have no project", function () {
			expect( item.project ).toEqual( target.project );
		} );

		it( "should have the correct date", function () {
			expect( item.date ).toEqual( target.date );
		} );

		it( "should be complete", function () {
			expect( item.complete ).toEqual( target.complete );
		} );

		it( "should render correctly", function () {
			expect( item.toString() ).toEqual( target.render );
		} );

	} );

} );
