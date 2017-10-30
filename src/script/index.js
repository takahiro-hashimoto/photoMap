$(function(){
  // var 500pxKey = G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ;
  // var 500pxSecret = J4Utz9M7H78xJD6Lx2D9MjcppKFqR3AR1gqN1h7z;

  //HTML要素の登録
  const renderArea = document.getElementById('js-renderArea');
  const keyword = document.getElementById('js-keyword');
  const submit = document.getElementById('js-submit');
  const photoData = [];
  let currentScroll;
  let gmarkers = [];
  let i = 0;

  $('#js-submit').on('click', function(){
    searchPhoto();
  })

  $('#js-getPhoto').on('click', function(){
    addPhoto();
  });

  //リクエストURIの生成
  const server = 'https://api.500px.com/v1/photos/search';
  const apiKey = '?consumer_key=G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ';
  const imageSize = '&image_size=21'
  let searchURI = server + apiKey + imageSize + '&term=';
  let requestURI;
  let getPage;
  let query;

  //検索開始（検索ボタンクリック後）
  function searchPhoto(){
    getPage = 1;
    photoData.length = 0;
    keyword.textContent = '';
    renderArea.textContent = '';
    query = encodeURIComponent(keyword.value.trim());
    requestURI = searchURI + query + '&page=' + getPage;
    $.ajax({
       type: 'GET',
       dataType: 'json',
       url: requestURI,
       success: function(data){
         render(data);
         initialize(data);
         showAddBtn();
         photoData.push(data.photos);
         getPage++;
       },
       error: function(xhr, textStatus, errorThrown){
       }
     });
  }

  //続きの画像を取得
  function addPhoto(){
    requestURI = searchURI + query + '&page=' + getPage;
    $.ajax({
       type: 'GET',
       dataType: 'json',
       url: requestURI,
       success: function(data){
         render(data);
         initialize(data);
         photoData.push(data.photos);
         console.log(photoData);
         getPage++;
       },
       error: function(xhr, textStatus, errorThrown){
       }
     });
  }

  function render(data) {
    for (var i = 0, count = data.photos.length; i < count; i++) {
        var url = data.photos[i].image_url;
        var template = $(`<li><a href="javascript:map_click(${[i]})"><img data-num="${[i]}" class="photo" src="${url}" ></a></li>`);
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
    let img = photoData[0].photos[i].image_url;
    let name = photoData[0].photos[i].name;
    let description = photoData[0].photos[i].description;
    let camera = photoData[0].photos[i].camera;
    let location = photoData[0].photos[i].location;
    let iso = photoData[0].photos[i].iso;
    let shutter_speed = photoData[0].photos[i].shutter_speed;
    const template = $(`<div class='l-bottom-midium'><img class='modal-photo' src="${img}"></div>
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

  function initialize(data) {
    var myOptions = {
      zoom: 5,
      center: new google.maps.LatLng(38.2586, 137.6850),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // disableDefaultUI: true
    };
    var map = new google.maps.Map(document.getElementById("js-map") ,myOptions);
    for (var i = 0; i < data.photos.length; i++) {
      var img = data.photos[i].image_url;
      var latlng = new google.maps.LatLng(data.photos[i].latitude, data.photos[i].longitude);
      var description = data.photos[i].name;
      createMarker(img, latlng, map, description);
    }
  }

  function createMarker(img, latlng, map, description){
    var infoWindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({position: latlng,map: map});
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(`<p><img class="map-image" src="${img}"/></p>`);
      infoWindow.open(map, marker);
      map.setZoom(12);
    });
    gmarkers[i] = marker;
    i ++;
  }

  function map_click(i) {
    google.maps.event.trigger(gmarkers[i], 'click');
    showModal();
  }

  $(document).on('click', '.photo', function(){
    var i = parseInt($(this).data('num'), 10);
    renderModal(i);
  });

  $('#js-overlay').on('click', function(){
    hideModal();
  });

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
});
