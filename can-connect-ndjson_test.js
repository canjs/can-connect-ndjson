import QUnit from 'steal-qunit';
import plugin from './can-connect-ndjson';

QUnit.module('can-connect-ndjson');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-connect-ndjson plugin');
});
