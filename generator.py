from random import random
from random import randint


def rand(start, end):
    if (start == 0.4):
        return str(round(random() * (end - start) + start, 5))
    else:
        return str(randint(start, end))

def makePlane(planeType):
    f = open(str(planeType) + '.ae', 'w')
    f.write('"Glider Name",' + str(planeType) + '\n')
    f.write('"1 Piece of Wood",0\n')
    f.write('"Fuselage Length (cm)",' + rand(18, 90) + '\n')
    f.write('"Wing X Location (cm)",' + rand(18, 90) + '\n')
    f.write('"Stabilizer X Location (cm)",' + rand(18, 90) + '\n')
    f.write('"Vertical Tail X Location (cm)",' + rand(18, 90) + '\n')
    f.write('"Mass at the nose (g)",' + rand(0, 30) + '\n')
    f.write('"Throwing Velocity (km/hr)",20\n')
    f.write('"Wing Span (cm)",' + rand(1, 120) + '\n')
    f.write('"Wing Root Chord (cm)",' + rand(1, 10) + '\n')
    f.write('"Wing Taper Ratio",' + rand(0.4, 1) + '\n')
    f.write('"Wing LE Angle (deg.)",' + rand(0, 30) + '\n')
    f.write('"Wing Sweep Type",0\n')
    f.write('"Stabilizer Span (cm)",' + rand(1, 120) + '\n')
    f.write('"Stabilizer Root Chord (cm)",' + rand(1, 10) + '\n')
    f.write('"Stabilizer Taper Ratio",' + rand(0.4, 1) + '\n')
    f.write('"Stabilizer LE Angle (deg.)",' + rand(0, 30) + '\n')
    f.write('"Stabilizer Sweep Type",0\n')
    f.write('"Vertical Tail Height (cm)",' + rand(1, 120) + '\n')
    f.write('"Vertical Tail Root Chord (cm)",' + rand(1, 10) + '\n')
    f.write('"Vertical Tail Taper Ratio",' + rand(0.4, 1) + '\n')
    f.write('"Vertical Tail LE Angle (deg.)",' + rand(0, 30) + '\n')
    f.write('"Vertical Tail Sweep Type",0\n')
    f.write('"configuration filename",""\n')
    f.write('"configuration name","3/16x3/8x36 spruce, 1/8x4x48 balsa"\n')
    f.write('"maximum wing span (cm)",121.92\n')
    f.write('"maximum wing width (cm)",10.16\n')
    f.write('"wing thickness (cm)",.32\n')
    f.write('"wing density (kg/m^3)",132.51\n')
    f.write('"max fuselage length (cm)",91.44\n')
    f.write('"fuselage mass/length (kg/m)",.01666\n')
    f.write('"fuselage width (top) (cm)",.4763\n')
    f.write('"fuselage depth (side) (cm)",.9525\n')
    f.write('"max nose mass (grams)",30\n')
    f.write('"airfoil section lift coefficient",5.7\n')
    f.write('"air density (kg/m^3)",1.22\n')
    f.close()

planeType = 1
for i in range(50):
    makePlane(planeType)
    planeType += 1
