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

      var oldLines = data.split(/(?=\n)/).slice(0, -1);
      for (var i = 1; i < 21; i++) {
        var lines = oldLines.slice();
        lines[0] = '"Glider Name",' + found[1] + 'a' + i;
        lines[2] = '\n"Fuselage Length (cm)",' + calcChances(Number(lines[2].match(reNum)[1]), 0.25);
        lines[3] = '\n"Wing X Location (cm)",' + calcChances(Number(lines[3].match(reNum)[1]), 0.25);
        lines[4] = '\n"Stabilizer X Location (cm)",' + calcChances(Number(lines[4].match(reNum)[1]), 0.25);
        lines[5] = '\n"Vertical Tail X Location (cm)",' + calcChances(Number(lines[5].match(reNum)[1]), 0.25);
        lines[6] = '\n"Mass at the nose (g)",' + calcChances(Number(lines[6].match(reNum)[1]), 0.25);
        lines[8] = '\n"Wing Span (cm)",' + calcChances(Number(lines[8].match(reNum)[1]), 0.25);
        lines[9] = '\n"Wing Root Chord (cm)",' + calcChances(Number(lines[9].match(reNum)[1]), 0.25);
        lines[10] = '\n"Wing Taper Ratio",' + calcChances(Number(lines[10].match(reNum)[1]), 0.025);
        lines[11] = '\n"Wing LE Angle (deg.)",' + calcChances(Number(lines[11].match(reNum)[1]), 0.25);
        lines[13] = '\n"Stabilizer Span (cm)",' + calcChances(Number(lines[13].match(reNum)[1]), 0.25);
        lines[14] = '\n"Stabilizer Root Chord (cm)",' + calcChances(Number(lines[14].match(reNum)[1]), 0.25);
        lines[15] = '\n"Stabilizer Taper Ratio",' + calcChances(Number(lines[15].match(reNum)[1]), 0.025);
        lines[16] = '\n"Stabilizer LE Angle (deg.)",' + calcChances(Number(lines[16].match(reNum)[1]), 0.25);
        lines[18] = '\n"Vertical Tail Height (cm)",' + calcChances(Number(lines[18].match(reNum)[1]), 0.25);
        lines[19] = '\n"Vertical Tail Root Chord (cm)",' + calcChances(Number(lines[19].match(reNum)[1]), 0.25);
        lines[20] = '\n"Vertical Tail Taper Ratio",' + calcChances(Number(lines[20].match(reNum)[1]), 0.025);
        lines[21] = '\n"Vertical Tail LE Angle (deg.)",' + calcChances(Number(lines[21].match(reNum)[1]), 0.25);

        fs.writeFile(found[1] + 'a' + i + '.ae', lines, 'utf8', function(err) {
          if (err) throw err;
        })
      }
    });
  }
}
