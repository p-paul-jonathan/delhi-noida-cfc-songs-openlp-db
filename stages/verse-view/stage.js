/******************************************************************************
 * OpenLP Stage View (Custom - Bible Reference Only with Hindi)
 ******************************************************************************/

// 📖 Book mapping (EN → HI)
const BOOKS = [
  { english: "Genesis", hindi: "उत्पत्ति" },
  { english: "Exodus", hindi: "निर्गमन" },
  { english: "Leviticus", hindi: "लैव्यवस्था" },
  { english: "Numbers", hindi: "गिनती" },
  { english: "Deuteronomy", hindi: "व्यवस्थाविवरण" },
  { english: "Joshua", hindi: "यहोशू" },
  { english: "Judges", hindi: "न्यायियों" },
  { english: "Ruth", hindi: "रूत" },
  { english: "1 Samuel", hindi: "1 शमूएल" },
  { english: "2 Samuel", hindi: "2 शमूएल" },
  { english: "1 Kings", hindi: "1 राजा" },
  { english: "2 Kings", hindi: "2 राजा" },
  { english: "1 Chronicles", hindi: "1 इतिहास" },
  { english: "2 Chronicles", hindi: "2 इतिहास" },
  { english: "Ezra", hindi: "एज्रा" },
  { english: "Nehemiah", hindi: "नहेमायाह" },
  { english: "Esther", hindi: "एस्तेर" },
  { english: "Job", hindi: "अय्यूब" },
  { english: "Psalms", hindi: "भजन संहिता" },
  { english: "Proverbs", hindi: "नीतिवचन" },
  { english: "Ecclesiastes", hindi: "सभोपदेशक" },
  { english: "Song of Solomon", hindi: "श्रेष्ठगीत" },
  { english: "Isaiah", hindi: "यशायाह" },
  { english: "Jeremiah", hindi: "यिर्मयाह" },
  { english: "Lamentations", hindi: "विलापगीत" },
  { english: "Ezekiel", hindi: "यहेजकेल" },
  { english: "Daniel", hindi: "दानिय्येल" },
  { english: "Hosea", hindi: "होशे" },
  { english: "Joel", hindi: "योएल" },
  { english: "Amos", hindi: "आमोस" },
  { english: "Obadiah", hindi: "ओबद्याह" },
  { english: "Jonah", hindi: "योना" },
  { english: "Micah", hindi: "मीका" },
  { english: "Nahum", hindi: "नहूम" },
  { english: "Habakkuk", hindi: "हबक्कूक" },
  { english: "Zephaniah", hindi: "सपन्याह" },
  { english: "Haggai", hindi: "हाग्गै" },
  { english: "Zechariah", hindi: "जकर्याह" },
  { english: "Malachi", hindi: "मलाकी" },
  { english: "Matthew", hindi: "मत्ती" },
  { english: "Mark", hindi: "मरकुस" },
  { english: "Luke", hindi: "लूका" },
  { english: "John", hindi: "यूहन्ना" },
  { english: "Acts", hindi: "प्रेरितों के काम" },
  { english: "Romans", hindi: "रोमियों" },
  { english: "1 Corinthians", hindi: "1 कुरिन्थियों" },
  { english: "2 Corinthians", hindi: "2 कुरिन्थियों" },
  { english: "Galatians", hindi: "गलातियों" },
  { english: "Ephesians", hindi: "इफिसियों" },
  { english: "Philippians", hindi: "फिलिप्पियों" },
  { english: "Colossians", hindi: "कुलुस्सियों" },
  { english: "1 Thessalonians", hindi: "1 थिस्सलुनीकियों" },
  { english: "2 Thessalonians", hindi: "2 थिस्सलुनीकियों" },
  { english: "1 Timothy", hindi: "1 तीमुथियुस" },
  { english: "2 Timothy", hindi: "2 तीमुथियुस" },
  { english: "Titus", hindi: "तीतुस" },
  { english: "Philemon", hindi: "फिलेमोन" },
  { english: "Hebrews", hindi: "इब्रानियों" },
  { english: "James", hindi: "याकूब" },
  { english: "1 Peter", hindi: "1 पतरस" },
  { english: "2 Peter", hindi: "2 पतरस" },
  { english: "1 John", hindi: "1 यूहन्ना" },
  { english: "2 John", hindi: "2 यूहन्ना" },
  { english: "3 John", hindi: "3 यूहन्ना" },
  { english: "Jude", hindi: "यहूदा" },
  { english: "Revelation", hindi: "प्रकाशितवाक्य" }
];

// helper
function getHindiBook(name) {
  const found = BOOKS.find(b => b.english === name);
  return found ? found.hindi : name;
}

// helper: build "John | यूहन्ना 3:16"
function buildReference(title) {
  if (!title) return "";

  // remove translation + copyright
  let clean = title.replace(/\s*\([^)]*\).*$/, "").trim();

  // extract "John" and "3:16"
  const match = clean.match(/^(.+?)\s(\d+:\d+.*)$/);
  if (!match) return "";

  const englishBook = match[1];
  const reference = match[2];
  const hindiBook = getHindiBook(englishBook);

  return `${englishBook} | ${hindiBook} ${reference}`;
}

window.OpenLP = {

  myWebSocket: function() {
    const host = window.location.hostname;
    const websocket_port = 4317;

    const ws = new WebSocket(`ws://${host}:${websocket_port}`);

    ws.onmessage = (event) => {
      const reader = new FileReader();

      reader.onload = () => {
        const data = JSON.parse(reader.result.toString()).results;

        OpenLP.myTwelve = data.twelve;

        if (OpenLP.currentItem !== data.item ||
            OpenLP.currentService !== data.service) {
          OpenLP.currentItem = data.item;
          OpenLP.currentService = data.service;
          OpenLP.loadSlides();
        } else if (OpenLP.currentSlide !== data.slide) {
          OpenLP.currentSlide = parseInt(data.slide, 10);
          OpenLP.updateSlide();
        }

        OpenLP.loadService();
      };

      reader.readAsText(event.data);
    };
  },

  loadService: function() {
    $.getJSON("/api/v2/service/items", function(data) {
      OpenLP.nextSong = "";
      $("#notes").html("");

      data.forEach(function(item, index) {
        if (item.selected) {
          $("#notes").html(item.notes);

          if (data.length > index + 1) {
            OpenLP.nextSong = data[index + 1].title;
          } else {
            OpenLP.nextSong = "End of Service";
          }
        }
      });

      OpenLP.updateSlide();
    });
  },

  loadSlides: function() {
    $.getJSON("/api/v2/controller/live-items", function(data) {

      // detect Bible
      const isBible = data.title && /\d+:\d+/.test(data.title);

      OpenLP.currentTitle = isBible ? buildReference(data.title) : "";

      OpenLP.currentSlides = data.slides;
      OpenLP.currentSlide = 0;
      OpenLP.currentTags = [];

      let div = $("#verseorder");
      div.html("");

      let tag = "";
      let tags = 0;
      let lastChange = 0;

      $.each(data.slides, function(idx, slide) {
        let prevtag = tag;
        tag = slide["tag"];

        if (tag !== prevtag) {
          lastChange = idx;
          tags++;
          div.append("&nbsp;<span>");
          $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
        } else {
          if ((slide["text"] === data.slides[lastChange]["text"]) &&
              (data.slides.length >= idx + (idx - lastChange))) {

            let match = true;
            for (let i = 0; i < idx - lastChange; i++) {
              if (data.slides[lastChange + i]["text"] !== data.slides[idx + i]["text"]) {
                match = false;
                break;
              }
            }

            if (match) {
              lastChange = idx;
              tags++;
              div.append("&nbsp;<span>");
              $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
            }
          }
        }

        OpenLP.currentTags[idx] = tags;

        if (slide["selected"]) {
          OpenLP.currentSlide = idx;
        }
      });

      OpenLP.loadService();
    });
  },

  updateSlide: function() {
    $("#verseorder span").removeClass("currenttag");
    $("#tag" + OpenLP.currentTags[OpenLP.currentSlide]).addClass("currenttag");

    let slide = OpenLP.currentSlides[OpenLP.currentSlide];

    let text = OpenLP.currentTitle || "";

    if (slide["img"]) {
      text += `<br /><img src="${slide["img"]}"><br />`;
    }

    if (slide["slide_notes"]) {
      text += `<br />${slide["footer"]}`;
    }

    text = text.replace(/\n/g, "<br />");

    $("#currentslide").html(text);
  }
};

$.ajaxSetup({ cache: false });
OpenLP.myWebSocket();
