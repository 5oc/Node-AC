var ac = require('./ac.js').ac,
	testRequestConfig = require('./test.js').testRequestConfig,
	searchEntryConfig;


searchEntryConfig = [
	{position: 0, name: "Bundesland"},
	{position: 1, name: "Stadt"},
	{position: 2, name: "Quarter"},
	{position: 3, name: "Zimmer"},
	{position: 4, name: "Flaeche"},
	{position: 5, name: "Preis"},
	{position: 6, name: "Heizungsart", children: [
		{id: "4", name: "Ofenheizung"},
		{id: "1", name: "Etagenheizung"},
		{id: "5", name: "Zentralheizung"}            
	]},
	{position: 7, name: "Wohnungstypen", children: [
		{id: "3", name: "Dachgeschoss"},
		{id: "6", name: "Loft"},
		{id: "7", name: "Maisonette"},
		{id: "8", name: "Penthouse"},
		{id: "40", name: "Terassenwohnung"},
		{id: "128", name: "Souterrain"},
		{id: "117", name: "Erdgeschoss"},
		{id: "118", name: "Etagenwohnung"},
		{id: "127", name: "Hochparterre"},
		{id: "113", name: "Sonstige"}
	]},
	{position: 8, name: "Wohnberechtigungsschein", children: [
		{id: "true", name: "erforderlich"},
		{id: "false", name: "nicht erforderlich"}
	]},
	{position: 9, name: "Einbaukueche"},
	{position: 10, name: "Garage/Stellplatz"},
	{position: 11, name: "Balkon/Terrasse"},
	{position: 12, name: "Garten/-mitnutzung"},
	{position: 13, name: "Personenaufzug"},
	{position: 14, name: "Keller"},
	{position: 15, name: "Barrierefrei"},
	{position: 16, name: "Seniorengerechtes Wohnen"},
	{position: 18, name: "Gaeste-WC"},
	{position: 19, name: "Provisionsfrei"},
	{position: 20, name: "Neubau"}
];


testRequestConfig(searchEntryConfig);
ac(process.argv, searchEntryConfig);