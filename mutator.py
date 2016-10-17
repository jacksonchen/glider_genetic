import sys
import re
from random import random

def calcChances(num, diff):
    if (random() < 0.2):
        if (random() < 0.5):
            return str(round(float(num) - float(diff), 2))
        else:
            return str(round(float(num) + float(diff), 2))
    return str(num)

def name(fileName):
    return str(generation) + 'A' + str(planeType)

if (len(sys.argv) < 2):
    print("Please add the file to be mutated as an argument.")
else:
    matchObj = re.match(r'(.+)\.ae', sys.argv[1])
    if matchObj is None:
        print("Please enter a valid file")
    else:
        planeChild = 1
        importedLines = open(sys.argv[1], 'r').readlines()
        for i in range(10):
            lines = importedLines
            lines[0] = '"Glider Name",' + matchObj.group(1) + 'a' + str(planeChild) + '\n'
            lines[2] = '"Fuselage Length (cm)",' + calcChances(re.match(r'.+,(.+)', lines[2][:-1]).group(1), 0.5) + '\n'
            lines[3] = '"Wing X Location (cm)",' + calcChances(re.match(r'.+,(.+)', lines[3][:-1]).group(1), 0.5) + '\n'
            lines[4] = '"Stabilizer X Location (cm)",' + calcChances(re.match(r'.+,(.+)', lines[4][:-1]).group(1), 0.5) + '\n'
            lines[5] = '"Vertical Tail X Location (cm)",' + calcChances(re.match(r'.+,(.+)', lines[5][:-1]).group(1), 0.5) + '\n'
            lines[6] = '"Mass at the nose (g)",' + calcChances(re.match(r'.+,(.+)', lines[6][:-1]).group(1), 0.5) + '\n'
            lines[8] = '"Wing Span (cm)",' + calcChances(re.match(r'.+,(.+)', lines[8][:-1]).group(1), 0.5) + '\n'
            lines[9] = '"Wing Root Chord (cm)",' + calcChances(re.match(r'.+,(.+)', lines[9][:-1]).group(1), 0.5) + '\n'
            lines[10] = '"Wing Taper Ratio",' + calcChances(re.match(r'.+,(.+)', lines[10][:-1]).group(1), 0.05) + '\n'
            lines[11] = '"Wing LE Angle (deg.)",' + calcChances(re.match(r'.+,(.+)', lines[11][:-1]).group(1), 0.5) + '\n'
            lines[13] = '"Stabilizer Span (cm)",' + calcChances(re.match(r'.+,(.+)', lines[13][:-1]).group(1), 0.5) + '\n'
            lines[14] = '"Stabilizer Root Chord (cm)",' + calcChances(re.match(r'.+,(.+)', lines[14][:-1]).group(1), 0.5) + '\n'
            lines[15] = '"Stabilizer Taper Ratio",' + calcChances(re.match(r'.+,(.+)', lines[15][:-1]).group(1), 0.05) + '\n'
            lines[16] = '"Stabilizer LE Angle (deg.)",' + calcChances(re.match(r'.+,(.+)', lines[16][:-1]).group(1), 0.5) + '\n'
            lines[18] = '"Vertical Tail Height (cm)",' + calcChances(re.match(r'.+,(.+)', lines[18][:-1]).group(1), 0.5) + '\n'
            lines[19] = '"Vertical Tail Root Chord (cm)",' + calcChances(re.match(r'.+,(.+)', lines[19][:-1]).group(1), 0.5) + '\n'
            lines[20] = '"Vertical Tail Taper Ratio",' + calcChances(re.match(r'.+,(.+)', lines[20][:-1]).group(1), 0.05) + '\n'
            lines[21] = '"Vertical Tail LE Angle (deg.)",' + calcChances(re.match(r'.+,(.+)', lines[21][:-1]).group(1), 0.5) + '\n'


            f = open(matchObj.group(1) + 'a' + str(planeChild) + '.ae', 'w')
            f.writelines(lines)
            f.close()

            planeChild += 1
