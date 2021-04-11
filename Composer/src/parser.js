import { evaluate } from './evaluate';

var musicXML =
'<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><work><work-number>Unknown</work-number><work-title>Untitled</work-title></work><defaults><scaling><millimeters>6.35</millimeters><tenths>40</tenths></scaling><page-layout><page-height>1760</page-height><page-width>1360</page-width><page-margins type="both"><left-margin>80</left-margin><right-margin>80</right-margin><top-margin>80</top-margin><bottom-margin>80</bottom-margin></page-margins></page-layout><system-layout><system-margins><left-margin>0</left-margin><right-margin>0</right-margin></system-margins><system-distance>130</system-distance><top-system-distance>70</top-system-distance></system-layout><staff-layout><staff-distance>80</staff-distance></staff-layout><appearance><line-width type="stem">0.8333</line-width><line-width type="beam">5</line-width><line-width type="staff">1.25</line-width><line-width type="light barline">1.875</line-width><line-width type="heavy barline">5</line-width><line-width type="leger">1.875</line-width><line-width type="ending">1.25</line-width><line-width type="wedge">0.8333</line-width><line-width type="enclosure">1.25</line-width><line-width type="tuplet bracket">0.8333</line-width><note-size type="grace">60</note-size><note-size type="cue">60</note-size><distance type="hyphen">100</distance><distance type="beam">8</distance></appearance><music-font font-family="Maestro,engraved" font-size="18"/><word-font font-family="Times New Roman" font-size="9"/><lyric-font font-family="Times New Roman" font-size="10"/></defaults><part-list></part-list></score-partwise>';
var xmlParser = new DOMParser();
export var xmlDoc = xmlParser.parseFromString(musicXML, 'application/xml');

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
  return /\$[TB]{1},\s*[0-9]{1}\/[0-9]{1},\s*[ABCDEFG]{1}[b#]{0,1}[mM]{1}\$/.test(c);
}

function isFutureMeasureMeta(c) {
  return /\$[0-9]{1}\/[0-9]{1},\s*[ABCDEFG]{1}[b#]{0,1}[mM]{1}\$/.test(c);
}
function isNote(c) {
  return /[-]{0,1}\([ABCDEFGR]{1}[b#]{0,1},\s*[0-9]+,\s*[01]{1},\s*[a-z0-9]+\)[-]{0,1}/.test(c);
}

function isRepeat(c) {
  return c == ":";
}

function isCrescendo(c) {
  return /<[0-9]{2}/.test(c);
}

function isDiminuendo(c) {
  return />[0-9]{2}/.test(c);
}

function isNoteHeader(c) {
  return c == "(";
}

function isNoteFooter(c) {
  return c == ")";
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
  return /^\s+$/.test(c);
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

  var chords = [];
  var isInChord = false;
  var isInNote = false;

  while (i < input.length) {
      // console.log(c);
      if (input[i] == " ") {
          i++;
          continue;
      }
      c += input[i];
      console.log(c);
      // if (isWhitespace(c)) {
      //     // advance();
      //     if (!isInChord && !isInNote) {
      //         console.log("hit");
      //         c = "";
      //     }
      //     console.log(c);
      //     i++;
      // } else 
      
      if (isMeasureMeta(c)) {
          measureData = addToken(measureData,{type:"measureMeta",value:c});
          c = "";
          i++;
          console.log(c);
      } else if (isFutureMeasureMeta(c)) {
          measureData = addToken(measureData,{type:"futureMeasureMeta",value:c});
          c = "";
          i++;
          console.log(c);
      } else if (isCrescendo(c)) {
          measureData = addToken(measureData,{type:"crescendo",value:c});
          c = "";
          i++;
          console.log(c);
      } else if (isDiminuendo(c)) {
          measureData = addToken(measureData,{type:"diminuendo",value:c});
          c = "";
          i++;
          console.log(c);
      } else if (isRepeat(c)) {
          measureData = addToken(measureData,{type:"repeat",value:c});
          c = "";
          i++;
          console.log(c);
      } else if (isNote(c)) {
          console.log("hit isnote");
          if (input[i+1] == "-") {
              c+=input[++i];
          }
          if (!isInChord) {
              measureData = addToken(measureData,{type:"note",value:c});
              // advance();
              c = "";
              i++;
              console.log(c);
          } else {
              chords = addToken(chords,{type:"note",value:/[-]{0,1}\([ABCDEFGR]{1}[b#]{0,1},\s*[0-9]+,\s*[01]{1},\s*[a-z0-9]+[-]{0,1}\)/.exec(c)[0]});
              // advance();
              c = "";
              i++;
              isInNote = false;
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
          if (isNoteHeader(c)) {
              console.log("hit noteheader");
              isInNote = true;
          }
          if (isNoteFooter(c)) {
              console.log("hit notefooter");
              isInNote = false;
          }
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

  var input_split = input.split("\n");
  var measures = [];
  var measureData = [];
  var staveNum = 1;
  var measureNum = 0;
  var instrument = "";
  var isInInstrument = false;

  for (var i = 0; i < input_split.length; i++) {
      var line = input_split[i].trim();
      if (isTitle(line)) {
          tokens = addToken(tokens,{type:"title",value:line});
      } else if (isAuthor(line)) {
          tokens = addToken(tokens,{type:"author",value:line});
      } else {
          if (isInstrumentHeader(line)) {
              isInInstrument = true;
              measures = [];
              measureNum = 1;
              var staveNum = 0;
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

var glob_tokens;

export function parse_and_evaluate(str) {
  musicXML =
  '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="3.1"><work><work-number>Unknown</work-number><work-title>Untitled</work-title></work><defaults><scaling><millimeters>6.35</millimeters><tenths>40</tenths></scaling><page-layout><page-height>1760</page-height><page-width>1360</page-width><page-margins type="both"><left-margin>80</left-margin><right-margin>80</right-margin><top-margin>80</top-margin><bottom-margin>80</bottom-margin></page-margins></page-layout><system-layout><system-margins><left-margin>0</left-margin><right-margin>0</right-margin></system-margins><system-distance>130</system-distance><top-system-distance>70</top-system-distance></system-layout><staff-layout><staff-distance>80</staff-distance></staff-layout><appearance><line-width type="stem">0.8333</line-width><line-width type="beam">5</line-width><line-width type="staff">1.25</line-width><line-width type="light barline">1.875</line-width><line-width type="heavy barline">5</line-width><line-width type="leger">1.875</line-width><line-width type="ending">1.25</line-width><line-width type="wedge">0.8333</line-width><line-width type="enclosure">1.25</line-width><line-width type="tuplet bracket">0.8333</line-width><note-size type="grace">60</note-size><note-size type="cue">60</note-size><distance type="hyphen">100</distance><distance type="beam">8</distance></appearance><music-font font-family="Maestro,engraved" font-size="18"/><word-font font-family="Times New Roman" font-size="9"/><lyric-font font-family="Times New Roman" font-size="10"/></defaults><part-list></part-list></score-partwise>';
  xmlParser = new DOMParser();
  xmlDoc = xmlParser.parseFromString(musicXML, 'application/xml');
  // let text = document.getElementById('music_markdown_textarea').value;
  let tokens = lex(str);
  // glob_tokens = tokens;
  var maxStave = 0;
  var lastMeasureNumber = 0;
  var lastStaveNumber = 0;

  var initializedAttributes = false;
  var lastTimeSig = "";
  var lastKey = "";
  var currentVoice = 1;
  var currentChord = "";
  var firstNote = false;
  var oddChordFound = false;
  var openRepeat = false;
  var prevNoteInMeasure = "";

  console.log(tokens);
  xmlDoc = evaluate(tokens);
  let xmlserializer = new XMLSerializer();
  return xmlserializer.serializeToString(xmlDoc);
  // return tokens;
}

// console.log(isMeasureMeta("$T, 4/4, Am$"));

/*
title=me
author=me
piano {
|$T,4/4,Am$ [(A,3,3),(C,3,3),(E,3,3)] (Db,4,3) (Eb,3,3)[(A,3,3),(C,3,3),(E,3,3)]|
|$T,4/4,Am$ [(A,3,3),(C,3,3),(E,3,3)] (Db,4,3) (Eb,3,3)[(A,3,3),(C,3,3),(E,3,3)]|

|$T,4/4,Am$ [(A,3,3),(C,3,3),(E,3,3)] (Db,4,3) (Eb,3,3)[(A,3,3),(C,3,3),(E,3,3)]|
|$T,4/4,Am$ [(A,3,3),(C,3,3),(E,3,3)] (Db,4,3) (Eb,3,3)[(A,3,3),(C,3,3),(E,3,3)]|
}
*/
