describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task.",
		text: "This is a task."
	};

	describe( "when constructed", function () {
	
		it( "should accept a string", function () {
			var item = new TodoTxtItem( target.raw );
			expect( item.text ).toEqual( target.text );
		} );

		it( "should accept no arguments", function () {
			var item = new TodoTxtItem();
			expect( item.text ).toEqual( null );
		} );

	} );

	describe( "the full monty", function () {
		
		var item;

		beforeEach( function () {
			item = new TodoTxtItem( "x 2011-07-01 (B) 2011-06-01 Task text. @Home +Website @Computer +Laundry" );
		} );

		it( "should be complete", function () {
			expect( item.complete ).toEqual( true );
			expect( item.completedString() ).toEqual( "2011-07-01" );
		} );

		it( "should be prioritized", function () {
			expect( item.priority ).toEqual( 'B' );
		} );

		it( "should have a date", function () {
			expect( item.dateString() ).toEqual( "2011-06-01" );
		} );

		it( "should have the correct text", function () {
			expect( item.text ).toEqual( "Task text." );
		} );

		it( "should have the correct projects", function () {
			expect( item.projects ).toEqual( [ "Website", "Laundry" ] );
		} );

		it( "should have the correct contexts", function () {
			expect( item.contexts ).toEqual( [ "Home", "Computer" ] );
		} );

		it( "should render correctly", function () {
			expect( item.toString() ).toEqual( "x 2011-07-01 (B) 2011-06-01 Task text. +Website +Laundry @Home @Computer" );
		} );


	} );

} );

