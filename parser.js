var musicXML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">'

console.log(musicXML);

function isTitle(c) {
    return /title=[a-zA-Z0-9\- ]+/.test(c);
}

function isAuthor(c) {
    return /author=[a-zA-Z0-9\- ]+/.test(c);
}

function isInstrumentHeader(c) {
    return /[a-zA-Z0-9 \-]+\s*\{/.test(c);
}

function isInstrumentFooter(c) {
    return c == '}';
}

function isMeasure(c) {
    return c[0] == '|';
}

function isMeasureMeta(c) {
    return /\$[TB]{1},\s*[0-9]{1}\/[0-9]{1},\s*[ABCDEF]{1}[b#]{0,1}[mM]{1}\$/.test(c);
}

function isNote(c) {
    return /\([ABCDEF]{1}[b#]{0,1},\s*[0-9]+,\s*[0-9]+\)/.test(c);
}

function isChordHeader(c) {
    return c == '[';
}

function isChordFooter(c) {
    return c == ']';
}

// function isTie(c) {
//     return c == '-';
// }

function isWhitespace(c) {
    return /\s/.test(c);
}

function isNewline(c) {
    return c == "\n";
}

function getMeasureData(input) {
    var measureData = [];
    var c = "";
    var i = 1;
    var advance = function() { 
        return c = input[++i];
    };
    var addToken = function (tokens, lex_obj) {
        tokens.push(lex_obj);
        return tokens;
    };

    chords = [];
    isInChord = false;

    while (i < input.length) {
        // console.log(c);
        c += input[i];
        console.log(c);
        if (isWhitespace(c)) {
            // advance();
            c = "";
            console.log(c);
            i++;
        } else if (isMeasureMeta(c)) {
            measureData = addToken(measureData,{type:"measureMeta",value:c});
            advance();
            console.log(c);
        } else if (isNote(c)) {
            if (!isInChord) {
                measureData = addToken(measureData,{type:"note",value:c});
                // advance();
                c = "";
                i++;
                console.log(c);
            } else {
                chords = addToken(chords,{type:"note",value:/\([ABCDEF]{1}[b#]{0,1},\s*[0-9]+,\s*[0-9]+\)/.exec(c)[0]});
                // advance();
                c = "";
                i++;
                console.log(c);

            }
        } else if (isChordHeader(c)) {
            isInChord = true;
            chords = [];
            c = "";
            i++;
        } else if (isChordFooter(c)) {
            isInChord = false;
            measureData = addToken(measureData,{type:"chord",value:chords});
            c = "";
            i++;
        } else {
            i++;
        }
    }


    return measureData;

} 

function lex(input) {
    var tokens = [];
    var c = "";
    var i = 0;
    var advance = function() { 
        return c = input[++i];
    };

    var addToken = function (tokens, lex_obj) {
        tokens.push(lex_obj);
        return tokens;
    };

    input_split = input.split("\n");
    measures = [];
    measureData = [];
    staveNum = 1;
    measureNum = 0;
    instrument = "";
    isInInstrument = false;

    for (var i = 0; i < input_split.length; i++) {
        line = input_split[i].trim();
        if (isTitle(line)) {
            tokens = addToken(tokens,{type:"title",value:line});
        } else if (isAuthor(line)) {
            tokens = addToken(tokens,{type:"author",value:line});
        } else {
            if (isInstrumentHeader(line)) {
                isInInstrument = true;
                measures = [];
                measureNum = 1;
                staveNum = 0;
                instrument = /[a-zA-Z]+/.exec(line)[0];
            } else {
                if (isMeasure(line)) {
                    staveNum++;
                    measureData = getMeasureData(line);
                    measures = addToken(measures,{type:"measure",value:measureData,staveNum:staveNum,measureNum:measureNum});
                } else if (line=="" && isInInstrument == true) {
                    console.log("hit");
                    staveNum = 0;
                    measureNum++;
                } else if (isInstrumentFooter(line)) {
                    isInInstrument = false;
                    tokens = addToken(tokens,{type:"instrument",instrument:instrument,value:measures});
                }
            }
        }
    }

    return tokens;

}

function test_lex() {
    text = document.getElementById("music_markdown_textarea").value;
    tokens = console.log(lex(text));
    return tokens;
}

// console.log(isMeasureMeta("$T, 4/4, Am$"));

