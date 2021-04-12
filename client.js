async function joinRoom() {
  //var username = document.getElementById('usernameInput').value();
  /*
  fetch('/hello')
    .then(function (response) {
      document.body.innerHTML = response.text();
    })
  */

  /*
  var response = await fetch('/hello.html');
  var newbody = await response.text();
  document.body.innerHTML = newbody;
  */
  
  var response = await fetch('/sketch.js');
  var blob = await response.blob();
  document.getElementById('sketch').src = URL.createObjectURL(blob);

  document.body.innerHTML = '<script src="/sketch.js"></script>';
  
}

/*
function loadRoom() {
  fetch('https://example.org')
    .then(response=>{
      document.body.innerHTML = response.body
    })
}
*/