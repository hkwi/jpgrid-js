'use strict';

const assert = require('node:assert/strict');
const jpgrid = require('../index.js');

const lat = 35.681236;
const lon = 139.767125;

assert.equal(jpgrid.jpgrid_encode(lat, lon), '53394611');
assert.equal(jpgrid.jpgrid_encodeLv1(lat, lon), '5339');
assert.equal(jpgrid.jpgrid_encodeLv2(lat, lon), '533946');
assert.equal(jpgrid.jpgrid_encodeLv3(lat, lon), '53394611');

assert.equal(jpgrid.jpgrid_encodeHalf(lat, lon), '533946113');
assert.equal(jpgrid.jpgrid_encodeQuarter(lat, lon), '5339461132');
assert.equal(jpgrid.jpgrid_encodeEighth(lat, lon), '53394611323');

assert.equal(jpgrid.jpgrid_encodeUni10(lat, lon), '533946');
assert.equal(jpgrid.jpgrid_encodeUni5(lat, lon), '5339461');
assert.equal(jpgrid.jpgrid_encodeUni2(lat, lon), '533946005');

assert.deepEqual(jpgrid.jpgrid_bbox('533946113'), {
	west: 139.7625,
	south: 35.67916666666667,
	north: 35.68333333333333,
	east: 139.76875
});
