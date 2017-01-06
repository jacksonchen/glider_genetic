var fs = require('fs');

var re = /(.+)\.ae/;
var reNum = /.+,(.+)/;
var lines;

function analyze(lines) {
  var LambdaWing = Number(lines[11]),
      LambdaStab = Number(lines[16]),
      LambdaVert = Number(lines[21]),
      lambdaWing = Number(lines[10]),
      lambdaStab = Number(lines[15]),
      lambdaVert = Number(lines[20]),
      locationWing = Number(lines[3]),
      locationStab = Number(lines[4]),
      locationVert = Number(lines[5]),
      lengthFuselage = Number(lines[2]),
      momentFuselage = Number(lines[30]),
      density = Number(lines[28]),
      thickness = Number(lines[27]),
      massNose = Number(lines[6]),
      crWing = Number(lines[9]),
      crStab = Number(lines[14]),
      crVert = Number(lines[19]),
      bWing = Number(lines[8]),
      bStab = Number(lines[13]),
      bVert = Number(lines[18]);

  var KWing = bWing/2,
      KStab = bStab/2,
      KVert = bVert,
      aWing = Math.tan(LambdaWing),
      aStab = Math.tan(LambdaStab),
      aVert = Math.tan(LambdaVert),
      cWing = (lambdaWing * crWing + KWing * aWing - crWing) / KWing,
      cStab = (lambdaStab * crStab + KStab * aStab - crStab) / KStab,
      cVert = (lambdaVert * crVert + KVert * aVert - crVert) / KVert,
      SWing = 2 * ((1/2) * Math.pow(KWing, 2) * (cWing - aWing) + KWing * crWing),
      SStab = 2 * ((1/2) * Math.pow(KStab, 2) * (cStab - aStab) + KStab * crStab),
      SVert = (1/2) * Math.pow(KVert, 2) * (cVert - aVert) + KVert * crVert;

  var QyWing = (1/6) * Math.pow(KWing, 3) * (Math.pow(cWing, 2) - Math.pow(aWing, 2)) + (1/2) * Math.pow(KWing, 2) * cWing * crWing + (1/2) * KWing + Math.pow(crWing, 2),
      QyStab = (1/6) * Math.pow(KStab, 3) * (Math.pow(cStab, 2) - Math.pow(aStab, 2)) + (1/2) * Math.pow(KStab, 2) * cStab * crStab + (1/2) * KStab + Math.pow(crStab, 2),
      QyVert = (1/6) * Math.pow(KVert, 3) * (Math.pow(cVert, 2) - Math.pow(aVert, 2)) + (1/2) * Math.pow(KVert, 2) * cVert * crVert + (1/2) * KVert + Math.pow(crVert, 2);

  var cBarWing = (2/3) * crWing * (1 + lambdaWing + Math.pow(lambdaWing, 2))/(1 + lambdaWing),
      cBarStab = (2/3) * crStab * (1 + lambdaStab + Math.pow(lambdaStab, 2))/(1 + lambdaStab),
      cBarVert = (2/3) * crVert * (1 + lambdaVert + Math.pow(lambdaVert, 2))/(1 + lambdaVert);

  var YWing, YStab, YVert;
      if (lambdaWing = 1) {
        YWing = KWing/2;
      }
      else {
        YWing = (KWing/6) * (1 + 2 * lambdaWing) * (1 + lambdaWing);
      }
      if (lambdaStab = 1) {
        YStab = KStab/2;
      }
      else {
        YStab = (KStab/6) * (1 + 2 * lambdaStab) * (1 + lambdaStab);
      }
      if (lambdaVert = 1) {
        YVert = KVert/2;
      }
      else {
        YVert = (KVert/6) * (1 + 2 * lambdaVert) * (1 + lambdaVert);
      }

  var xlocalWing = YWing * Math.tan(LambdaWing) + cBarWing/4,
      xlocalStab = YStab * Math.tan(LambdaStab) + cBarStab/4,
      xlocalVert = YVert * Math.tan(LambdaVert) + cBarVert/4,
      xWing = xlocalWing + locationWing,
      xStab = xlocalStab + locationStab,
      xVert = xlocalVert + locationVert;

  var ARWing = Math.pow(bWing, 2)/SWing,
      ARStab = Math.pow(bStab, 2)/SStab;

  // Helmbold equation: https://www.princeton.edu/~stengel/MAE331Lecture3.pdf
  // Note that this model differs from Aery technical paper
  var CLAlphaWing = Math.PI * ARWing / (1 + Math.sqrt(1 + Math.pow(ARWing/2, 2))),
      CLAlphaStab = Math.PI * ARStab / (1 + Math.sqrt(1 + Math.pow(ARStab/2, 2))),
      rateChangeDownwash = 2 * CLAlphaWing / (Math.PI * ARWing);

  var CVert = (xVert - xWing) * SVert / (bWing * SWing);
  // if (CVert < 0.035) {
  //   return 0; // Vertical Tail is too small or poorly placed
  // }

  var CStab = (xStab - xWing) * SStab / (Math.pow(SWing, 2) / bWing);
  // if (CStab < 0.5 && CStab > -0.1) {
  //   return 0; // Incorrect stabilizer sizing or placement
  // }

  var alphaStallWing = 8;

  var center = lengthFuselage / 2,
      massWing = density * thickness * SWing / Math.pow(10, 3),
      massStab = density * thickness * SStab / Math.pow(10, 3),
      massVert = density * thickness * SVert / Math.pow(10, 3),
      massFuselage = lengthFuselage * momentFuselage * 10,
      // xCOM = (center * massNose + (locationWing - center) * massWing
      //                           + (locationStab - center) * massStab
      //                           + (locationVert - center) * massVert)
      //                           / (massNose + massWing + massStab + massVert + lengthFuselage * momentFuselage * 10);
      xCOM = (massFuselage * lengthFuselage/2 + locationWing * massWing
                                              + locationStab * massStab
                                              + locationVert * massVert)
                                              / (massNose + massWing + massStab + massVert + massFuselage);

  var hn = CLAlphaWing * xWing / cBarWing + 0.9 * SStab * CLAlphaStab * xStab * (1 - rateChangeDownwash) / (SWing * cBarStab) /
           (CLAlphaWing + 0.9 * SStab * CLAlphaStab * (1 - rateChangeDownwash) / SWing);

  console.log("Wing: " + locationWing * massWing);
  console.log("locationWing: " + locationWing);
  console.log("massWing: " + massWing);
  console.log("sWing: " + SWing);

  console.log("Stab: " + locationStab * massStab);
  console.log("locationStab: " + locationStab);
  console.log("massWing: " + massStab);
  console.log("sStab: " + SStab);

  console.log("Vert: " + locationVert * massVert);
  console.log("locationVert: " + locationVert);
  console.log("massVert: " + massVert);
  console.log("sVert: " + SVert);

  console.log("Fuselage: " + lengthFuselage * massFuselage);
  console.log("lengthFuselage: " + lengthFuselage);
  console.log("massFuselage: " + massFuselage);
  console.log("Total mass: " + (massNose + massWing + massStab + massVert + lengthFuselage * momentFuselage * 10));
  console.log("Center of mass " + xCOM);

}

if (process.argv.length != 3) {
  console.error("Please add the file to be evaluated as an argument.");
}
else {
  var found = process.argv[2].match(re);

  if (found == null) {
    console.error("Please enter a valid file");
  }
  else {
    fs.readFile(found[0], 'utf8', function(err, data) {
      if (err) throw err;

      lines = data.split(/\n/)
      lines.splice(-1, 1);
      lines.forEach(function(line, index) {
        lines[index] = line.match(reNum)[1];
      });

      analyze(lines);
    });
  }
}
