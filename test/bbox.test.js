'use strict';

const assert = require('node:assert/strict');
const jpgrid = require('../index.js');

const bbox = jpgrid.jpgrid_bbox('50293427');

assert.deepEqual(Object.keys(bbox), [
	'west',
	'south',
	'north',
	'east'
]);
assert.deepEqual(bbox, {
	west: 129.5875,
	south: 33.6,
	north: 33.608333333333334,
	east: 129.6
});
