'use strict';

$(function () {

  $(window).on('load', function () {
    searchPhoto();
  });

  $('#js-submit').on('click', function () {
    //取得するページをデフォルト値にリセット
    getPage = 1;
    //画像データ配列をリセット
    photoData.length = 0;
    query = encodeURIComponent(keyword.val().trim());
    keyword.val('');
    searchPhoto();
    $('#js-infinite-scroll').scrollTop(0);
  });

  $('#js-infinite-scroll').on('scroll', function (e) {
    var target = $(e.target);
    if (target.scrollTop() + target.outerHeight() >= e.target.scrollHeight) {
      $('#js-infinite-scroll-bar').removeClass('is-hide');
      searchPhoto();
    }
  });

  $(document).on('click', '.js-photo', function () {
    var num = parseInt($(this).data('num'), 10);
    mapClick(num);
    showModal();
  });

  $('#js-overlay').on('click', function () {
    hideModal();
  });

  $('#js-layoutIcon li').on('click', function () {

    $('#js-layoutIcon li').removeClass('is-active');
    $(this).addClass('is-active');

    var index = $('#js-layoutIcon li').index(this);
    if (index === 1) {
      renderArea.addClass('l-full').removeClass('l-trisect');
    } else {
      renderArea.removeClass('l-full').addClass('l-trisect');
    }
  });

  var renderArea = $('#js-renderArea');
  var keyword = $('#js-keyword');
  var submit = $('#js-submit');
  var photoData = [];
  var currentScroll = void 0;
  var gmarkers = [];
  var getPage = 1;
  var query = '';
  var makerLength = [];

  var server = 'https://api.500px.com/v1/photos/search';
  var apiKey = '?consumer_key=G6kID8IZ5fg58bOL32mvffjAFT3gk9TBY13e8OjQ';
  var imageSize = '&image_size=21';
  var searchURI = server + apiKey + imageSize + '&term=';
  var requestURI = void 0;

  var searchPhoto = function searchPhoto() {
    requestURI = searchURI + query + '&page=' + getPage;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: requestURI,
      success: function success(data) {
        console.log(data);
        //緯度経度の値が入った出たdataのみをphotoDataに格納
        data.photos.forEach(function (item) {
          if (!item.latitude == '') {
            photoData.push(item);
          }
        });
        initialize();
        render();
        showAddBtn();
        //次に取得するページを更新
        getPage++;
      },
      error: function error(xhr, textStatus, errorThrown) {
        return;
      }
    });
  };

  var render = function render() {
    renderArea.empty();
    for (var i = 0, count = photoData.length; i < count; i++) {
      var url = photoData[i].image_url;
      var template = $('<li data-num="' + [i] + '" class="js-photo photo">\n                            <img src="' + url + '" >\n                          </li>');
      renderArea.append(template);
    }
  };

  var showAddBtn = function showAddBtn() {
    $('#js-getPhoto').removeClass('is-hide');
  };

  var initialize = function initialize() {
    // gmarkersの配列に入ったデータをリセット
    gmarkers.length = 0;

    makerLength = 0;
    var myOptions = {
      zoom: 5,
      center: new google.maps.LatLng(38.2586, 137.6850),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("js-map"), myOptions);
    for (var i = 0; i < photoData.length; i++) {
      var img = photoData[i].image_url;
      var latlng = new google.maps.LatLng(photoData[i].latitude, photoData[i].longitude);
      var name = photoData[i].name;
      createMarker(img, latlng, map, name);
    }
  };

  var createMarker = function createMarker(img, latlng, map, name) {
    var infoWindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({ position: latlng, map: map });
    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent('<div class=\'map\'><p class="map-title l-bottom-small">' + name + '</p>\n                               <img class="map-image" src="' + img + '"/>\n                             </div>');
      infoWindow.open(map, marker);
      map.setZoom(12);
    });
    gmarkers[makerLength] = marker;
    makerLength++;
  };

  var showModal = function showModal() {
    currentScroll = $(window).scrollTop();
    $('body').addClass('is-fixed').css({ 'top': -currentScroll });
    $('#js-overlay').removeClass('is-hide');
    $('#js-modal').removeClass('is-hide');
  };

  var hideModal = function hideModal() {
    $('body').removeClass('is-fixed').css({ 'top': 0 });
    window.scrollTo(0, currentScroll);
    $('#js-overlay').addClass('is-hide');
    $('#js-modal').addClass('is-hide');
  };

  var mapClick = function mapClick(num) {
    google.maps.event.trigger(gmarkers[num], 'click');
  };
});