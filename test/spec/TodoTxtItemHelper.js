function TodoTxtItemHelper ( target ) {
	return function () {

		var item;

		beforeEach( function () {
			item = new TodoTxtItem( target.raw );
		} );

		it( "should have the correct text", function () {
			expect( item.text ).toEqual( target.text );
		} );

		it( "should have the correct priority", function () {
			expect( item.priority ).toEqual( target.priority );
		} );

		it( "should have the correct location", function () {
			expect( item.location ).toEqual( target.location );
		} );

		it( "should have the correct project", function () {
			expect( item.project ).toEqual( target.project );
		} );

		it( "should have the correct date", function () {
			expect( item.date ).toEqual( target.date );
		} );

		it( "should have the correct complete state", function () {
			expect( item.complete ).toEqual( target.complete );
		} );

		it( "should render correctly", function () {
			expect( item.toString() ).toEqual( target.render );
		} );

	}
};
