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

} );

