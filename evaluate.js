var getFifths = {
    "CM": 0,
    "Am": 0,
    "GM": 1,
    "Em": 1,
    "DM": 2,
    "Bm": 2,
    "AM": 3,
    "F#m": 3,
    "EM": 4,
    "C#M": 4,
    "BM": 5,
    "G#m": 5,
    "F#M": 6,
    "D#m": 6,
    "C#M": 7,
    "A#m": 7,
    "FM": -1,
    "Dm": -1,
    "BbM": -2,
    "Gm": -2,
    "EbM": -3,
    "Cm": -3,
    "AbM": -4,
    "Fm": -4,
    "DbM": -5,
    "Bbm": -5,
    "GbM": -6,
    "Ebm": -6,
    "CbM": -7,
    "Abm": -7
};

var maxStave = 0;
var lastMeasureNumber = 0;

var initializedAttributes = false;
var lastTimeSig = "";
var lastKey = "";

function evaluate(lexedInfo) {
    lastMeasureNumber = 0;
    function handleNote(note, isChord, staffNo) {
        let noteElem = xmlDoc.createElement("note");

        let staffElem = xmlDoc.createElement("staff");
        staffElem.innerHTML = staffNo;

        noteElem.appendChild(staffElem);

        let noteData = note.substring(1, note.length - 1).split(",");
        console.log(noteData);

        let markdownNote = noteData[0].substring(0,1);
        let isRest = false;
        if (markdownNote === "R") {
            isRest = true;
        }
        let mardownAlter = noteData[0].substring(1,2);
        let markdownOctave = noteData[1];
        let markdownDuration = noteData[2];
        let markdownType = noteData[3]; 

        let pitchElem = xmlDoc.createElement("pitch");
        let stepElem = xmlDoc.createElement("step");
        let alterElem = xmlDoc.createElement("alter");
        let octaveElem = xmlDoc.createElement("octave");
        let typeElem = xmlDoc.createElement("type");
        let durationElem = xmlDoc.createElement("duration");
        if (isRest) {
            var restElem = xmlDoc.createElement("rest");
            restElem.setAttribute("measure","yes");
        }
        
        stepElem.innerHTML = markdownNote;
        if (mardownAlter == "b") {
            alterElem.innerHTML = "-1";
        } else if (mardownAlter == "#") {
            alterElem.innerHTML = "1";
        }

        octaveElem.innerHTML = markdownOctave;
        durationElem.innerHTML = markdownDuration;
        typeElem.innerHTML = markdownType;
        // typeElem.innerHTML = "quarter";

        pitchElem.appendChild(stepElem);
        pitchElem.appendChild(alterElem);
        pitchElem.appendChild(octaveElem);

        if (isRest) {
            noteElem.appendChild(restElem);
            noteElem.appendChild(durationElem);
            return noteElem;
        }
        noteElem.appendChild(pitchElem);
        noteElem.appendChild(durationElem);
        noteElem.appendChild(typeElem);

        if (isChord) {
            let chordElem = xmlDoc.createElement("chord");
            noteElem.appendChild(chordElem);
        }

        return noteElem;
    }

    function handleMeasure (measure) {
        // let tempString = "";
        let measureNode = "";
        if (measure.measureNum == lastMeasureNumber) {
            console.log("hit eq "+lastMeasureNumber);
            let measureNodes = xmlDoc.getElementsByTagName("measure");
            console.log(measureNodes.length);
            for (let i = 0; i < measureNodes.length; i++) {
                console.log(measureNodes[i].getAttribute("number")+" "+lastMeasureNumber);
                if (measureNodes[i].getAttribute("number") == lastMeasureNumber) {
                    measureNode = measureNodes[i];
                    break;
                }
            }
        } else {
            console.log("hit not eq");
            measureNode = xmlDoc.createElement("measure");
            measureNode.setAttribute("number",measure.measureNum);
        }

        let measureLexElems = measure.value;
        // let staveElem = xmlDoc.createElement("staves");
        for (let i = 0; i < measureLexElems.length; i++) {
            measureLexElem = measureLexElems[i];
            if (measure.measureNum == 1 && i == 0 && measureLexElem.type != "measureMeta") {
                console.log(measure.measureNum, measureLexElem.type);
                throw "Syntax Error";
            }
            if (measureLexElem.type == "measureMeta") {
                let attributesElem = "";
                let staveElem = "";
                // will only be one element
                console.log(measureNode);
                let attributesElems = measureNode.getElementsByTagName("attributes");
                if (attributesElems.length != 0) {
                    attributesElem = attributesElems[0];
                    staveElem = attributesElem.getElementsByTagName("staves")[0];
                } else {    
                    attributesElem = xmlDoc.createElement("attributes");
                    staveElem = xmlDoc.createElement("staves");
                }

                console.log(attributesElem);
                let measureMeta = measureLexElem.value.substring(1,measureLexElem.value.length - 1).split(",");
                
                let markdownClef = measureMeta[0];
                let markdownTimeSig = measureMeta[1];
                let markdownKeySig = measureMeta[2];
                
                let xmlClef = "";
                if (markdownClef == "T") {
                    xmlClef = "G";
                } else if (markdownClef == "B") {
                    xmlClef = "F";
                } else {
                    throw "Syntax Error";
                }
                console.log(measure+" "+measure.staveNum);
                let clefElem = xmlDoc.createElement("clef");
                if (measure.staveNum > maxStave) {
                    staveElem.innerHTML = measure.staveNum;

                }
                if (attributesElem.getElementsByTagName("staves").length == 0) {
                    attributesElem.appendChild(staveElem);
                }
                
                clefElem.setAttribute("number",measure.staveNum);
                let clefSignElem = xmlDoc.createElement("sign");
                clefSignElem.innerHTML = xmlClef;
                let clefLineElem = xmlDoc.createElement("line");
                clefLineElem.innerHTML = "2";
                clefElem.appendChild(clefSignElem);
                clefElem.appendChild(clefLineElem);
                attributesElem.appendChild(clefElem);
                
                if (attributesElem.getElementsByTagName("divisions").length == 0) {
                    let divisionsElem = xmlDoc.createElement("divisions");
                    divisionsElem.innerHTML = "24";
                    attributesElem.appendChild(divisionsElem);
                }

                if (attributesElem.getElementsByTagName("time").length == 0) {
                    let timeSigElem = xmlDoc.createElement("time");
                    let beatsElem = xmlDoc.createElement("beats");
                    let beatsTypeElem = xmlDoc.createElement("beats-type");

                    let beatsLexData = markdownTimeSig.split("/");

                    beatsElem.innerHTML = beatsLexData[0];
                    beatsTypeElem.innerHTML = beatsLexData[1];
                    
                    timeSigElem.appendChild(beatsElem);
                    timeSigElem.appendChild(beatsTypeElem);
                    attributesElem.appendChild(timeSigElem);
                }

                if (attributesElem.getElementsByTagName("key").length == 0) {
                    let keySigElem = xmlDoc.createElement("key");
                    let fifthsElem = xmlDoc.createElement("fifths");

                    fifthsElem.innerHTML = getFifths[markdownKeySig];
                    
                    keySigElem.appendChild(fifthsElem);
                    attributesElem.appendChild(keySigElem);
                }
                
                if (measureNode.getElementsByTagName("attributes").length == 0) {
                    measureNode.insertBefore(attributesElem,measureNode.firstChild);
                }
            } else if (measureLexElem.type == "futureMeasureMeta") {
                let attributesElem = "";
                // will only be one element
                console.log(measureNode);
                let attributesElems = measureNode.getElementsByTagName("attributes");
                if (attributesElems.length != 0) {
                    attributesElem = attributesElems[0];
                } else {    
                    attributesElem = xmlDoc.createElement("attributes");
                }

                let measureMeta = measureLexElem.value.substring(1,measureLexElem.value.length - 1).split(",");
                
                let markdownTimeSig = measureMeta[0];
                let markdownKeySig = measureMeta[1];

                if (attributesElem.getElementsByTagName("time").length == 0) {
                    let timeSigElem = xmlDoc.createElement("time");
                    let beatsElem = xmlDoc.createElement("beats");
                    let beatsTypeElem = xmlDoc.createElement("beats-type");

                    let beatsLexData = markdownTimeSig.split("/");

                    beatsElem.innerHTML = beatsLexData[0];
                    beatsTypeElem.innerHTML = beatsLexData[1];
                    
                    timeSigElem.appendChild(beatsElem);
                    timeSigElem.appendChild(beatsTypeElem);
                    attributesElem.appendChild(timeSigElem);
                }

                if (attributesElem.getElementsByTagName("key").length == 0) {
                    let keySigElem = xmlDoc.createElement("key");
                    let fifthsElem = xmlDoc.createElement("fifths");

                    fifthsElem.innerHTML = getFifths[markdownKeySig];
                    
                    keySigElem.appendChild(fifthsElem);
                    attributesElem.appendChild(keySigElem);
                }
                if (measureNode.getElementsByTagName("attributes").length == 0) {
                    measureNode.insertBefore(attributesElem,measureNode.firstChild);
                }
            } else if (measureLexElem.type == "chord") {
                let chordNotes = measureLexElem.value
                console.log(chordNotes);
                for (let j = 0; j < chordNotes.length; j++) {
                    let firstNote = j==0;
                    let noteXML = handleNote(chordNotes[j].value,!firstNote,measure.staveNum);
                    measureNode.appendChild(noteXML);
                }
            } else if (measureLexElem.type == "note") {
                let noteXML = handleNote(measureLexElem.value,false,measure.staveNum);
                measureNode.appendChild(noteXML);
            }
        }
        return measureNode;

    }
    function handleInstrument (instrument,partNum) {
        maxStave = 0;
        let tempString = "";
        let type = instrument.instrument;
        
        let partList = xmlDoc.getElementsByTagName("part-list")[0];
        
        let scorePart = xmlDoc.createElement("score-part");
        scorePart.id = "P"+partNum;

        let partName = xmlDoc.createElement("part-name");
        partName.innerHTML = type;

        scorePart.appendChild(partName);
        partList.appendChild(scorePart);

        let partMeasures = xmlDoc.createElement("part");
        partMeasures.id = scorePart.id;
        xmlDoc.getElementsByTagName("score-partwise")[0].appendChild(partMeasures);

        let measures = instrument.value;
        for (let i = 0; i < measures.length; i++) {
            if (measures[i].measureNum == 2) {
                initializedAttributes = true;
            }
            let measureXML = handleMeasure(measures[i], false);
            if (measures[i].measureNum != lastMeasureNumber) {
                console.log("appended");
                partMeasures.appendChild(measureXML);
                lastMeasureNumber = measures[i].measureNum;
            }
            
        }

        return partMeasures;
    }
        
    instrumentNum = 0;
    for (var i = 0; i < lexedInfo.length; i++) {
        if (lexedInfo[i].type === "author") {
            // curString += "<work-number>" + lexedInfo[i].value + "</work-title>";

            xmlDoc.getElementsByTagName("work-number")[0].innerHTML = lexedInfo[i].value.substring(7,lexedInfo[i].value.length);
        } else if (lexedInfo[i].type === "title") {
            // curString += "<work-title>" + lexedInfo[i].value + "</work-title>";
            xmlDoc.getElementsByTagName("work-title")[0].innerHTML = lexedInfo[i].value.substring(6,lexedInfo[i].value.length);; 
        } else {
            instrumentNum++;
            lastMeasureNumber = 0;
            // type is instrument
            // if (curString === "<work>") {
            //     // no title/author provided
            //     curString += "<work-title>New Song</work-title></work>";
            // }
            // for (let j = 0; j < lexedInfo[i].value.length; j++) {
            let instrumentXML = handleInstrument(lexedInfo[i],instrumentNum);
            xmlDoc.getElementsByTagName("score-partwise")[0].appendChild(instrumentXML);
            // }
        }
    }

    return xmlDoc;
}