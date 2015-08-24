
var EnigmaMachine = function (keys, rings, rotors, plugboard, type, ukw) {
    
    version = "0.0.1";
    
    console.log('Enigma Machine [version: '+version+']');
    
    console.log('Settings:\n'+ 
                'Keys: '+keys+'\n'+
                'Rings: '+rings+'\n'+
                'Rotors: '+rotors+'\n'+
                'Plugboard: '+plugboard+'\n'+
                'Machine Type: '+type+'\n'+
                'UKW Type: '+ukw);
    
    this.Keys = keys.toUpperCase().replace(/[^A-Z]/g, "");
    this.Rings = rings.toUpperCase().replace(/[^A-Z]/g, "");
    this.Rotors = rotors.replace(/[^1-9]/g, "");
    this.Plugboard = plugboard.toUpperCase().replace(/[^A-Z]/g, "");
    this.Type = type;
    this.Machine = MachineType(type,ukw);
    this.UKW = "";
    
    console.log('Machine Type: '+this.Machine);
    
    function MachineType(machine,ukw){
        
        /*
            Machine Types:
            Enigma I       = 1 
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
        */
        
        switch(machine) {
            case 1:
                
                type = "Enigma I";
                this.UKW = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
                
                if(ukw == 1){
                    this.UKW = "EJMZALYXVBWFCRQUONTSPIKHGD"; //UKW-A	
                }else if(ukw == 2){
                    this.UKW = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; //UKW-B
                }else if(ukw == 3){
                    this.UKW = "FVPJIAOYEDRZXWGCTKUQSBNMHL"; //UKW-C
                }
                
                /*
                    UKW-A	EJMZALYXVBWFCRQUONTSPIKHGD	 	 	 
                    UKW-B	YRUHQSLDPXNGOKMIEBFZCWVJAT	 	 	 
                    UKW-C	FVPJIAOYEDRZXWGCTKUQSBNMHL
                */
                
                break;
            case 2:
                type = "Norway Enigma";
                break;
            default:
                type = "Enigma I";
        }
        return type;
    }
};

EnigmaMachine.prototype.Cipher = function(message){
    
    message = message.toUpperCase().replace(/[^A-Z]/g," ");
    
    console.log("Cipher Message: "+message);
    
    var plaintext, ciphertext, keysettings, ringsettings, plugboardsettings, rotorsettings;
    
    plaintext = message.toUpperCase();
    keysettings = this.Keys;
    ringsettings = this.Rings;
    plugboardsettings = this.Plugboard;
    rotorsettings = this.Rotors;
    ciphertext = "";
    
    if(plaintext.length < 1){ alert("please enter some plaintext (letters and numbers only)"); return; }    
    if(keysettings.length != 3){ alert("Key settings must consist of 3 uppercase characters."); return; }
    if(ringsettings.length != 3){ alert("Ring settings must consist of 3 uppercase characters."); return; }
    if(plugboardsettings.length > 26){ alert("There cannot be more than 13 pairs in the plugboard settings."); return; }
    if(plugboardsettings.length % 2 != 0){ alert("There must be an even number of characters in the plugboard settings."); return; }
    if(rotorsettings.length != 3){ alert("Rotor settings must consist of 3 numbers 1-9."); return; }
    
    // interpret the rotor settings (strings 1-8 to int 0-7)
    var rotors = rotorsettings.split("");
    rotors[0]=rotors[0].valueOf()-1;rotors[1]=rotors[1].valueOf()-1;rotors[2]=rotors[2].valueOf()-1; 

    // parse plugboard settings, store as a simple substitution key
    var plugboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var parr = plugboard.split("");
    
    for(i=0,j=1;i<plugboardsettings.length;i+=2,j+=2){
        ichar = plugboard.indexOf(plugboardsettings.charAt(i));
        jchar = plugboard.indexOf(plugboardsettings.charAt(j));
        temp = parr[jchar]; parr[jchar]=parr[ichar]; parr[ichar]=temp;
    }
    plugboard = parr.join("");
    //console.log(plugboard);
    
    // interpret key and ring settings (convert from letters to numbers 0-25)
    key=keysettings.split("");
    key[0]=code(key[0]); key[1]=code(key[1]); key[2]=code(key[2]);
    ring=ringsettings.split("");
    ring[0]=code(ring[0]); ring[1]=code(ring[1]); ring[2]=code(ring[2]);

    // do the actual enigma enciphering  
    for(i=0; i < plaintext.length; i++){
        ch=plaintext.charAt(i);

        // if the current character is not a letter, pass it through unchanged
        if(!ch.match(/[A-Z]/)){
            
            /*
            var characters = "!\"#$%&'()=~|<>?_+*}`{-^¥@[;:],./\_";
            if(characters.indexOf('!') === -1){
                alert("no dash found.");
            }else{
                alert("found.");
            }
            */
            
            ciphertext = ciphertext + ch;
            
        }else{
            key=increment_settings(key,rotors);
            ciphertext = ciphertext + enigma(ch,key,rotors,ring,plugboard);
        }
    }
    
    return "Output: "+ciphertext;
}

function enigma(ch, key, rotors, ring, plugboard){
    // apply plugboard transformation
    ch = simplesub(ch,plugboard);
    // apply rotor transformations from right to left
    ch = rotor(ch,rotors[2],key[2]-ring[2]);
    ch = rotor(ch,rotors[1],key[1]-ring[1]);
    ch = rotor(ch,rotors[0],key[0]-ring[0]);
    // use reflector B
    ch = simplesub(ch,this.UKW);
    // apply inverse rotor transformations from left to right
    ch = rotor(ch,rotors[0]+8,key[0]-ring[0]);
    ch = rotor(ch,rotors[1]+8,key[1]-ring[1]);
    ch = rotor(ch,rotors[2]+8,key[2]-ring[2]);
    // apply plugboard transformation again
    ch = simplesub(ch,plugboard);
    return ch;
}

function increment_settings(key, r){
    //notch = [['Q','Q'],['E','E'],['V','V'],['J','J'],['Z','Z'],['Z','M'],['Z','M'],['Z','M']];
    // The notch array stores the positions at which each rotor kicks over the rotor to its left
    var notch = [[16,16],[4,4],[21,21],[9,9],[25,25],[25,12],[25,12],[25,12]];
    if(key[1] == notch[r[1]][0] || key[1] == notch[r[1]][1]){
        key[0] = (key[0]+1)%26;
        key[1] = (key[1]+1)%26;
    }    
    if(key[2] == notch[r[2]][0] || key[2] == notch[r[2]][1]){
        key[1] = (key[1]+1)%26;
    }
    key[2] = (key[2]+1)%26;   
      return key;
}

// perform a simple substitution cipher
function simplesub(ch, key){
    return key.charAt(code(ch));
}

function rotor(ch, r, offset){
      // The first eight strings represent the rotor substitutions I through VIII. The second 8 are the 
      //  inverse transformations
      var key = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ","AJDKSIRUXBLHWTMCQGZNPYFVOE","BDFHJLCPRTXVZNYEIWGAKMUSQO",
               "ESOVPZJAYQUIRHXLNFTGKDCMWB","VZBRGITYUPSDNHLXAWMJQOFECK","JPGVOUMFYQBENHZRDKASXLICTW",
               "NZJHGRCXMYSWBOUFAIVLPEKQDT","FKQHTLXOCBJSPDZRAMEWNIUYGV",
               // inverses
               "UWYGADFPVZBECKMTHXSLRINQOJ","AJPCZWRLFBDKOTYUQGENHXMIVS","TAGBPCSDQEUFVNZHYIXJWLRKOM",
               "HZWVARTNLGUPXQCEJMBSKDYOIF","QCYLXWENFTZOSMVJUDKGIARPHB","SKXQLHCNWARVGMEBJPTYFDZUIO",
               "QMGYVPEDRCWTIANUXFKZOSLHJB","QJINSAYDVKBFRUHMCPLEWZTGXO"];
     // the following code looks a bit horrible, but it is essentially just doing a simple substitution
     //  taking into account 16 possible keys (8 rotors and their inverses) and the offset (which is calculated
     //  from the indicator and ring settings). The offset essentially shifts the rotor key to the left or right
     var chcode = (code(ch)+26+offset)%26;
     var mapch = (code( key[r].charAt(chcode) ) +26-offset)%26 +65;
     return String.fromCharCode(mapch);
}

// return the number 0-25 given a letter [A-Za-z]
function code(ch){
    return ch.toUpperCase().charCodeAt(0) - 65;
}
