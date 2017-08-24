// Builtin
const path = require('path');

// Theirs
const mri = require('mri');

const toArray = array => {
  if (array instanceof Array) return array;
  if (array === null || array === undefined) return [];
  return [array];
};

const options = [];
const commands = [];
let h = '';

const option = (name, description, opts) => {
  opts = opts || {};

  const newOption = {
    name,
    description,
    default: opts.default || null,
    aliases: toArray(opts.aliases),
    boolean: opts.boolean || false,
    hidden: opts.hidden || false
  };

  options.push(newOption);
};

const command = (name, description, opts) => {
  opts = opts || {};

  const newCommand = {
    name,
    description,
    hidden: opts.hidden || false
  };

  commands.push(newCommand);
};

const buildHelp = opts => {
  opts.name = opts.name || path.basename(module.parent.filename, '.js');

  h = '\nUsage: ' + opts.name + ' [options] [command]\n\nCommands:';

  for (let cmd in commands) {
    cmd = commands[cmd];

    if (!cmd.hidden) {
      let space = '  ';

      for (i = 0; i < 26 - cmd.name.length; i++) space += ' ';

      h = h + '\n  ' + cmd.name + space + cmd.description;
    }
  }

  h = h + '\n\nOptions:';

  for (let opt in options) {
    opt = options[opt];

    if (!opt.hidden) {
      const aliases = opt.aliases;
      let names = '';
      let space = '  ';

      aliases.push(opt.name);

      for (const alias in aliases) {
        const dash = aliases[alias].length > 1 ? '--' : '-';

        names = names + dash + aliases[alias] + ', ';
      }

      names = names.slice(0, -2);

      for (i = 0; i < 26 - names.length; i++) space = space + ' ';

      h = h + '\n  ' + names + space + opt.description;
    }
  }

  h = h + '\n';
};

const parse = (argv, opts) => {
  opts = opts || {};

  const mriOpts = {
    alias: {},
    boolean: [],
    default: {}
  };

  for (let opt in options) {
    opt = options[opt];

    if (opt.boolean) mriOpts.boolean.push(opt.name);

    if (opt.aliases !== []) {
      mriOpts.alias[opt.name] = {};
      mriOpts.alias[opt.name] = opt.aliases;
    }

    if (opt.default) mriOpts.default[opt.name] = opt.default;
  }

  buildHelp({ name: opts.name });

  const parsed = mri(argv, mriOpts);
  const _ = parsed._;

  parsed.$ = true;

  for (let cmd in commands) {
    cmd = commands[cmd];

    if (_.indexOf(cmd.name) !== -1) {
      parsed.$ = false;
      parsed[cmd.name] = true;
      _.splice(_.indexOf(cmd.name), 1);
    } else {
      parsed[cmd.name] = false;
    }
  }

  parsed._ = _;

  return parsed;
};

const help = () => {
  if (h === '') {
    throw new Error('Help not ready');
  } else {
    return h;
  }
};

module.exports = {
  option,
  command,
  parse,
  help
};
