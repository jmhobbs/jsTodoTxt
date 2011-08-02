describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task. +Project",
		render: "This is a task. +Project",
		text: "This is a task.",
		priority: null,
		complete: false,
		date: null,
		location: null,
		project: "Project"
	};

	describe( "when given a project task", TodoTxtItemHelper( target ) );

} );
