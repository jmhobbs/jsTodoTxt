global.TodoTxtItemHelper = function ( target ) {
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

	}
};
