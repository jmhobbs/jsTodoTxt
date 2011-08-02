describe( "TodoTxtItem", function () {

	var target = {
		raw: "(A) This is a task.",
		render: "(A) This is a task.",
		text: "This is a task.",
		priority: "A",
		complete: false,
		date: null,
		location: null,
		project: null
	};

	describe( "when given a prioritized task", TodoTxtItemHelper( target ) );

} );
