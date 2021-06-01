[![Build Status](https://github.com/jmhobbs/jsTodoTxt/actions/workflows/tests.yaml/badge.svg?branch=develop)](https://github.com/jmhobbs/jsTodoTxt/actions/workflows/tests.yaml?query=branch%3Adevelop)


# jsTodoTxt

jsTodoTxt is a library for working with todo.txt formatted files in JavaScript.

# Format

jsTodoTxt attempts to match the [todo.txt format](https://github.com/ginatrapani/todo.txt-cli/wiki/The-Todo.txt-Format) exactly.

To do so, I've written 50+ tests using the [Jasmine](https://github.com/pivotal/jasmine) library.

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

    var item = new TodoTxtItem( "(B) Try out jsTodoTxt" );
    item.priority = 'A';
    item.text = 'Try out jsTodoTxt';
    item.contexts = [ 'Computer' ];
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

# Addons / Extensions

The todo.txt format [specifies a simple design](https://github.com/todotxt/todo.txt#additional-file-format-definitions) for addons,

> Developers should use the format key:value to define additional metadata (e.g. due:2010-01-02 as a due date).
> Both key and value must consist of non-whitespace characters, which are not colons. Only one colon separates the key and value.

We support this through a mechanism we call extensions.  To use an extension, you must pass it to the `TodoTxtItem` when initializing it.

    var item = new TodoTxtItem("Do something. due:2010-01-02", [ new DueExtension() ]);
    console.log( item.due );  // Logs: "Tue Feb 02 2010 00:00:00 GMT-0600 (Central Standard Time)"

## Implementing Your Own

Writing your own extension consists of a `parsingFunction` which extracts your addon, and setting a `name`.

Here's an example one for an addon that sets a color for an item in hex, `color:FFFFFF`.

    function ColorExtension() {
      // Set the name, this will be the property name on the TodoTxtItem.
      this.name = "color";
    };

    ColorExtension.prototype = new TodoTxtExtension();

    ColorExtension.prototype.parsingFunction = function(line) {
      // We don't have to use a regex, but it's handy for extracting the content.
      var colorRegex = /\bcolor:([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/;
      var match = colorRegex.exec(line);
      if( match !== null ) {
        // The return format is [ <value of property>, <line with addon removed>, <string of the value> ]
        return ["#" + match[1], line.replace(colorRegex, ''), match[1]];
      }
      // Return nulls if not found.
      return [null, null, null];
    };

# Testing

Run `npm test` to run the suite.

jsTodoTxt is tested with Jasmine, a BDD framework from Pivotal Labs.

# About todo.txt

todo.txt is a format for storing todo lists in a future-proof format.

http://todotxt.com/
