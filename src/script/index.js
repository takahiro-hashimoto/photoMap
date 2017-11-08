$(function(){
  // var 500pxKey = G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ;
  // var 500pxSecret = J4Utz9M7H78xJD6Lx2D9MjcppKFqR3AR1gqN1h7z;

  //HTML要素の登録
  const renderArea = document.getElementById('js-renderArea');
  const keyword = document.getElementById('js-keyword');
  const submit = document.getElementById('js-submit');
  let photoData = [];
  let currentScroll;
  let gmarkers = [];
  let i = 0;

  //500pxのリクエストURI生成
  const server500px = 'https://api.500px.com/v1/photos/search';
  const apiKey500px = '?consumer_key=G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ';
  const imageSize500px = '&image_size=21';
  let searchURI500px = server500px + apiKey500px + imageSize500px + '&term=';
  let requestURI500px;

  //flickrのリクエストURI生成
  const serverFlickr = "https://api.flickr.com/services/rest";
  const method ="?method=flickr.photos.search";
  const apiKeyFlickr = "&api_key=62d22d8ceb53ada13cbfe83f6f64cfeb&format=json&has_geo=0";
  let searchURIFlickr = serverFlickr + method + apiKeyFlickr + "&text=";
  let requestURIFlickr;

  let getPage;
  let query;
  let hoge;

  //検索開始（検索ボタンクリック後）
  function search500px(){
    requestURI500px = searchURI500px + query + '&page=' + getPage;
    $.ajax({
       type: 'GET',
       dataType: 'json',
       url: requestURI500px,
       success: function(data){
         data.photos.forEach((item) => {
           if(!item.latitude == ''){
             photoData.push(item);
           }
         });
         initialize();
         render();
         showAddBtn();
         getPage ++;
       },
       error: function(xhr, textStatus, errorThrown){
         return;
       }
     });
  }

  function searchFlickr(){
    requestURIFlickr = searchURIFlickr + query + '&page=' + getPage;
    $.ajax({
       type: 'GET',
       dataType: "jsonp",
       jsonpCallback: "jsonFlickrApi",
       url: requestURIFlickr,
       success: function(data){
       console.log(requestURIFlickr);
       console.log(data);
        //  data.photos.forEach((item) => {
        //    if(!item.latitude == ''){
        //      photoData.push(item);
        //    }
        //  });
        //  initialize();
        //  render();
        //  showAddBtn();
        //  getPage ++;
       },
       error: function(xhr, textStatus, errorThrown){
         return;
       }
     });
  }

  function render(){
    renderArea.textContent = '';
    for (let i = 0, count = photoData.length; i < count; i ++) {
        let url = photoData[i].image_url;
        let template = $(`<li><img data-num="${[i]}" class="js-photo photo" src="${url}" ></li>`);
        $('#js-renderArea').append(template);
    }
    // if(photos.length == 0){
    //   photoArea.textContent = notFoundMessage;
    // }
  }

  function showAddBtn(){
    $('#js-getPhoto').removeClass('is-hide');
  }

  function renderModal(i){
    let img = photoData[i].image_url;
    let name = photoData[i].name;
    let description = photoData[i].description;
    let camera = photoData[i].camera;
    let location = photoData[i].location;
    let iso = photoData[i].iso;
    let shutter_speed = photoData[i].shutter_speed;
    const template = $(`
    <div class='l-bottom-midium'><img class='modal-photo' src="${img}"></div>
    <table class='l-modal-table modal-table'>
    <tr><th>tite</th><td>${name}</td></tr>
    <tr><th>description</th><td>${description}</td></tr>
    <tr><th>camera</th><td>${camera}</td></tr>
    <tr><th>location</th><td${location}></td></tr>
    <tr><th>IOS</th><td>${iso}</td></tr>
    <tr><th>shutterSpeed</th><td>${shutter_speed}</td></tr>
    </table>`);
      $('#js-info').html('');
      $('#js-info').append(template);
    }

  function initialize(){
    gmarkers.length = 0;
    hoge = 0;
    let myOptions = {
      zoom: 5,
      center: new google.maps.LatLng(38.2586, 137.6850),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // disableDefaultUI: true
    };
    const map = new google.maps.Map(document.getElementById("js-map") ,myOptions);
    for (let i = 0; i < photoData.length; i++) {
      let img = photoData[i].image_url;
      let latlng = new google.maps.LatLng(photoData[i].latitude, photoData[i].longitude);
      let name = photoData[i].name;
      createMarker(img, latlng, map, name);
    }
  }

  function createMarker(img, latlng, map, name){
    const infoWindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({position: latlng, map: map});
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(`<div><p class="map-title l-bottom-small">${name}</p><img class="map-image" src="${img}"/></div>`);
      infoWindow.open(map, marker);
      map.setZoom(12);
    });
    gmarkers[hoge] = marker;
    hoge ++;
  }

  function showModal(){
    currentScroll = $(window).scrollTop();
    $('body').addClass('is-fixed').css({'top': -currentScroll});
    $('#js-overlay').removeClass('is-hide');
    $('#js-modal').removeClass('is-hide');
  }

  function hideModal(){
    $('body').removeClass('is-fixed').css({'top': 0});
    window.scrollTo(0 , currentScroll);
    $('#js-overlay').addClass('is-hide');
    $('#js-modal').addClass('is-hide');
  }

  $(window).on('load', function(){
    search500px();
  })

  $('#js-submit').on('click', function(){
    getPage = 1;
    if(getPage == 1){
      photoData.length = 0;
      keyword.textContent = '';
      query = encodeURIComponent(keyword.value.trim());
    }
    searchFlickr();
    search500px();
  })

  $('#js-infinite-scroll').on('scroll', function (e) {
    var target = $(e.target);
    if ((target.scrollTop() + target.outerHeight()) >= e.target.scrollHeight) {
      $('#js-infinite-scroll-bar').removeClass('is-hide');
      search500px();
    }
  });

  $(document).on('click', '.js-photo', function(){
    var i = parseInt($(this).data('num'), 10);
    renderModal(i);
    mapClick(i);
    showModal();
  });

  $('#js-overlay').on('click', function(){
    hideModal();
  });

  function mapClick(i){
    google.maps.event.trigger(gmarkers[i], 'click');
  }
});
