var fs = require('fs');

var re = /(.+)\.ae/;
var reNum = /.+,(.+)/;
var lines;

function analyze(lines) {
  var LambdaWing = Number(lines[11]) * Math.PI / 180,
      LambdaStab = Number(lines[16]) * Math.PI / 180,
      LambdaVert = Number(lines[21]) * Math.PI / 180,
      lambdaWing = Number(lines[10]),
      lambdaStab = Number(lines[15]),
      lambdaVert = Number(lines[20]),
      lengthFuselage = Number(lines[2]),
      widthFuselage = Number(lines[31]),
      momentFuselage = Number(lines[30]),
      density = Number(lines[28]),
      thickness = Number(lines[27]),
      massNose = Number(lines[6]),
      crWing = Number(lines[9]),
      crStab = Number(lines[14]),
      crVert = Number(lines[19]),
      locationWing = Number(lines[3]) + crWing / 2,
      locationStab = Number(lines[4]) + crStab / 2,
      locationVert = Number(lines[5]) + crVert / 2,
      bWing = Number(lines[8]),
      bStab = Number(lines[13]),
      bVert = Number(lines[18]),
      throwingVel = Number(lines[7]);

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
      SVert = (1/2) * Math.pow(KVert, 2) * (cVert - aVert) + KVert * crVert,
      ctWing = lambdaWing * crWing,
      ctStab = lambdaStab * crStab,
      ctVert = lambdaVert * crVert;
      // locationWing = locationWing + (KWing / 3) * (crWing + 2 * ctWing) / (crWing + ctWing),
      // locationStab = locationStab + (KStab / 3) * (crStab + 2 * ctStab) / (crStab + ctStab),
      // locationVert = locationVert + (KVert / 3) * (crVert + 2 * ctVert) / (crVert + ctVert);

  var QyWing = (1/6) * Math.pow(KWing, 3) * (Math.pow(cWing, 2) - Math.pow(aWing, 2)) + (1/2) * Math.pow(KWing, 2) * cWing * crWing + (1/2) * KWing + Math.pow(crWing, 2),
      QyStab = (1/6) * Math.pow(KStab, 3) * (Math.pow(cStab, 2) - Math.pow(aStab, 2)) + (1/2) * Math.pow(KStab, 2) * cStab * crStab + (1/2) * KStab + Math.pow(crStab, 2),
      QyVert = (1/6) * Math.pow(KVert, 3) * (Math.pow(cVert, 2) - Math.pow(aVert, 2)) + (1/2) * Math.pow(KVert, 2) * cVert * crVert + (1/2) * KVert + Math.pow(crVert, 2);

  var cBarWing = (2/3) * crWing * (1 + lambdaWing + Math.pow(lambdaWing, 2))/(1 + lambdaWing),
      cBarStab = (2/3) * crStab * (1 + lambdaStab + Math.pow(lambdaStab, 2))/(1 + lambdaStab),
      cBarVert = (2/3) * crVert * (1 + lambdaVert + Math.pow(lambdaVert, 2))/(1 + lambdaVert);

  var YWing, YStab, YVert;
      if (lambdaWing === 1) {
        YWing = KWing/2;
      }
      else {
        YWing = (KWing/6) * (1 + 2 * lambdaWing) * (1 + lambdaWing);
      }
      if (lambdaStab === 1) {
        YStab = KStab/2;
      }
      else {
        YStab = (KStab/6) * (1 + 2 * lambdaStab) * (1 + lambdaStab);
      }
      if (lambdaVert === 1) {
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

  // console.log("xlocalStab: " + xlocalStab);
  // console.log("YStab: " + YStab);
  // console.log("LambdaStab: " + LambdaStab);
  // console.log("tan(LambdaStab): " + Math.tan(LambdaStab));
  // console.log("cBarStab: " + cBarStab);
  // console.log("");

  var ARWing = Math.pow(bWing, 2)/SWing,
      ARStab = Math.pow(bStab, 2)/SStab;

  // Helmbold equation: https://www.princeton.edu/~stengel/MAE331Lecture3.pdf
  // Note that this model differs from Aery technical paper
  var CLAlphaWing = Math.PI * ARWing / (1 + Math.sqrt(1 + Math.pow(ARWing/2, 2))),
      CLAlphaStab = Math.PI * ARStab / (1 + Math.sqrt(1 + Math.pow(ARStab/2, 2))),
      rateChangeDownwashWing = 2 * CLAlphaWing / (Math.PI * ARWing),
      rateChangeDownwashStab = 2 * CLAlphaStab / (Math.PI * ARStab);

  var CVert = (xVert - xWing) * SVert / (bWing * SWing);
  // if (CVert < 0.035) {
  //   return 0; // Vertical Tail is too small or poorly placed
  // }

  var CStab = (xStab - xWing) * SStab / (Math.pow(SWing, 2) / bWing);
  // if (CStab < 0.5 && CStab > -0.1) {
  //   return 0; // Incorrect stabilizer sizing or placement
  // }

  var alphaStallWing = 8; //WRONG


  /* Jackson's random calculations */
  var heightWing = bWing / 2;
  var heightStab = bStab / 2;
  var heightVert = bVert;

  var areaWing = 2 * crWing * ctWing * heightWing / 2;
  var areaStab = 2 * crStab * ctStab * heightStab / 2;
  var areaVert = crVert * ctVert * heightVert / 2;



  var center = lengthFuselage / 2,
      massWing = density * thickness * areaWing / Math.pow(10, 3),
      massStab = density * thickness * areaStab / Math.pow(10, 3),
      massVert = density * thickness * areaVert / Math.pow(10, 3),
      massFuselage = lengthFuselage * momentFuselage * 10,
      massTotal = massNose + massWing + massStab + massVert + massFuselage
      // massWing = density * thickness * SWing / Math.pow(10, 3),
      // massStab = density * thickness * SStab / Math.pow(10, 3),
      // massVert = density * thickness * SVert / Math.pow(10, 3),
      // xCOM = ((-1) * center * massNose + (locationWing - center) * massWing
      //                           + (locationStab - center) * massStab
      //                           + (locationVert - center) * massVert)
      //                           / (massNose + massWing + massStab + massVert + massFuselage) + center;

  console.log("Centroid of trapezoid: " + (heightWing / 3) * (crWing + 2 * ctWing) / (crWing + ctWing));
  console.log("Half root: " + (crWing / 2));


  // var locationWing = locationWing + (heightWing / 3) * (crWing + 2 * ctWing) / (crWing + ctWing);
  // var locationStab = locationStab + (heightStab / 3) * (crStab + 2 * ctStab) / (crStab + ctStab);
  // var locationVert = locationVert + (heightVert / 3) * (crVert + 2 * ctVert) / (crVert + ctVert);

  var xCOM = (massFuselage * lengthFuselage/2 + locationWing * massWing
                                              + locationStab * massStab
                                              + locationVert * massVert) / massTotal;

  var hn =  (CLAlphaWing * xWing / cBarWing + 0.9 * SStab * CLAlphaStab * xStab * (1 - rateChangeDownwashWing) / (SWing * cBarStab)) /
            (CLAlphaWing + 0.9 * SStab * CLAlphaStab * (1 - rateChangeDownwashWing) / SWing);
  var hn2 = (CLAlphaWing * xWing / cBarWing + 0.9 * SStab * CLAlphaStab * xStab * (1 - rateChangeDownwashStab) / (SWing * cBarStab)) /
            (CLAlphaWing + 0.9 * SStab * CLAlphaStab * (1 - rateChangeDownwashWing) / SWing);
  var hn3 = (CLAlphaWing * xWing / cBarWing + 0.9 * SStab * CLAlphaStab * xStab * (1 - rateChangeDownwashWing) / (SWing * cBarStab)) /
            (CLAlphaWing + 0.9 * SStab * CLAlphaStab * (1 - rateChangeDownwashStab) / SWing);
  var hn4 = (CLAlphaWing * xWing / cBarWing + 0.9 * SStab * CLAlphaStab * xStab * (1 - rateChangeDownwashStab) / (SWing * cBarStab)) /
            (CLAlphaWing + 0.9 * SStab * CLAlphaStab * (1 - rateChangeDownwashStab) / SWing);

  console.log("Neutral Point: " + hn);
  console.log("1 - rateChangeDownwashWing: " + (1 - rateChangeDownwashWing));
  console.log("xWing: " + xWing);
  console.log("SStab: " + SStab);
  console.log("CLAlphaStab: " + CLAlphaStab);
  console.log("xStab: " + xStab);
  console.log("SWing: " + SWing);
  console.log("cBarStab: " + cBarStab);
  console.log("CLAlphaWing: " + CLAlphaWing);


  var Rs = SStab / SWing,
      k1 = 2 * (massTotal * 9.8) / (density * Math.pow(throwingVel, 2) * SWing),
      k2 = 0.9 * Rs * CLAlphaStab * (xStab - xCOM) / cBarStab,
      k3 = CLAlphaWing * (xCOM - xWing) / cBarWing - 0.9 * Rs * CLAlphaStab * (1 - rateChangeDownwashStab) * (xStab - xCOM) / cBarStab,
      k4 = CLAlphaWing + 0.9 * CLAlphaStab * (1 - rateChangeDownwashStab),
      k5 = 0.9 * Rs * CLAlphaStab,
      ih = k1 / ((k2/ k3) * k4 + k5);

  var alphaFlight = (ih * k2 / k3) * 180 / Math.PI;

  console.log("\n------------------------------");
  console.log("Aery Evaluation Number: " + NaN);
  console.log("Fuselage Length " + lengthFuselage);
  console.log("Wing Location " + locationWing);
  console.log("Stabilizer Location " + locationStab);
  console.log("Vertical Tail Location " + locationVert);
  console.log("Mass at Nose " + massNose + "\n");

  console.log("Center of Gravity Location " + xCOM);
  console.log("Neutral Point Location " + hn);
  console.log("ESTIMATED Mass " + (massWing + massStab + massVert + massNose + massFuselage));
  console.log("Wing Loading " + (massWing + massStab + massVert + massNose + massFuselage) / SWing);
  console.log("");

  console.log("Throwing Velocity " + throwingVel);
  console.log("Flight Angle of Attack " + alphaFlight);
  console.log("Stabilizer Incidence Angle " + NaN);
  console.log("ESTIMATED Stall Angle " + NaN);
  console.log("ESTIMATED Stall Velocity " + NaN);
  console.log("ESTIMATED Glide Angle " + NaN);
  console.log("ESTIMATED CDo " + NaN + "\n");

  console.log("Wing Span " + bWing);
  console.log("Planform Area " + SWing);
  console.log("Wing Root Chord " + crWing);
  console.log("Wing Taper Ratio " + lambdaWing);
  console.log("Wing Tip Chord " + ctWing);
  console.log("Wing Tip Sweep Distance " + NaN);
  console.log("Wing Leading Edge Sweep Angle " + LambdaWing);
  console.log("Wing Aspect Ratio " + ARWing);
  console.log("CL,alpha " + CLAlphaWing + "\n");

  console.log("Stabilizer Span " + bStab);
  console.log("Planform Area " + SStab);
  console.log("Stabilizer Root Chord " + crStab);
  console.log("Stabilizer Taper Ratio " + lambdaStab);
  console.log("Stabilizer Tip Chord " + ctStab);
  console.log("Stabilizer Tip Sweep Distance " + NaN);
  console.log("Stabilizer Leading Edge Sweep Angle " + LambdaStab);
  console.log("Stabilizer Aspect Ratio " + ARStab);
  console.log("CL,alpha " + CLAlphaStab + "\n");

  console.log("Vertical Tail Height " + bVert);
  console.log("Planform Area " + SVert);
  console.log("Vertical Tail Root Chord " + crVert);
  console.log("Vertical Tail Taper Ratio " + lambdaVert);
  console.log("Vertical Tail Tip Chord " + ctVert);
  console.log("Vertical Tail Tip Sweep Distance " + NaN);
  console.log("Vertical Tail Leading Edge Sweep Angle " + LambdaVert);
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
