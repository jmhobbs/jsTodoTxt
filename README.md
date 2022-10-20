[![Build Status](https://github.com/jmhobbs/jsTodoTxt/actions/workflows/tests.yaml/badge.svg?branch=develop)](https://github.com/jmhobbs/jsTodoTxt/actions/workflows/tests.yaml?query=branch%3Adevelop)


# jsTodoTxt

jsTodoTxt is a library for working with todo.txt formatted files in JavaScript.

# Format

jsTodoTxt attempts to match the [todo.txt format](https://github.com/ginatrapani/todo.txt-cli/wiki/The-Todo.txt-Format) exactly.

To do so, this library relys on heavy test coverage.

# Usage

There are two ways to work with jsTodoTxt (hint: they overlap)

## The Item Class

The class Item encapsulates the core of the library. An Item breaks a single todo.txt line into two logical parts and treats them independently, what we call the header and the body.

```text
        Header                                     Body
 .-----------------------.   .----------------------------------------------------.
'                         ' '                                                      '
x (A) 2016-05-20 2016-04-30 measure space for +chapelShelving @chapel due:2016-05-30
|  |  '----.---' '----.---'                   '------.------' '--.--' '------.-----'
|  |   completed   created                        project     context    extension
|  |
|   ' priority
|
 ' completed
```

### Example

```javascript
const item = new Item('Paint the kitchen @home +reno due:2022-12-01');

console.log(item.contexts());
// ['home']

item.setExtension('color', 'red');
console.log(item.extensions());
// [{key: 'due', value: '2022-12-01'}, {key: 'color', value: 'red'}]

item.setCreated('2022-10-19');
console.log(item.toString());
// 2022-10-19 Paint the kitchen @home +reno due:2022-12-01 color:red

item.setBody('Paint the kitchen color:red @home +reno due:2022-12-01')
console.log(item.toString());
// 2022-10-19 Paint the kitchen color:red @home +reno due:2022-12-01
```

# Testing

Run `npm test` to run the suite.

jsTodoTxt is tested with ava

# About todo.txt

todo.txt is a format for storing todo lists in a future-proof format.

http://todotxt.com/
