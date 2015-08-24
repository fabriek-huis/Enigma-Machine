
Enigma Machine Usage: 

var enigmaMachine = new EnigmaMachine("MCK", "AAA", "123", "PO ML IU KJ NH YT GB VF RE DC", 1, 2);
//keys, rings, rotors, plugboard, type, ukw

var encrypt = enigmaMachine.Cipher("Hello World");
console.log(encrypt);
//DLTBB QVPQV

var dencrypt = enigmaMachine.Cipher("BANQF QAZDA");
console.log(dencrypt);
//HELLO WORLD


Enigma Machine Paramaters: keys, rings, rotors, plugboard, type 

keys: Key Settings a group of three letters, for example 'AAA'.

rings: Ring Settings a group of three letters, for example 'AAA'.

rotors: Rotor Settings a sequence of 3 numerics ranging 1-5 (12345), for example '123'.

plugboard: Plug Board Settings there must be no more then 13 pairs of characters and an even number of characters. Also you cannot use the same characters more then once. For example 'PO ML IU KJ NH YT GB VF RE DC'.

type: Type Setting relates to the type of enigma machines available options: 

    Enigma I       = 1   UKW = 1,2,3
    Norway Enigma  = 2
    Enigma M3      = 3
    Enigma M4      = 4
    Enigma G       = 5
    G-312          = 6
    G-260          = 7
    G-111          = 8
    Enigma D       = 9
    Enigma K       = 10
    Swiss-K        = 11
    Enigma KD      = 12
    Railway Enigma = 13
    Enigma T       = 14

    Currently Enigma I only available. 
    
ukw: Umkehrwalze (UKW, reflector type). depending on the Enigma Machine type selected the UKW will be different (see type above for parameters). 

message: Plain Text message you want to encrypt.