const fs = require('fs');
const xmlstream = require('xml-stream');

// Setup read stream for XML parsing.
const stream = fs.createReadStream('./data/register.xml');
const xml = new xmlstream(stream);

let results = [];

// Parse XML data.
xml.collect('ns:Statistik');
xml.on('endElement: ns:Statistik', (item) => {
    
  const data = {
    regNr:          item['ns:RegistreringNummerNummer'],
    ident:          item['ns:KoeretoejIdent'],
    artNavn:        item['ns:KoeretoejArtNavn'],
    anvNavn:        item['ns:KoeretoejAnvendelseStruktur']?.['ns:KoeretoejAnvendelseNavn'],
    foersteRegDato: item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejOplysningFoersteRegistreringDato'].slice(0,10),
    oplStatus:      item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejOplysningStatus'],
    oplStatusDato:  item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejOplysningStatusDato'].slice(0,10),
    stelNr:         item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejOplysningStelNummer'],
    totalVaegt:     item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejOplysningTotalVaegt'],
    egenVaegt:      item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejOplysningEgenVaegt'],
    maerke:         item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejBetegnelseStruktur']?.['ns:KoeretoejMaerkeTypeNavn'],
    model:          item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejBetegnelseStruktur']?.['ns:Model']?.['ns:KoeretoejModelTypeNavn'],
    variant:        item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejBetegnelseStruktur']?.['ns:Variant']?.['ns:KoeretoejVariantTypeNavn'],
    kmPerLiter:     item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejMotorStruktur']?.['ns:KoeretoejMotorKmPerLiter'],
    drivkraft:      item['ns:KoeretoejOplysningGrundStruktur']?.['ns:KoeretoejMotorStruktur']?.['ns:DrivkraftTypeStruktur']?.['ns:DrivkraftTypeNavn'],
    synKmStand:     item['ns:SynResultatStruktur']?.['ns:KoeretoejMotorKilometerstand'],
    regStatus:      item['ns:KoeretoejRegistreringStatus'],
    regStatusDato:  item['ns:KoeretoejRegistreringStatusDato'].slice(0,10)
  };

  results.push(data);
  
  // Log progress to console
  if ((results.length % 1000) === 0 && results.length > 0) console.log('1000 more has been parsed - parsed in total: ', results.length);

});

// The end of the XML file has been reached.
xml.on('end', () => {
  const data = JSON.stringify(results);

  fs.writeFile('output.json', data, (error) => {
    if (error) {
      throw error;
    }
  })
});
