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

function HiddenExtension() {
	this.name = "hidden";
}

HiddenExtension.prototype = new TodoTxtExtension();
HiddenExtension.prototype.parsingFunction = function(line) {
    var hidden = false;
    var matchHidden = /h:1/.exec( line );
    if ( matchHidden !== null ) {
        hidden = true;
    }
	return [hidden, line.replace(/h:1/, ''), null];
};
