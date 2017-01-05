var fs = require('fs');

var re = /(.+)\.ae/;
var reNum = /.+,(.+)/;

function calcChances(num, diff) {
  if (Math.random() < 0.2) {
    if (Math.random() < 0.5) {
      return Number(Math.round(num - diff + 'e5') + 'e-5');
    }
    else {
      return Number(Math.round(num + diff + 'e5') + 'e-5');
    }
  }
  return num;
}

if (process.argv.length != 3) {
  console.error("Please add the file to be mutated as an argument.");
}
else {
  var found = process.argv[2].match(re);

  if (found == null) {
    console.error("Please enter a valid file");
  }
  else {
    fs.readFile(found[0], 'utf8', function(err, data) {
      if (err) throw err;

      var oldLines = data.split(/(.+\n)/).filter(function(e) {return e});

      for (var i = 1; i < 21; i++) {
        var lines = oldLines.slice();
        lines[0] = '"Glider Name",' + found[1] + 'a' + i + '\n';
        lines[2] = '"Fuselage Length (cm)",' + calcChances(Number(lines[2].match(reNum)[1]), 0.25) + '\n';
        lines[3] = '"Wing X Location (cm)",' + calcChances(Number(lines[3].match(reNum)[1]), 0.25) + '\n';
        lines[4] = '"Stabilizer X Location (cm)",' + calcChances(Number(lines[4].match(reNum)[1]), 0.25) + '\n';
        lines[5] = '"Vertical Tail X Location (cm)",' + calcChances(Number(lines[5].match(reNum)[1]), 0.25) + '\n';
        lines[6] = '"Mass at the nose (g)",' + calcChances(Number(lines[6].match(reNum)[1]), 0.25) + '\n';
        lines[8] = '"Wing Span (cm)",' + calcChances(Number(lines[8].match(reNum)[1]), 0.25) + '\n';
        lines[9] = '"Wing Root Chord (cm)",' + calcChances(Number(lines[9].match(reNum)[1]), 0.25) + '\n';
        lines[10] = '"Wing Taper Ratio",' + calcChances(Number(lines[10].match(reNum)[1]), 0.025) + '\n';
        lines[11] = '"Wing LE Angle (deg.)",' + calcChances(Number(lines[11].match(reNum)[1]), 0.25) + '\n';
        lines[13] = '"Stabilizer Span (cm)",' + calcChances(Number(lines[13].match(reNum)[1]), 0.25) + '\n';
        lines[14] = '"Stabilizer Root Chord (cm)",' + calcChances(Number(lines[14].match(reNum)[1]), 0.25) + '\n';
        lines[15] = '"Stabilizer Taper Ratio",' + calcChances(Number(lines[15].match(reNum)[1]), 0.025) + '\n';
        lines[16] = '"Stabilizer LE Angle (deg.)",' + calcChances(Number(lines[16].match(reNum)[1]), 0.25) + '\n';
        lines[18] = '"Vertical Tail Height (cm)",' + calcChances(Number(lines[18].match(reNum)[1]), 0.25) + '\n';
        lines[19] = '"Vertical Tail Root Chord (cm)",' + calcChances(Number(lines[19].match(reNum)[1]), 0.25) + '\n';
        lines[20] = '"Vertical Tail Taper Ratio",' + calcChances(Number(lines[20].match(reNum)[1]), 0.025) + '\n';
        lines[21] = '"Vertical Tail LE Angle (deg.)",' + calcChances(Number(lines[21].match(reNum)[1]), 0.25) + '\n';

        var stream = fs.createWriteStream(found[1] + 'a' + i + '.ae');
        lines.forEach(function(line) {
          stream.write(line);
        });
        stream.end();
      }
    });
  }
}
