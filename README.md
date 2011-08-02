# jsTodoTxt

jsTodoTxt is a library for working with todo.txt formatted files in JavaScript.

# Usage

There are two ways to work with jsTodoTxt (hint: they overlap)

## The TodoTxtItem Class

The class TodoTxtItem encapsulates the core of the library.

### Data Members

These are all the data members available on an item:

    text      // The core text of the item
    priority  // The priority level of the item as string [A-Z]
    complete  // Boolean
		completed // Date completed
    date      // Date attached to object, typically with a comlete item
    contexts  // Array, contexts for the object, e.g. @Home == "Home"
    projects  // Array, projects fot the object, e.g. +Chores == "Chores"

### Constructor

Create a new item, protentially loading it from a string.

    // Fresh new item!
    var newItem = new TodoTxtItem();
    newItem.text = "Cool!";
    
    // Create an item from a string
    var existingItem = new TodoTxtItem( "(A) Try out jsTodoTxt" );
    console.log( existingItem.priority ); // Logs "A"

### toString

Render the item back to a string.

    var item = new TodoTxtItem( "(B) Try out jsTdoTxt" );
    item.priority = 'A';
    item.text = 'Try out jsTodoTxt';
		item.location = 'Computer';
		console.log( item.toString() );
    // Logs: "(A) Try out jsTodoTxt @Computer"
    
    item.complete = true;
		item.completed = new Date();
    console.log( item.toString() );
    // Logs: "x 2011-07-24 (A) Try out jsTodoTxt @Computer"

### parse

Parse a string into the item.

    var newItem = new TodoTxtItem();
    newItem.parse( "(A) Try out jsTodoTxt" );
    console.log( newItem.priority ); // Logs: "A"

## The TodoTxt Object Literal (Static Methods)

TodoTxt provides four utility methods:

### parse

This method takes a block of text and does it's best to return an array of tasks, as TodoTxtItem objects.

    var items = TodoTxt.parse( big_block_of_text );
    console.log( items[0].priority )

### parseLine

This method takes a single line and parses it into a single TodoTxtItem.  Really, you should use the constructor.

    var item = TodoTxt.parse( "(A) Try out jsTodoTxt" );
    console.log( item.priority ); // Logs: "A"

### render


This method renders an array of TodoTxtItem objects to a string.

    var string = TodoTxt.render( [ ... array of TodoTxtItem objects ... ] );

### renderItem

This method renders a single TodoTxtItem to string.  Really, you should just use toString.

		var item = new TodoTxtItem( "(A) Learn to use toString" );
    console.log( TodoTxt.renderItem( item ) ); // Logs:  "(A) Learn to use toString"

# About todo.txt

todo.txt is a format for storing todo lists in a future-proof format.

http://todotxt.com/
