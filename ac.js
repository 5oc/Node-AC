var fs = require('fs'),
    lazy = require('lazy'),
    status,
    entry;

status = {
    lineCounter: 0,
    matchedLines: 0,
    print: function () {
        console.log("");
        console.log("analysed requests: " + status.lineCounter);
        console.log("matched request: " + status.matchedLines);
    },
    init: function () {
        status.lineCounter = 0;
        status.matchedLines = 0;
    }
};

entry = {
    config: null,
    matchChildren: function (children, id) {
        forEachArray(children, function (child){
            if (child.id === id) {
                child.matchCount += 1;
            }
        });
    },
    matchByPosition: function (wantedPosition, slot) {
        forEachArray(entry.config, function (criteria) {
            if (criteria.position === wantedPosition) {
                criteria.matchCount += 1;
                forEachArray(slot.split(","), function (id){
                    entry.matchChildren(criteria.children, id); 
                });
            }
        });
    },
    findByName: function (name) {
        var match = null;
        forEachArray(entry.config, function (criteria) {
            if (criteria.name === name) {
                match = criteria;
            }
        });

        return match;
    },
    findChildByName: function (name, criteria) {
        var match = null;
        forEachArray(criteria.children, function (child) {
            if (child.name === name) {
                match = child;
            }
        });

        return match;        
    },
    init: function () {
        forEachArray(entry.config, function (criteria) {
            criteria.matchCount = 0;
            forEachArray(criteria.children, function (child) {
                child.matchCount = 0;
            });
        });
    },
    print: function () {
        console.log("");
        forEachArray(entry.config, function (criteria) {
            console.log(criteria.matchCount + " " + criteria.name);
            forEachArray(criteria.children, function (child) {
                console.log("  " + child.matchCount + " " + child.name);
            });
        });
    },
	isValid: function (line) {
		var valid = true;

		//http status code ok
		if (line.search(/\|HTTP\/1.1 \|200 \|/) === -1) {
			valid = false;
		}

		//no vicinity search
		if (line.search(/\|\/Suche\/[^\|]*\/Umkreissuche.*/) >= 0) {
			valid = false;
		}

		//no paged requests
		if (line.search(/\|\/Suche\/[^\|]*\/P-.*/) >= 0) {
			valid = false;
		}

		return valid;
	}	
};

function forEachArray(oneArray, callbackFunction) {
    var i, length, arrayElement;
    if (oneArray) {
        length = oneArray.length;
        for (i = 0; i < length; i += 1) {
            arrayElement = oneArray[i];
            callbackFunction(arrayElement, i);
        }
    }
}

function matchSlotsToCriteria(slots) {
    forEachArray(slots, function (slot, index) {
        if (slot !== "-") {
            entry.matchByPosition(index, slot);
        }
    });
}

function handleData(line) {
    var matchingGroup, match, slots;
    
    line = line.toString();
    
    if (status.lineCounter % 100000 === 0) {
        console.log("processing line: " + status.lineCounter);
    }

    matchingGroup = line.match(/(GET \|\/Suche\/[^\|]*\/Wohnung-Miete\/)([^ \|]*)/);
    if (matchingGroup && matchingGroup.length >= 2 && entry.isValid(line)) {
        match = matchingGroup[2];
        slots = match.split(/\//);
        matchSlotsToCriteria(slots);
        status.matchedLines += 1;
    }

    status.lineCounter += 1;
}

function readFile(filePath) {
    var readStream;

    console.log("reading file: " + filePath);

    readStream = fs.createReadStream(filePath, {flags: 'r', encoding: 'UTF-8'});
    new lazy(readStream).lines.forEach(handleData);
    readStream.on("error", function (err) {
        console.error("An error occurred: %s", err);
    });
    readStream.on("close", function () {
        entry.print();
        status.print();
    });
}

function ac(argv, config) {

	entry.config = config;

    if (argv[2]) {
        entry.init();
        status.init();
        readFile(argv[2]);
    } else {
        console.log("need a file path");
        console.log(">node ac.js [filePath]");
    }
}

exports.ac = ac;
exports.entry = entry;
exports.handleData = handleData;