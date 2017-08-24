const ava = require('ava');
const args = require('./');

ava('Throws error when help is not yet generated', t => {
  const c = args;

	try {
		c.help();
	} catch(err) {
		t.true(err instanceof Error);
	}
});

ava('Parses cli options', t => {
  const a = args;

  a.option('name1', 'description1', { isBool: true });
  a.option('name2', 'description2', { default: 'testing', aliases: ['name3', 'x'] });
  a.option('name4', 'description4', { default: 'more tests' });
  a.option('name5', 'description5', { aliases: 'name7' });
  a.option('name6', 'description6');

  const parsed = a.parse(['--name1', '-n', '--name7', 'test', '--name3', 'test', 'command']);

  t.is(parsed.name1, true);
	t.is(parsed.name2, 'test');
  t.is(parsed.name3, 'test');
  t.is(parsed.name4, 'more tests');
  t.is(parsed.name5, 'test');
	t.is(parsed.name6, undefined);
});

ava('Parses cli commands', t => {
  const b = args;

  b.command('cmd1', 'description1');
  b.command('cmd2', 'description2');
  b.command('cmd3', 'description3');

  const parsed = b.parse(['cmd1', 'cmd2', 'extra', '--option']);

  t.is(parsed._[0], 'extra');
  t.is(parsed.$, false);
  t.is(parsed.cmd1, true);
  t.is(parsed.cmd2, true);
  t.is(parsed.cmd3, false);
});

ava('Generates help', t => {
  const c = args;

  c.command('cmd1', 'd_cmd_1');
  c.option('opt1', 'd_opt_1');
	c.command('cmd2', 'd_cmd_2');
	c.option('opt2', 'd_opt_2');
	c.command('cmd2', 'd_cmd_3', { hidden: true });
  c.option('opt2', 'd_opt_3', { hidden: true });

  c.parse(['cmd1', 'cmd2', '--opt1', '--opt2']);

  const help = c.help();

  t.true(help.indexOf('d_cmd_1') !== -1);
  t.true(help.indexOf('d_opt_1') !== -1);
	t.true(help.indexOf('d_cmd_2') !== -1);
  t.true(help.indexOf('d_opt_2') !== -1);
	t.true(help.indexOf('d_cmd_3') === -1);
  t.true(help.indexOf('d_opt_3') === -1);
});
