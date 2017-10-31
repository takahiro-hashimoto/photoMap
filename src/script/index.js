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

  //リクエストURIの生成
  const server = 'https://api.500px.com/v1/photos/search';
  const apiKey = '?consumer_key=G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ';
  const imageSize = '&image_size=21'
  let searchURI = server + apiKey + imageSize + '&term=';
  let requestURI;
  let getPage;
  let query;
  let hoge;

  //検索開始（検索ボタンクリック後）
  function searchPhoto(){
    if(getPage == 1){
      photoData.length = 0;
      keyword.textContent = '';
      query = encodeURIComponent(keyword.value.trim());
    }
    requestURI = searchURI + query + '&page=' + getPage;
    $.ajax({
       type: 'GET',
       dataType: 'json',
       url: requestURI,
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
      let description = photoData[i].name;
      createMarker(img, latlng, map, description);
    }
  }

  function createMarker(img, latlng, map, description){
    const infoWindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({position: latlng, map: map});
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(`<p><img class="map-image" src="${img}"/></p>`);
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

  $('#js-submit').on('click', function(){
    getPage = 1;
    searchPhoto();
  })

  $('#js-infinite-scroll').on('scroll', function (e) {
    var target = $(e.target);
    if ((target.scrollTop() + target.outerHeight()) >= e.target.scrollHeight) {
      $('#js-infinite-scroll-bar').removeClass('is-hide');
      searchPhoto();
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
