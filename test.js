var assert = require('assert'),
	ac = require('./ac.js'),
	entry,
	handleData;

entry = ac.entry;
handleData = ac.handleData;
	
exports.testRequestConfig = function (entryConfig) {
    function matchEbk() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/-/4,1,5/-/-/true | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Einbaukueche").matchCount, 1);
    }

    function matchProvision() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/-/4,1,5/-/-/-/-/-/-/-/-/-/-/-/-/true | enteredFrom=result_list |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Provisionsfrei").matchCount, 1);
    }

    function matchBalkon() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/-/4,1,5/-/-/-/-/true/-/-/-/-/-/-/-/true | enteredFrom=result_list |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Balkon/Terrasse").matchCount, 1);
    }

    function doNotMatchVicinitySearch() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Umkreissuche/Berlin/Berlin/-/-/-/-/ | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Bundesland").matchCount, 0);
    }

    function doNotMatchError() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/-/ | |HTTP/1.1 |400 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Bundesland").matchCount, 0);
    }

    function doNotMatchPagedRequest() {
        entry.init();
        handleData("|GET |/Suche/S-/P-1/Wohnung-Miete/Berlin/Berlin/-/-/-/-/ | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Bundesland").matchCount, 0);
    }

    function matchLivingTypeCriteriaGroup() {
        var parent;
        
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/-/-/3,6 | |HTTP/1.1 |200 |19261 |275497 |");

        parent = entry.findByName("Wohnungstypen");
        assert.strictEqual(entry.findChildByName("Dachgeschoss", parent).matchCount, 1);
        assert.strictEqual(entry.findChildByName("Loft", parent).matchCount, 1);
    } 
    
    function matchHeatingCriteriaGroup() {
        var parent;
        
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/-/4,1/3,6,128 | |HTTP/1.1 |200 |19261 |275497 |");

        parent = entry.findByName("Heizungsart");
        assert.strictEqual(entry.findChildByName("Ofenheizung", parent).matchCount, 1);
        assert.strictEqual(entry.findChildByName("Etagenheizung", parent).matchCount, 1);
    }      
    
    function matchRooms() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/2,00- | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Zimmer").matchCount, 1);
    }      
    
    function matchArea() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/0,00-90,00/- | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Flaeche").matchCount, 1);
    }      
    
    function matchPrice() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/-/-/-/EURO-500,00-1000,00/-/-/-/true | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Preis").matchCount, 1);
    }         
	
	function matchNewBuilding() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/Lichterfelde-Steglitz/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/true | |HTTP/1.1 |200 |19261 |275497 |");
        assert.strictEqual(entry.findByName("Neubau").matchCount, 1);
    }      
	
	function matchWBS() {
        entry.init();
        handleData("|GET |/Suche/S-/Wohnung-Miete/Berlin/Berlin/Lichterfelde-Steglitz/-/-/-/-/-/false | |HTTP/1.1 |200 |19261 |275497 |");
        
		parent = entry.findByName("Wohnberechtigungsschein");
		assert.strictEqual(parent.matchCount, 1);
        assert.strictEqual(entry.findChildByName("erforderlich", parent).matchCount, 0);
        assert.strictEqual(entry.findChildByName("nicht erforderlich", parent).matchCount, 1);
    }    
    
	entry.config = entryConfig;
	
    matchEbk();
    matchProvision();
    matchBalkon();
    matchLivingTypeCriteriaGroup();
    matchHeatingCriteriaGroup();
    matchRooms();
    matchArea();
    matchPrice();
	matchNewBuilding();
	matchWBS();

    doNotMatchVicinitySearch();
    doNotMatchError();
    doNotMatchPagedRequest();    
}