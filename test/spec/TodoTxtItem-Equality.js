describe( "TodoTxtItem", function () {

	describe( "when compared with the same task", function () {

		it( "should report it's equal", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( true );
		} );

		it( "should be the same when same projects are in different order", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Laundry @Computer +Website" );
			expect(item.equals(item2)).toEqual( true );
		} );

		it( "should be the same when same projects are in different order", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Computer +Website +Laundry @Home" );
			expect(item.equals(item2)).toEqual( true );
		} );

		it( "should be the same when not all fields are present", function () {
			var item = new TodoTxtItem( "x 2013-09-25 Task text." );
			var item2 = new TodoTxtItem( "x 2013-09-25 Task text." );
			expect(item.equals(item2)).toEqual( true );
		} );

	} );

	describe( "when compared with a different task", function () {

		it( "should be different when completedness differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "(B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when date of completion differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-26 (B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when priority differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (B) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when start date differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-25 Task text. @Home +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when text differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text.. @Home +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when a context differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Work +Website @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when multiple contexts differ", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Work +Website @StoneTablet +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when a project differs", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Program @Computer +Laundry" );
			expect(item.equals(item2)).toEqual( false );
		} );

		it( "should be different when multiple projects differ", function () {
			var item = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Website @Computer +Laundry" );
			var item2 = new TodoTxtItem( "x 2013-09-25 (A) 2013-09-24 Task text. @Home +Program @Computer +Cooking" );
			expect(item.equals(item2)).toEqual( false );
		} );
	} );
} );

