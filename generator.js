var fs = require('fs');

var planeType = 1

function rand(start, end) {
  if (start < 1 && start > 0) {
    return Number(Math.round(Math.random() * (end - start) + start + 'e5') + 'e-5');
  }
  else {
    return Math.round(Math.random() * (end - start) + start);
  }
}

function makePlane(planeType) {
  var stream = fs.createWriteStream(planeType + '.ae');
  stream.once('open', function(fd) {
    stream.write('"Glider Name",' + planeType + '\n');
    stream.write('"1 Piece of Wood",0\n');
    stream.write('"Fuselage Length (cm)",' + rand(18, 27) + '\n');
    stream.write('"Wing X Location (cm)",' + rand(18, 27) + '\n');
    stream.write('"Stabilizer X Location (cm)",' + rand(18, 27) + '\n');
    stream.write('"Vertical Tail X Location (cm)",' + rand(18, 27) + '\n');
    stream.write('"Mass at the nose (g)",' + rand(0, 30) + '\n');
    stream.write('"Throwing Velocity (km/hr)",20\n');
    stream.write('"Wing Span (cm)",' + rand(1, 27) + '\n');
    stream.write('"Wing Root Chord (cm)",' + rand(1, 10) + '\n');
    stream.write('"Wing Taper Ratio",' + rand(0.4, 1) + '\n');
    stream.write('"Wing LE Angle (deg.)",' + rand(0, 30) + '\n');
    stream.write('"Wing Sweep Type",0\n');
    stream.write('"Stabilizer Span (cm)",' + rand(1, 27)+ '\n');
    stream.write('"Stabilizer Root Chord (cm)",' + rand(1, 10) + '\n');
    stream.write('"Stabilizer Taper Ratio",' + rand(0.4, 1) + '\n');
    stream.write('"Stabilizer LE Angle (deg.)",' + rand(0, 30) + '\n');
    stream.write('"Stabilizer Sweep Type",0\n');
    stream.write('"Vertical Tail Height (cm)",' + rand(1, 27) + '\n');
    stream.write('"Vertical Tail Root Chord (cm)",' + rand(1, 10) + '\n');
    stream.write('"Vertical Tail Taper Ratio",' + rand(0.4, 1) + '\n');
    stream.write('"Vertical Tail LE Angle (deg.)",' + rand(0, 30) + '\n');
    stream.write('"Vertical Tail Sweep Type",0\n');
    stream.write('"configuration filename",""\n');
    stream.write('"configuration name","3/16x3/8x36 spruce, 1/8x4x48 balsa"\n');
    stream.write('"maximum wing span (cm)",27\n');
    stream.write('"maximum wing width (cm)",11\n');
    stream.write('"wing thickness (cm)",.32\n');
    stream.write('"wing density (kg/m^3)",.16\n');
    stream.write('"max fuselage length (cm)",27\n');
    stream.write('"fuselage mass/length (kg/m)",.01666\n');
    stream.write('"fuselage width (top) (cm)",.4763\n');
    stream.write('"fuselage depth (side) (cm)",.9525\n');
    stream.write('"max nose mass (grams)",30\n');
    stream.write('"airfoil section lift coefficient",5.7\n');
    stream.write('"air density (kg/m^3)",1.22\n');
    stream.end();
  });
}

for (var i = 0; i < 50; i++) {
  makePlane(planeType);
  planeType += 1;
}
