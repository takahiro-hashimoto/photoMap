$(function(){

  $(window).on('load', function(){
    searchPhoto();
  })

  $('#js-submit').on('click', function(){
    getPage = 1;
    if(getPage == 1){
      photoData.length = 0;
      keyword.textContent = '';
      query = encodeURIComponent(keyword.value.trim());
    }
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
    mapClick(i);
    showModal();
  });

  $('#js-overlay').on('click', function(){
    hideModal();
  });

  $('#js-layoutIcon li').on('click', function(){

    $('#js-layoutIcon li').removeClass('is-active');
    $(this).addClass('is-active');

    let index = $('#js-layoutIcon li').index(this);
    if(index === 1){
      $('#js-renderArea').addClass('l-full').removeClass('l-trisect');
    } else {
      $('#js-renderArea').removeClass('l-full').addClass('l-trisect');
    }
  });

  //HTML要素の登録
  const renderArea = document.getElementById('js-renderArea');
  const keyword = document.getElementById('js-keyword');
  const submit = document.getElementById('js-submit');
  let photoData = [];
  let currentScroll;
  let gmarkers = [];
  let i = 0;

  //500pxのリクエストURI生成
  const server = 'https://api.500px.com/v1/photos/search';
  const apiKey = '?consumer_key=G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ';
  const imageSize = '&image_size=21';
  let searchURI = server + apiKey + imageSize + '&term=';
  let requestURI;
  let getPage;
  let query;
  let hoge;

  function searchPhoto(){
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
  }

  function showAddBtn(){
    $('#js-getPhoto').removeClass('is-hide');
  }

  function initialize(){
    gmarkers.length = 0;
    hoge = 0;
    let myOptions = {
      zoom: 5,
      center: new google.maps.LatLng(38.2586, 137.6850),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
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

  function mapClick(i){
    google.maps.event.trigger(gmarkers[i], 'click');
  }

});
