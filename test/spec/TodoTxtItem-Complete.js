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

	describe( "when given a completed task", TodoTxtItemHelper( target ) );
	
} );
