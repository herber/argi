# argi [![Codestyle fyi](https://img.shields.io/badge/code%20style-fyi-E91E63.svg)](https://github.com/tobihrbr/fyi) [![Build Status](https://travis-ci.org/tobihrbr/argi.svg?branch=master)](https://travis-ci.org/tobihrbr/argi) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/rvyedmu554502dlc?svg=true)](https://ci.appveyor.com/project/tobihrbr/argi) [![Coverage Status](https://coveralls.io/repos/github/tobihrbr/argi/badge.svg?branch=master)](https://coveralls.io/github/tobihrbr/argi?branch=master)

> A simple args parser

## Install

```
$ npm install --save argi
```

## Usage

```js
const argi = require('argi');

// Options
argi.option('name', 'description', { default: 'bob', aliases: 'n', isBool: false, hidden: false });

// Commands
argi.command('sayhi', 'description', { hidden: false });

// Parse argv
const parsed = argi.parse(process.argv.slice(2));

if (parsed.sayhi) {
  console.log(`Hi ${ parsed.name }!`);
} else {
  console.log(args.help());
}
```

## API

### argi.options(name, description[, options])

#### name

Type: `string`

The option's name.

#### description

Type: `string`

What the option does. Will be used for help.

#### options

Type: `object`

##### default

Type: `string`

The options default value.

##### aliases

Type: `string`, `array`

Alias names for the option.

##### isBool

Type: `boolean`
Default: `false`

Specifies whether the option is a boolean(`true`/`false`) or a string. If set to true arguments after the option will count as a command.

Example:

```js
...

argi.option('boolean', 'description', { isBool: true });

const parsed = argi.parse(['--boolean', 'value'])
parsed.boolean // => true
parsed._ // => ['value']

...
```

##### hidden

Type: `boolean`
Default: `false`

If option should be displayed in help.

### argi.command(name, description[, options])

#### name

Type: `string`

The command's name.

#### description

Type: `string`

What the command does. Will be used for help.

#### options

Type: `object`

##### hidden

Type: `boolean`
Default: `false`

If command should be displayed in help.

### argi.help()

Returns a help string. Will throw an error if it's called before argi.parse()

### argi.parse(argv)

#### argv

An array of cli options. You should probably set it to `process.argv.slice(2)`

Returns an object with the option's values and if commands should be executed.

Example:

```js
...

const parsed = argi.parse(['--test', '--opt', 'yes', 'build']);
// => {
// =>   test: true,
// =>   opt: 'yes',
// =>   build: true
// => }

...
```

## License

MIT © [Tobias Herber](https://tobihrbr.com)
