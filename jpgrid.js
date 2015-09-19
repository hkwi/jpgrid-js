(function(root){
	// Coder for Japanese grid square code. (JIS C 6304 / JIS X 0410)
	'use strict';
	var myModule = {};
	if (typeof module !== "undefined" && module.exports) {
		module.exports = myModule;
	} else {
		root.myModule = myModule;
	}
	function _encode(lat, lon, base1) {
		if(base1 === undefined){
			base1 = 80;
		}
		if(lon < 100){
			throw "jpgrid code requires longitude > 100.0";
		}
		lat = Math.floor(lat * base1 * 1.5);
		lon = Math.floor(lon * base1 - 100.0 * base1);
	
		var t = "";
		function prepend(v){
			t = v.toString() + t;
		}
	
		while(base1 > 80) {
			prepend((lat & 1)*2 + (lon & 1) + 1);
			lat>>=1;
			lon>>=1;
			base1>>=1;
		}
	
		if(base1 == 80) {
			prepend(lon%10);
			prepend(lat%10);
			lat = Math.floor(lat/10);
			lon = Math.floor(lon/10);
			base1 = Math.floor(base1/10);
		} else if (base1 == 16) { // Uni5
			prepend((lat & 1)*2 + (lon & 1) + 1)
			lat>>=1;
			lon>>=1;
			base1>>=1;
		} else if (base1 == 40) { // Uni2
			prepend(5);
			prepend((lon % 5) * 2);
			prepend((lat % 5) * 2);
			lat = Math.floor(lat/5);
			lon = Math.floor(lon/5);
			base1 = Math.floor(base1/5);
		}
	
		if(base1 == 8) {
			prepend(lon % 8);
			prepend(lat % 8);
			lat>>=3;
			lon>>=3;
			base1>>=3;
		}
		lat = lat.toString();
		while(lat.length < 2) {
			lat = "0"+lat;
		}
		lon = lon.toString();
		while(lon.length < 2) {
			lon = "0"+lon;
		}
	
		return lat+lon+t;
	}

	function _decode(gridcode){
		var base1 = 1;
		var lat = 0;
		var lon = 0;
		if (gridcode.length > 0) {
			lat = parseInt(gridcode.substring(0,2));
			lon = parseInt(gridcode.substring(2,4));
		}
		if (gridcode.length > 4) {
			lat = (lat<<3) + parseInt(gridcode.substring(4,5));
			lon = (lon<<3) + parseInt(gridcode.substring(5,6));
			base1<<=3;
		}
		if (gridcode.length > 6) {
			if(gridcode.length == 7) {
				i = parseInt(gridcode.substring(6,7)) - 1;
				lat = (lat<<1) + Math.floor(i/2);
				lon = (lon<<1) + (i%2);
				base1<<=1;
			} else {
				lat = lat*10 + parseInt(gridcode.substring(6,7));
				lon = lon*10 + parseInt(gridcode.substring(7,8));
				base1 = base1*10;
			}
		}
		if (gridcode > 8) {
			if (gridcode.substring(8,9)=='5') {
				lat>>=1;
				lon>>=1;
				base1>>=1;
			} else {
				for(var i=8; i<gridcode.length; i++) {
					v = parseInt(gridcode.substring(i,i+1))-1;
					lat = (lat<<1) + Math.floor(v/2);
					lon = (lon<<1) + (v%2);
					base1<<=1
				}
			}
		}
		return [lat, lon, base1]
	}

	myModule.jpgrid_encode = function(lat, lon) { return _encode(lat, lon, 80); }
	myModule.jpgrid_encodeLv1 = function(lat, lon) { return _encode(lat, lon, 1); }
	myModule.jpgrid_encodeLv2 = function(lat, lon) { return _encode(lat, lon, 8); }
	myModule.jpgrid_encodeLv3 = function(lat, lon) { return _encode(lat, lon, 80); }
	myModule.jpgrid_encodeHalf = function(lat, lon) { return _encode(lat, lon, 160); }
	myModule.jpgrid_encodeQuarter = function(lat, lon) { return _encode(lat, lon, 320); }
	myModule.jpgrid_encodeEighth = function(lat, lon) { return _encode(lat, lon, 640); }
	myModule.jpgrid_encodeUni10 = function(lat, lon) { return _encode(lat, lon, 8); }
	myModule.jpgrid_encodeUni5 = function(lat, lon) { return _encode(lat, lon, 16); }
	myModule.jpgrid_encodeUni2 = function(lat, lon) { return _encode(lat, lon, 40); }
	myModule.jpgrid_decode = function(geocode) {
		var d = _decode(geocode);
		// get center position
		var lat = (d[0]<<1)+1;
		var lon = (d[1]<<1)+1;
		var base1 = d[2]<<1;
		return {"lat": lat/(base1*1.5), "lon": lon/base1+100.0}
	};
	myModule.jpgrid_bbox = function(geocode) {
		var d = _decode(geocode);
		return {"west": d[0]/(d[2]*1.5), "south":d[1]/d[2]+100.0, "north":(d[0]+1)/(d[2]*1.5), "east":(d[1]+1)/d[2]+100.0};
	};
})(this);
// jpgrid_encodeHalf(34.709061, 135.206833) == "523501562"
//console.log(module.exports.jpgrid_decode(module.exports.jpgrid_encode(34.709061, 135.206833)));
