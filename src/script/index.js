var date = new Date();
var element = document.getElementById('time');
const hoge = 2222 ;
function getTime(date){
    return datMinutes(date) + ':' + date.getSeconds(date);
}

element.innerHTML = getTime(date);
console.log(getTime(date));
