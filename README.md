[![Build Status](https://github.com/jmhobbs/jsTodoTxt/actions/workflows/tests.yaml/badge.svg?branch=next)](https://github.com/jmhobbs/jsTodoTxt/actions/workflows/tests.yaml?query=branch%3Anext)
[![codecov](https://codecov.io/github/jmhobbs/jsTodoTxt/branch/next/graph/badge.svg?token=AmKRu6IcEq)](https://codecov.io/github/jmhobbs/jsTodoTxt)
[![Netlify Status](https://api.netlify.com/api/v1/badges/be149c65-9c1b-45e9-a9b4-31e79d8e898c/deploy-status?branch=next)](https://app.netlify.com/sites/grand-bunny-8f4598/deploys)


# jsTodoTxt

jsTodoTxt is a library for working with todo.txt formatted files in JavaScript.

## 🚨 This Will Be Version 1.0.0 🚨

This branch contains a major rewrite of jsTodoTxt.  It is currently in alpha on NPM, you can install it with `npm install jstodotxt@next`

If you are looking for the current `latest` code, that is available on the [`0.10.x`](https://github.com/jmhobbs/jsTodoTxt/tree/0.10.x) branch.

# Format

jsTodoTxt attempts to match the [todo.txt format](https://github.com/ginatrapani/todo.txt-cli/wiki/The-Todo.txt-Format) exactly.

To do so, this library relies heavily on tests and strives for 100% coverage.

# Usage

The core of jsTodoTxt is the `Item` class.

An `Item` breaks a single todo.txt line into two logical parts and treats them independently, what we call the header and the body.

There are accessors and mutators for all parts of the item. API documentation is [available online](https://jstodotxt.velvetcache.org/) and the package ships with type definition files.

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

## Example

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

jsTodoTxt is tested with [ava](https://github.com/avajs/ava)

# About todo.txt

todo.txt is a format for storing todo lists in a future-proof format.

http://todotxt.com/
