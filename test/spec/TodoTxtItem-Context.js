describe( "TodoTxtItem", function () {

	var target = {
		raw: "This is a task. @Home",
		render: "This is a task. @Home",
		text: "This is a task.",
		priority: null,
		complete: false,
		completed: null,
		date: null,
		contexts: [ "Home" ],
		projects: null
	};

	describe( "when given a context bound task", TodoTxtItemHelper( target ) );

} );
