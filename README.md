# jpgrid

[![NPM](https://img.shields.io/npm/v/jpgrid.svg)](https://www.npmjs.com/package/jpgrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Japanese Statistical Mesh Code (統計メッシュコード) encoder & decoder.**

Implements the mesh code system defined by [JIS X 0410 (formerly JIS C 6304)](https://webdesk.jsa.or.jp/books/W11M0270/) used in Japan for statistical data geocoding.

## Features

- **Encode** latitude/longitude → mesh code
- **Decode** mesh code → latitude/longitude (center position)
- **Bounding box** calculation for any mesh code
- Support for JIS X 0410 base, divided, and integrated mesh codes

## Installation

```bash
npm install jpgrid
```

TypeScript users receive the bundled declarations automatically:

```ts
import { jpgrid_encode, jpgrid_bbox } from 'jpgrid';

const code: string = jpgrid_encode(35.681236, 139.767125);
const box = jpgrid_bbox(code);
```

## Usage

### Encode

Convert coordinates to mesh code strings at various resolution levels:

```js
const jpgrid = require('jpgrid');

// 3rd mesh (基準地域メッシュ): 30″ × 45″, 8 digits
jpgrid.jpgrid_encode(35.681236, 139.767125);
// => "53394611"

// 1st mesh (第1次地域区画): 40′ × 1°, 4 digits
jpgrid.jpgrid_encodeLv1(35.681236, 139.767125);
// => "5339"

// Level 2 (5′ × 7′30″): 6 digits
jpgrid.jpgrid_encodeLv2(35.681236, 139.767125);
// => "533946"

// 5-times mesh (about 5km scale): 7 digits
jpgrid.jpgrid_encodeUni5(35.681236, 139.767125);
// => "5339461"

// Higher precision variants
jpgrid.jpgrid_encodeHalf(35.681236, 139.767125);   // half-size mesh
jpgrid.jpgrid_encodeQuarter(35.681236, 139.767125); // quarter-size mesh
jpgrid.jpgrid_encodeEighth(35.681236, 139.767125);  // eighth-size mesh
jpgrid.jpgrid_encodeUni10(35.681236, 139.767125);   // 10"-class mesh
```

### Decode

Convert a mesh code string back to coordinates:

```js
// Returns { lat, lon } — center position of the mesh
jpgrid.jpgrid_decode('53394611');
// => { lat: 35.679166..., lon: 139.76875 }
```

### Bounding Box

Get the corners of a mesh area:

```js
jpgrid.jpgrid_bbox('53394611');
// => { west: 139.7625, south: 35.675,
//      north: 35.68333333333333, east: 139.775 }
```

## API Reference

| Function | Description | Code Length | Approx. Scale |
|---|---|---|---|
| `jpgrid_encode(lat, lon)` / `jpgrid_encodeLv3(lat, lon)` | 3rd mesh | 8 digits | 30″ × 45″ (~1km) |
| `jpgrid_encodeLv1(lat, lon)` | 1st mesh | 4 digits | 40′ × 1° (~80km) |
| `jpgrid_encodeLv2(lat, lon)` | 2nd mesh | 6 digits | 5′ × 7′30″ (~10km) |
| `jpgrid_encodeUni10(lat, lon)` | 10-times mesh | 6 digits | same area as 2nd mesh |
| `jpgrid_encodeUni5(lat, lon)` | 5-times mesh | 7 digits | 2′30″ × 3′45″ (~5km) |
| `jpgrid_encodeUni2(lat, lon)` | 2-times mesh | 9 digits | 1′ × 1′30″ (~2km) |
| `jpgrid_encodeHalf(lat, lon)` | 1/2 mesh | 9 digits | 15″ × 22.5″ (~500m) |
| `jpgrid_encodeQuarter(lat, lon)` | 1/4 mesh | 10 digits | 7.5″ × 11.25″ (~250m) |
| `jpgrid_encodeEighth(lat, lon)` | 1/8 mesh | 11 digits | 3.75″ × 5.625″ (~125m) |
| `jpgrid_decode(code)` | Reverse encode → coords | — | returns `{ lat, lon }` |
| `jpgrid_bbox(code)` | Get bounding box | — | returns `{ west, south, north, east }` |

## JIS X 0410 mesh types

| Type | Size | Example Code | Function |
|---|---|---|---|
| 1st mesh (第1次地域区画) | 40′ × 1° | `5339` | `encodeLv1()` |
| 2nd mesh (第2次地域区画) | 5′ × 7′30″ | `533946` | `encodeLv2()` |
| 3rd mesh (第3次地域区画・基準地域メッシュ) | 30″ × 45″ | `53394611` | `encodeLv3()` |
| 1/2 mesh (2分の1地域メッシュ) | 15″ × 22.5″ | `533946113` | `encodeHalf()` |
| 1/4 mesh (4分の1地域メッシュ) | 7.5″ × 11.25″ | `5339461132` | `encodeQuarter()` |
| 1/8 mesh (8分の1地域メッシュ) | 3.75″ × 5.625″ | `53394611323` | `encodeEighth()` |

Integrated meshes defined by JIS X 0410 are also supported:

| Type | Size | Example Code | Function |
|---|---|---|---|
| 10-times mesh (10倍地域メッシュ) | 5′ × 7′30″ | `533946` | `encodeUni10()` |
| 5-times mesh (5倍地域メッシュ) | 2′30″ × 3′45″ | `5339461` | `encodeUni5()` |
| 2-times mesh (2倍地域メッシュ) | 1′ × 1′30″ | `533946005` | `encodeUni2()` |

### Subdivision rule

Each divided mesh is divided into **4 sub-meshes** numbered 1–4. The order is south-west, south-east, north-west, north-east:

```
┌───┬───┐
│ 3 │ 4 │
├───┼───┤
│ 1 │ 2 │
└───┴───┘
```

The 2nd mesh is divided into 8×8 parts for the 2nd mesh code, and the 3rd mesh is divided into 10×10 parts. Divided meshes append one digit per binary subdivision. Integrated meshes use the JIS X 0410 2倍・5倍・10倍 rules; the 2倍 form ends with the marker `5`.

## References

### Specifications and public guidance

- [JSA Webdesk: JIS規格詳細検索](https://webdesk.jsa.or.jp/books/W11M0270/) — the official Japan Standards Association catalogue. Search for `JIS X 0410` to find the current official standard and its publication information. The standard itself may require purchase or access through JSA services.
- [環境省 生物多様性センター: 基準地域メッシュ](https://www.biodic.go.jp/kiso/col_mesh.html) — overview of the standard mesh system and the sizes of the 1st, 2nd, and 3rd meshes.
- [総務省統計局: 市区町村別メッシュ・コード一覧](https://www.stat.go.jp/data/mesh/m_itiran.htm) — official mesh-code datasets published by municipality.
- [国土地理院: 数値地図250mメッシュのファイル仕様](https://www.gsi.go.jp/geoinfo/dmap/dem250m-filespec.html) — examples of mesh-code use in national geospatial data formats.

### Other implementations and cross-checks

- [jismeshcode (Rust)](https://docs.rs/jismeshcode/latest/jismeshcode/) — JIS X 0410 implementation with coordinate conversion, mesh levels, divided meshes, integrated meshes, bounds, and neighbors.
- [jismesh (Python)](https://pypi.org/project/jismesh/) — Python implementation and utilities for converting coordinates and mesh codes.
- [python-geohash (Python)](https://github.com/hkwi/python-geohash) — the repository includes [`jpgrid.py`](https://github.com/hkwi/python-geohash/blob/master/jpgrid.py) and [`jpiarea.py`](https://github.com/hkwi/python-geohash/blob/master/jpiarea.py) for Japanese grid-square calculations in addition to geohash functions.
- [jpmesh (R)](https://cran.r-project.org/package=jpmesh) — R utilities for Japanese mesh-code data and geometry.

For example, the coordinate `35.681236, 139.767125` is in the 3rd mesh `53394611`. This value is also used in the `jismeshcode` documentation as a Tokyo-area mesh-code example. Mesh-code results can differ when coordinates are supplied in the old Tokyo datum rather than the world datum, so the coordinate reference system should be recorded with test data.

## Tests

Run tests with npm:

```bash
npm test
```

## Environment

Works in both Node.js and browsers:

```js
// Node.js
const jpgrid = require('jpgrid');

// Browser
<script src="node_modules/jpgrid/index.js"></script>
<script>
  jpgrid.jpgrid_encode(35.681236, 139.767125);
</script>
```

## License

MIT
