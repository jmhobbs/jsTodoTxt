describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task. @Home",
		render: "This is a task. @Home",
		text: "This is a task.",
		priority: null,
		complete: false,
		date: null,
		location: "Home",
		project: null
	};

	describe( "when given a location-bound task", TodoTxtItemHelper( target ) );

} );
