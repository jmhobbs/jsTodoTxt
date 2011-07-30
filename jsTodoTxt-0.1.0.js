/*!
 * jsTodoTxt Library v0.1.0
 * https://github.com/jmhobbs/jsTodoTxt
 *
 * Copyright 2011, John Hobbs
 * Licensed under the MIT license.
 * https://github.com/jmhobbs/jsTodoTxt/blob/master/LICENSE
 */

/*!
	Shared members and static functions.
*/
var TodoTxt = {

	// Pre-compile Shared RegExes
	_trim_re:             /^\s+|\s+$/g,
	_complete_replace_re: /^x\s*/i,
	_date_re:             /^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})/,
	_date_replace_re:     /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\s*/,
	_priority_re:         /\(([A-Z])\)/,
	_priority_replace_re: /\s*\([A-Z]\)\s*/,
	_location_re:         /@(\S+)/,
	_location_replace_re: /\s*@\S+\s*/,
	_project_re:          /\+(\S+)/,
	_project_replace_re:  /\s*\+\S+\s*/,

	/*!
		Parse a string of lines.

		\param contents A string

		\returns An array of TodoTxtItem objects.
	*/
	parse: function ( contents ) {
		var items = [];
		var lines = contents.split( "\n" );
		for( i in lines ) {
			items.push( new TodoTxtItem( lines[i] ) );
		}
		return items;
	},

	/*!
		Parses a single line into a TodoTxtItem object.

		\param line A string.

		\returns A TodoTxtItem object representing that line.
	*/
	parseLine: function ( line ) {
		return new TodoTxtItem( line );
	},

	/*!
		Render an array of items into string.

		\param items An array of valid TodoTxtItem objects.

		\returns A string representation of the items.
	*/
	render: function( items ) {
		var lines = [];
		for( i in items ) {
			lines.push( items[i].toString() );
		}
		return lines.join( "\n" );
	},

	/*
		Render a single item to a single line. No newline.
	
		\param item A valid TodoTxtItem object

		\returns A string representation of the item.
	*/
	renderItem: function ( item ) {
		return item.toString();
	}

};

function TodoTxtItem ( line ) {

	this.text     = null;
	this.priority = null;
	this.complete = false;
	this.date     = null;
	this.location = null;
	this.project  = null;

	this.toString = function () {
		var line = this.text;
		if( null != this.priority ) { line = '(' + this.priority + ') ' + line; }
		if( null != this.date ) { line = this.date + ' ' + line; }
		if( this.complete ) { line = 'x ' + line; }
		if( null != this.project ) { line = line + ' +' + this.project; } 
		if( null != this.location ) { line = line + ' @' + this.location; }
		return line;
	};

	this.parse = function ( line ) {
		// Trim whitespace
		line = line.replace( TodoTxt._trim_re, '');

		// Time \r from Windows :-P
		line = line.replace( "\r", '' );

		// Completed
		if( line[0] == 'x' || line[0] == 'X' ) {
			this.complete = true;
			line = line.replace( TodoTxt._complete_replace_re, '' );
		}

		var date = TodoTxt._date_re.exec( line );
		if( null != date ) {
			this.date = date[1];
			line = line.replace( TodoTxt._date_replace_re, '' );
		}

		// Priority
		var priority = TodoTxt._priority_re.exec( line );
		if( null != priority ) {
			this.priority = priority[1];
			line = line.replace( TodoTxt._priority_replace_re, '' );
		}

		// Location
		var loc = TodoTxt._location_re.exec( line );
		if( null != loc ) {
			this.location = loc[1];
			line = line.replace( TodoTxt._location_replace_re, ' ' );
		}

		// Project
		var project = TodoTxt._project_re.exec( line );
		if( null != project ) {
			this.project = project[1];
			line = line.replace( TodoTxt._project_replace_re, ' ' );
		}

		// Trim again to clean up
		line = line.replace( TodoTxt._trim_re, '');

		this.text = line;
	};
	
	// If we were passed a string, parse it.
	if( "string" == typeof( line ) ) { this.parse( line ); }
}

