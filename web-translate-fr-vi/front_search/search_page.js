"use strict"

const api_fr_en_url = "http://localhost:3000/translate?";
const api_en_vi_url = "http://localhost:3001/translate?";


function changeDropdownMenuText(htmlText) {
  $("#dropdownMenuButton").text(htmlText);
}


function create_ajax_req(url) {
  return $.ajax({
    type: "GET",
    crossDomain: true,
    url: url,
  });
}

function get_ajax_req(mode, word) {
  let url;

  switch (mode) {
    case "en-vi":
      url = api_en_vi_url;
      break;
    case "fr-en":
      url = api_fr_en_url;
      break;
  }

  const fullurl = url + "word=" + word;
  return create_ajax_req(fullurl);
};

function searchWord() {
  let result;
  const word = $("#searchBar").val();
  if (!word)  // empty
    return;

  const mode = $("#dropdownMenuButton").text();

  if (mode !== "fr-vi") {  // en-vi or fr-en
    const ajaxReq = get_ajax_req(mode, word);

    ajaxReq.done(function (data) {
      if (data) {
        const lang = mode.split('-');
        result = data[lang[1]]; // get value of second lang from json
        $("#resultBar").val(result);
      }
      else
        failSearch(word);
    })
  }
  else { // fr-vi
    const ajaxReq_fr_en = get_ajax_req("fr-en", word);

    ajaxReq_fr_en.done(function (data1) {
      if (data1) {
        const ajaxReq_en_vi = get_ajax_req("en-vi", data1["en"]);
        ajaxReq_en_vi.done(function (data2) {
          if (data2) {
            result = data2["vi"]
            $("#resultBar").val(result);
          }
          else
            failSearch(word);
        })
      }
      else
        failSearch(word);
    });
  }
}

function failSearch(word) {
  toastr.error('no result for word "' + word + '"');
  $('#searchBar').val("");
  $('#resultBar').val("");
}