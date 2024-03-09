'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [{
      "email": "ldumbreck0@economist.com",
      "displayName": "Lewiss Dumbreck",
      "dob": "1987-04-13",
      "gender": "Male",
      "country": "Argentina"
    }, {
      "email": "lfewster1@soundcloud.com",
      "displayName": "Lee Fewster",
      "dob": "1994-06-23",
      "gender": "Female",
      "country": "Brazil"
    }, {
      "email": "nveck2@purevolume.com",
      "displayName": "Nicki Veck",
      "dob": "2005-10-03",
      "gender": "Female",
      "country": "Indonesia"
    }, {
      "email": "mhold3@is.gd",
      "displayName": "Madelene Hold",
      "dob": "1984-04-04",
      "gender": "Female",
      "country": "United States"
    }, {
      "email": "oteece4@wikispaces.com",
      "displayName": "Olive Teece",
      "dob": "1995-04-12",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "itaillard5@themeforest.net",
      "displayName": "Idelle Taillard",
      "dob": "1986-11-11",
      "gender": "Female",
      "country": "Russia"
    }, {
      "email": "sgethin6@hhs.gov",
      "displayName": "Solomon Gethin",
      "dob": "1998-05-18",
      "gender": "Male",
      "country": "Peru"
    }, {
      "email": "dfevier7@timesonline.co.uk",
      "displayName": "Davey Fevier",
      "dob": "2009-03-12",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "cphilippon8@nydailynews.com",
      "displayName": "Corrina Philippon",
      "dob": "1986-08-15",
      "gender": "Female",
      "country": "Poland"
    }, {
      "email": "kmoneti9@indiatimes.com",
      "displayName": "Kris Moneti",
      "dob": "1984-12-02",
      "gender": "Male",
      "country": "France"
    }, {
      "email": "lstonehama@nationalgeographic.com",
      "displayName": "Lennard Stoneham",
      "dob": "1984-03-14",
      "gender": "Male",
      "country": "Czech Republic"
    }, {
      "email": "rovenb@icio.us",
      "displayName": "Reba Oven",
      "dob": "1990-09-19",
      "gender": "Female",
      "country": "Yemen"
    }, {
      "email": "mremnantc@independent.co.uk",
      "displayName": "Mathew Remnant",
      "dob": "1992-02-14",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "twilsdond@aol.com",
      "displayName": "Thaine Wilsdon",
      "dob": "1982-07-17",
      "gender": "Male",
      "country": "Canada"
    }, {
      "email": "jvasyutkine@msu.edu",
      "displayName": "Jeffrey Vasyutkin",
      "dob": "1976-09-03",
      "gender": "Male",
      "country": "Indonesia"
    }, {
      "email": "dbarabichf@baidu.com",
      "displayName": "Dyane Barabich",
      "dob": "1994-08-12",
      "gender": "Female",
      "country": "Indonesia"
    }, {
      "email": "pcastilleg@bandcamp.com",
      "displayName": "Prisca Castille",
      "dob": "1990-03-17",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "svaulsh@xing.com",
      "displayName": "Sylvester Vauls",
      "dob": "1993-06-09",
      "gender": "Male",
      "country": "Guatemala"
    }, {
      "email": "awigfieldi@reverbnation.com",
      "displayName": "Aguie Wigfield",
      "dob": "1989-11-08",
      "gender": "Male",
      "country": "Colombia"
    }, {
      "email": "tjeffreyj@aboutads.info",
      "displayName": "Terry Jeffrey",
      "dob": "2005-08-16",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "yhowleyk@google.co.uk",
      "displayName": "Yves Howley",
      "dob": "1990-04-18",
      "gender": "Agender",
      "country": "China"
    }, {
      "email": "mgilbanel@fda.gov",
      "displayName": "Morgan Gilbane",
      "dob": "1977-07-09",
      "gender": "Female",
      "country": "Poland"
    }, {
      "email": "asmailm@blogtalkradio.com",
      "displayName": "Asher Smail",
      "dob": "1979-11-12",
      "gender": "Male",
      "country": "Philippines"
    }, {
      "email": "pmiccon@mozilla.org",
      "displayName": "Pebrook Micco",
      "dob": "1983-10-07",
      "gender": "Male",
      "country": "Indonesia"
    }, {
      "email": "bedgcumbeo@jiathis.com",
      "displayName": "Bendicty Edgcumbe",
      "dob": "1976-02-02",
      "gender": "Male",
      "country": "Thailand"
    }, {
      "email": "ewybrewp@whitehouse.gov",
      "displayName": "Emalee Wybrew",
      "dob": "2000-05-06",
      "gender": "Female",
      "country": "Japan"
    }, {
      "email": "waishq@blogspot.com",
      "displayName": "Willis Aish",
      "dob": "1991-07-30",
      "gender": "Male",
      "country": "United States"
    }, {
      "email": "smcivorr@spiegel.de",
      "displayName": "Silvanus McIvor",
      "dob": "2001-07-29",
      "gender": "Male",
      "country": "Pakistan"
    }, {
      "email": "apaytons@virginia.edu",
      "displayName": "Alyosha Payton",
      "dob": "1977-08-02",
      "gender": "Male",
      "country": "Luxembourg"
    }, {
      "email": "afraginot@whitehouse.gov",
      "displayName": "August Fragino",
      "dob": "1992-09-10",
      "gender": "Male",
      "country": "Netherlands"
    }, {
      "email": "eheinemannu@simplemachines.org",
      "displayName": "Eadie Heinemann",
      "dob": "1991-07-13",
      "gender": "Female",
      "country": "Ukraine"
    }, {
      "email": "rboundv@miibeian.gov.cn",
      "displayName": "Rachel Bound",
      "dob": "1993-03-26",
      "gender": "Female",
      "country": "Philippines"
    }, {
      "email": "rdiablew@mysql.com",
      "displayName": "Rhodie Diable",
      "dob": "1991-07-09",
      "gender": "Female",
      "country": "Indonesia"
    }, {
      "email": "sastyx@tinypic.com",
      "displayName": "Starlene Asty",
      "dob": "2008-09-22",
      "gender": "Female",
      "country": "Russia"
    }, {
      "email": "kgraftony@hud.gov",
      "displayName": "Karee Grafton",
      "dob": "1994-12-03",
      "gender": "Female",
      "country": "Dominican Republic"
    }, {
      "email": "mlobliez@tmall.com",
      "displayName": "Morrie Loblie",
      "dob": "1985-12-16",
      "gender": "Male",
      "country": "Russia"
    }, {
      "email": "eshinefield10@liveinternet.ru",
      "displayName": "Ewan Shinefield",
      "dob": "1994-09-07",
      "gender": "Male",
      "country": "Portugal"
    }, {
      "email": "beilert11@facebook.com",
      "displayName": "Bryana Eilert",
      "dob": "1983-12-22",
      "gender": "Genderqueer",
      "country": "Portugal"
    }, {
      "email": "wdannatt12@1688.com",
      "displayName": "Wyndham Dannatt",
      "dob": "1998-05-13",
      "gender": "Male",
      "country": "Vietnam"
    }, {
      "email": "rsentance13@diigo.com",
      "displayName": "Rebecca Sentance",
      "dob": "1984-01-23",
      "gender": "Female",
      "country": "Poland"
    }, {
      "email": "hlarver14@homestead.com",
      "displayName": "Huey Larver",
      "dob": "1986-02-26",
      "gender": "Male",
      "country": "Brazil"
    }, {
      "email": "lworkman15@theglobeandmail.com",
      "displayName": "Lovell Workman",
      "dob": "1977-02-23",
      "gender": "Male",
      "country": "Brazil"
    }, {
      "email": "dfabler16@si.edu",
      "displayName": "Duke Fabler",
      "dob": "2004-04-02",
      "gender": "Male",
      "country": "Portugal"
    }, {
      "email": "frearie17@businessinsider.com",
      "displayName": "Felecia Rearie",
      "dob": "1983-03-25",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "qprendeville18@yandex.ru",
      "displayName": "Quinton Prendeville",
      "dob": "1985-07-15",
      "gender": "Male",
      "country": "Czech Republic"
    }, {
      "email": "coganesian19@shareasale.com",
      "displayName": "Corly Oganesian",
      "dob": "1991-11-15",
      "gender": "Female",
      "country": "Indonesia"
    }, {
      "email": "iglazer1a@pagesperso-orange.fr",
      "displayName": "Isaac Glazer",
      "dob": "2006-04-06",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "fsanper1b@hhs.gov",
      "displayName": "Frederik Sanper",
      "dob": "2003-04-21",
      "gender": "Male",
      "country": "Norway"
    }, {
      "email": "kmcduff1c@example.com",
      "displayName": "Karlan McDuff",
      "dob": "1996-08-09",
      "gender": "Male",
      "country": "Colombia"
    }, {
      "email": "vchamberlaine1d@sciencedaily.com",
      "displayName": "Violette Chamberlaine",
      "dob": "2007-02-14",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "ihabbema1e@topsy.com",
      "displayName": "Inge Habbema",
      "dob": "1991-09-06",
      "gender": "Female",
      "country": "Philippines"
    }, {
      "email": "cvelde1f@forbes.com",
      "displayName": "Cynthy Velde",
      "dob": "1984-02-10",
      "gender": "Female",
      "country": "Philippines"
    }, {
      "email": "cstoeckle1g@zdnet.com",
      "displayName": "Cammie Stoeckle",
      "dob": "1991-08-22",
      "gender": "Female",
      "country": "Philippines"
    }, {
      "email": "odaldan1h@pagesperso-orange.fr",
      "displayName": "Orlan Daldan",
      "dob": "1993-01-08",
      "gender": "Male",
      "country": "Indonesia"
    }, {
      "email": "udelepine1i@over-blog.com",
      "displayName": "Ursa Delepine",
      "dob": "1976-12-06",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "gsowthcote1j@disqus.com",
      "displayName": "Gardie Sowthcote",
      "dob": "1993-01-24",
      "gender": "Male",
      "country": "Chile"
    }, {
      "email": "kdavioud1k@uiuc.edu",
      "displayName": "Kimble Davioud",
      "dob": "1983-04-19",
      "gender": "Male",
      "country": "Indonesia"
    }, {
      "email": "lmcgenn1l@oakley.com",
      "displayName": "Law McGenn",
      "dob": "2003-04-03",
      "gender": "Male",
      "country": "Portugal"
    }, {
      "email": "asawdon1m@last.fm",
      "displayName": "Ariadne Sawdon",
      "dob": "1980-05-09",
      "gender": "Female",
      "country": "Egypt"
    }, {
      "email": "spersence1n@java.com",
      "displayName": "Sofie Persence",
      "dob": "2003-08-08",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "socriane1o@de.vu",
      "displayName": "Susi O'Criane",
      "dob": "2001-12-26",
      "gender": "Female",
      "country": "Russia"
    }, {
      "email": "ilaurens1p@opensource.org",
      "displayName": "Ilene Laurens",
      "dob": "1979-02-09",
      "gender": "Female",
      "country": "Indonesia"
    }, {
      "email": "zbrundrett1q@aboutads.info",
      "displayName": "Zarah Brundrett",
      "dob": "1978-10-24",
      "gender": "Female",
      "country": "Czech Republic"
    }, {
      "email": "bbullion1r@walmart.com",
      "displayName": "Beryle Bullion",
      "dob": "1994-05-31",
      "gender": "Female",
      "country": "Brazil"
    }, {
      "email": "twolpert1s@drupal.org",
      "displayName": "Teressa Wolpert",
      "dob": "1993-10-05",
      "gender": "Female",
      "country": "Ethiopia"
    }, {
      "email": "cbalhatchet1t@imgur.com",
      "displayName": "Carolynn Balhatchet",
      "dob": "2001-07-01",
      "gender": "Female",
      "country": "Indonesia"
    }, {
      "email": "slowrance1u@go.com",
      "displayName": "Syman Lowrance",
      "dob": "1978-03-18",
      "gender": "Male",
      "country": "Malaysia"
    }, {
      "email": "zadolphine1v@theguardian.com",
      "displayName": "Zeke Adolphine",
      "dob": "1996-02-20",
      "gender": "Male",
      "country": "Colombia"
    }, {
      "email": "dbiesty1w@google.ca",
      "displayName": "Darcey Biesty",
      "dob": "1993-02-25",
      "gender": "Female",
      "country": "Poland"
    }, {
      "email": "slarkkem1x@bing.com",
      "displayName": "Salvatore Larkkem",
      "dob": "1992-02-18",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "vcaslane1y@netscape.com",
      "displayName": "Valina Caslane",
      "dob": "1998-02-22",
      "gender": "Female",
      "country": "China"
    }, {
      "email": "mgrzelak1z@ameblo.jp",
      "displayName": "Mabelle Grzelak",
      "dob": "1991-04-01",
      "gender": "Female",
      "country": "Japan"
    }, {
      "email": "ksimacek20@goo.gl",
      "displayName": "Kathye Simacek",
      "dob": "1994-06-21",
      "gender": "Female",
      "country": "Mexico"
    }, {
      "email": "cmacshane21@nymag.com",
      "displayName": "Corie MacShane",
      "dob": "1999-09-18",
      "gender": "Genderfluid",
      "country": "Russia"
    }, {
      "email": "lstockoe22@icio.us",
      "displayName": "Liv Stockoe",
      "dob": "1996-05-05",
      "gender": "Female",
      "country": "Latvia"
    }, {
      "email": "icanavan23@paginegialle.it",
      "displayName": "Illa Canavan",
      "dob": "1998-02-01",
      "gender": "Female",
      "country": "Senegal"
    }, {
      "email": "nissac24@wix.com",
      "displayName": "Norris Issac",
      "dob": "1998-07-27",
      "gender": "Male",
      "country": "Brazil"
    }, {
      "email": "fdundredge25@so-net.ne.jp",
      "displayName": "Fair Dundredge",
      "dob": "2007-08-18",
      "gender": "Male",
      "country": "Czech Republic"
    }, {
      "email": "pcollet26@ebay.com",
      "displayName": "Phaedra Collet",
      "dob": "2004-01-26",
      "gender": "Female",
      "country": "Ukraine"
    }, {
      "email": "bvahey27@bloglovin.com",
      "displayName": "Blondie Vahey",
      "dob": "1990-12-29",
      "gender": "Female",
      "country": "Brazil"
    }, {
      "email": "gstolte28@google.com.br",
      "displayName": "Glenn Stolte",
      "dob": "1997-05-04",
      "gender": "Female",
      "country": "Czech Republic"
    }, {
      "email": "hantal29@techcrunch.com",
      "displayName": "Hillier Antal",
      "dob": "1977-04-03",
      "gender": "Male",
      "country": "Russia"
    }, {
      "email": "ahache2a@odnoklassniki.ru",
      "displayName": "Asher Hache",
      "dob": "1990-11-03",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "mgadd2b@simplemachines.org",
      "displayName": "Marius Gadd",
      "dob": "1989-09-05",
      "gender": "Male",
      "country": "Argentina"
    }, {
      "email": "jchsteney2c@symantec.com",
      "displayName": "Jimmie Chsteney",
      "dob": "1993-12-29",
      "gender": "Male",
      "country": "Brazil"
    }, {
      "email": "lhagergham2d@google.de",
      "displayName": "Laura Hagergham",
      "dob": "1984-10-02",
      "gender": "Female",
      "country": "Ireland"
    }, {
      "email": "kroelofs2e@walmart.com",
      "displayName": "Ken Roelofs",
      "dob": "2002-11-28",
      "gender": "Male",
      "country": "Indonesia"
    }, {
      "email": "mlebourn2f@google.com.au",
      "displayName": "Man Lebourn",
      "dob": "1999-01-18",
      "gender": "Male",
      "country": "Serbia"
    }, {
      "email": "jlaborda2g@weebly.com",
      "displayName": "Jens Laborda",
      "dob": "1994-06-29",
      "gender": "Male",
      "country": "Nepal"
    }, {
      "email": "aferrant2h@tumblr.com",
      "displayName": "Annemarie Ferrant",
      "dob": "1997-02-25",
      "gender": "Female",
      "country": "Canada"
    }, {
      "email": "cmacdougall2i@squarespace.com",
      "displayName": "Carlynne MacDougall",
      "dob": "1994-10-22",
      "gender": "Female",
      "country": "Poland"
    }, {
      "email": "ebatthew2j@chicagotribune.com",
      "displayName": "Eal Batthew",
      "dob": "1985-11-06",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "hkliemann2k@latimes.com",
      "displayName": "Hill Kliemann",
      "dob": "1994-05-23",
      "gender": "Male",
      "country": "Peru"
    }, {
      "email": "scrosetto2l@squarespace.com",
      "displayName": "Stace Crosetto",
      "dob": "2004-05-29",
      "gender": "Female",
      "country": "United Kingdom"
    }, {
      "email": "hryott2m@ucsd.edu",
      "displayName": "Hank Ryott",
      "dob": "2000-07-29",
      "gender": "Male",
      "country": "China"
    }, {
      "email": "twaulker2n@cisco.com",
      "displayName": "Temp Waulker",
      "dob": "1996-11-07",
      "gender": "Male",
      "country": "Indonesia"
    }, {
      "email": "tmilan2o@google.it",
      "displayName": "Tamas Milan",
      "dob": "2003-11-07",
      "gender": "Male",
      "country": "Brazil"
    }, {
      "email": "gde2p@printfriendly.com",
      "displayName": "Gabbi De Paepe",
      "dob": "1978-06-19",
      "gender": "Female",
      "country": "Greece"
    }, {
      "email": "iausiello2q@bigcartel.com",
      "displayName": "Ives Ausiello",
      "dob": "2004-12-27",
      "gender": "Male",
      "country": "Sweden"
    }, {
      "email": "ddecaze2r@apache.org",
      "displayName": "Davida Decaze",
      "dob": "1982-11-26",
      "gender": "Female",
      "country": "Thailand"
    }]
    

    items.forEach((item) => {
      item.password = "tkpm@20TN";
      item.password = bcrypt.hashSync(item.password, 8);
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Users', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE public."Users_id_seq" RESTART WITH 1;');
  }
};
