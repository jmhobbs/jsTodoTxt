/*!
	Extensions to the todo.txt format
*/

function TodoTxtExtension( name ) {
	this.reset = function () {
		this.name = null;
		this.parsingFunction = null;
	};
    // The parsing function should return an array containing
    // the real value of the element, the parsed task line and
    // the string representation of the value.
	this.parsingFunction = function ( line ) {
		return [null, null, null];
	};
}

