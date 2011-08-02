describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task.",
		render: "This is a task.",
		text: "This is a task.",
		priority: null,
		complete: false,
		date: null,
		location: null,
		project: null
	};

	describe( "when given a simple task", TodoTxtItemHelper( target ) );
	
} );
