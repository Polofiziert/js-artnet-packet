# ArtDmx Packet

## Fields
1. ID
2. OpCode
3. ProtVerHi
4. ProtVerLo

5. Sequence + 
6. Physical
7. SubUni +
8. Net +
9. LengthHi
10. LengthLo
11. Data +

12345678  9 10 11 12 13 14 15 16  17 18 19 20 21 22 23 24 25 26 27 28 
00000000  0  0  0  0  0  0  0  0   0  0  0  0  0  0  0  0   00000000

```json
{
  "ID": {
    "length": 64,
    "startBit": 1,
    "endBit": 64,
    "startByte": 1,
    "endByte": 8
  },
  "OpCode": {
    "length": 16,
    "startBit": 65,
    "endBit": 80,
    "startByte": 9,
    "endByte": 10
  },
  "protVerLoHi": {
    "length": 16,
    "startBit": 81,
    "endBit": 96,
    "startByte": 11,
    "endByte": 12
  },
  "sequence": {
    "length": 8,
    "startBit": 97,
    "endBit": 104,
    "startByte": 13,
    "endByte": 13
  },
  "physical": {
    "length": 8,
    "startBit": 105,
    "endBit": 112,
    "startByte": 14,
    "endByte": 14
  },
  "subUni": {
    "length": 8,
    "startBit": 113,
    "endBit": 120,
    "startByte": 15,
    "endByte": 15
  },
  "net": {
    "length": 8,
    "startBit": 121,
    "endBit": 128,
    "startByte": 16,
    "endByte": 16
  },
  "lengthHi": {
    "length": 8,
    "startBit": 129,
    "endBit": 136,
    "startByte": 17,
    "endByte": 17
  },
  "lengthLo": {
    "length": 8,
    "startBit": 137,
    "endBit": 144,
    "startByte": 18,
    "endByte": 18
  },
  "data": {
    "length": "variable",
    "startBit": 145,
    "endBit": "variable",
    "startByte": 19,
    "endByte": "variable"
  }
}

```

