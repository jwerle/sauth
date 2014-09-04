sauth
=====

Command line social authentication strategies

## install

```sh
$ npm i sauth -g
```

## about

*sauth* makes use of strategies for authentication. The goal of a
strategy is to authenticate a user with some type of authentication
control flow like OAuth. A strategy is devised into asynchronous phases.
The end result is usually to output an access token and/or user
information in the terminal. Implementing a strategy is fairly trivial
and only involves writing a few interface functions. See
[sauth-instagram](https://github.com/jwerle/sauth-instagram) for a
simple example.

## usage

`sauth(1)` is meant to be used as a command line utility. The basic
usage is:

```sh
usage: sauth [-hV] <strategy> [-c config] [...args]
```

where `strategy` is the name of the strategy to use. It is required
internally as `sauth-{NAME}` and should exists in one of the paths found
in `module.paths`. Arguments are passed to the strategy as an object and
are up to the strategy implementor. The argument `--client-id=1234` is
serialized into an object `{'client-id': 1234}` and passed to the
strategy as the fist argument. The second argument is a callback that
should be invoked after the strategy has completed.

The `-c` or `--config` argument is a path to a JSON or javascript file
that will be the arguments passed to the strategy itself. This makes it
convenient for running strategies from the command line.

**example:**

```json
{
  "client_id": "1234",
  "client_secret": "5678",
  "redirect_uri": "http://localhost:9999/ig/auth",
  "port": 9999
}
```

```sh
$ sauth instagram -c ig-strategy-conf.json
```

## license

MIT
