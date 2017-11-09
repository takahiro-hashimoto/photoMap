$(function(){

  $(window).on('load', function(){
    searchPhoto();
  })

  $('#js-submit').on('click', function(){
    //取得するページをデフォルト値にリセット
    getPage = 1;
    //画像データ配列をリセット
    photoData.length = 0;
    query = encodeURIComponent(keyword.val().trim());
    keyword.val('');
    searchPhoto();
    $('#js-infinite-scroll').scrollTop(0);
  })

  $('#js-infinite-scroll').on('scroll', function (e) {
    var target = $(e.target);
    if ((target.scrollTop() + target.outerHeight()) >= e.target.scrollHeight) {
      $('#js-infinite-scroll-bar').removeClass('is-hide');
      searchPhoto();
    }
  });

  $(document).on('click', '.js-photo', function(){
    var num = parseInt($(this).data('num'), 10);
    mapClick(num);
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
      renderArea.addClass('l-full').removeClass('l-trisect');
    } else {
      renderArea.removeClass('l-full').addClass('l-trisect');
    }
  });

  const renderArea = $('#js-renderArea');
  const keyword = $('#js-keyword');
  const submit = $('#js-submit');
  let photoData = [];
  let currentScroll;
  let gmarkers = [];
  let getPage;
  let query;
  let makerLength;

  const server = 'https://api.500px.com/v1/photos/search';
  const apiKey = '?consumer_key=G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ';
  const imageSize = '&image_size=21';
  let searchURI = server + apiKey + imageSize + '&term=';
  let requestURI;

  const searchPhoto = () =>{
    requestURI = searchURI + query + '&page=' + getPage;
    $.ajax({
       type: 'GET',
       dataType: 'json',
       url: requestURI,
       success: function(data){
         console.log(data);
         //緯度経度の値が入った出たdataのみをphotoDataに格納
         data.photos.forEach((item) => {
           if(!item.latitude == ''){
             photoData.push(item);
           }
         });
         initialize();
         render();
         showAddBtn();
         //次に取得するページを更新
         getPage ++;
       },
       error: function(xhr, textStatus, errorThrown){
         return;
       }
     });
  }

  const render = () =>{
    renderArea.empty();
    for (let i = 0, count = photoData.length; i < count; i ++) {
        let url = photoData[i].image_url;
        let template = $(`<li data-num="${[i]}" class="js-photo photo">
                            <img src="${url}" >
                          </li>`);
        renderArea.append(template);
    }
  }

  const showAddBtn = () =>{
    $('#js-getPhoto').removeClass('is-hide');
  }

  const initialize = () =>{
    // gmarkersの配列に入ったデータをリセット
    gmarkers.length = 0;

    makerLength = 0;
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

  const createMarker = (img, latlng, map, name) =>{
    const infoWindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({position: latlng, map: map});
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(`<div class='map'><p class="map-title l-bottom-small">${name}</p>
                               <img class="map-image" src="${img}"/>
                             </div>`);
      infoWindow.open(map, marker);
      map.setZoom(12);
    });
    gmarkers[makerLength] = marker;
    makerLength ++;
  }

  const showModal = () =>{
    currentScroll = $(window).scrollTop();
    $('body').addClass('is-fixed').css({'top': -currentScroll});
    $('#js-overlay').removeClass('is-hide');
    $('#js-modal').removeClass('is-hide');
  }

  const hideModal = () =>{
    $('body').removeClass('is-fixed').css({'top': 0});
    window.scrollTo(0 , currentScroll);
    $('#js-overlay').addClass('is-hide');
    $('#js-modal').addClass('is-hide');
  }

  const mapClick = (num) =>{
    google.maps.event.trigger(gmarkers[num], 'click');
  }

});
