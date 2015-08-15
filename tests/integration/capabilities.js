var assert = require('assert');
var watchman = require('../../node');

function optional() {
  var client = new watchman.Client();
  client.capabilityCheck({optional: ['will-never-exist']},
      function (error, resp) {
        assert.equal(error, null, 'no errors');
        assert.equal(resp.capabilities['will-never-exist'], false);
        client.end();
      });
}
optional();

function required() {
  var client = new watchman.Client();
  client.capabilityCheck({required: ['will-never-exist']},
      function (error, resp) {
        assert.equal('client required capability `will-never-exist` is not' +
                     ' supported by this server', error.message);
        client.end();
      });
}
required();

function synth() {
  var client = new watchman.Client();

  resp = client._synthesizeCapabilityCheck({version: '1.0'},
      ['will-never-exist'], []);
  assert.equal(resp.capabilities['will-never-exist'], false);

  resp = client._synthesizeCapabilityCheck({version: '3.2'},
      ['relative_root'], []);
  assert.equal(resp.capabilities['relative_root'], false);

  resp = client._synthesizeCapabilityCheck({version: '3.3'},
      ['relative_root'], []);
  assert.equal(resp.capabilities['relative_root'], true);

  resp = client._synthesizeCapabilityCheck({version: '1.0'},
      [], ['will-never-exist']);
  assert.equal('client required capability `will-never-exist` is not' +
               ' supported by this server', resp.error);
}
synth();

