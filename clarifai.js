function getCredentials(cb) {
  var data = {
    grant_type: 'client_credentials',
    client_id:  'IQ_98zjxbSmn0syP7fok3dma73DfI1wjZ1TYQPjc',
    client_secret: 'rNnsjLs4_2LdSKZ2fBVAVvlVyH5S4PeyHbgy2vHu'
  };

  return $.ajax({
    'url': 'https://api.clarifai.com/v1/token',
    'data': data,
    'type': 'POST'
  })
  .then(function(r) {
    localStorage.setItem('accessToken', r.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    cb();
  });
}

function postImage(imgUrl) {
  var data = {
    'url': imgUrl
  };
  var accessToken = localStorage.getItem('accessToken');

  return $.ajax({
    'url': 'https://api.clarifai.com/v1/tag',
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    },
    'data': data,
    'type': 'POST'
  }).then(function(res){
    parseResponse(res);
  });
}

function parseResponse(resp) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
  } else {
    console.log('Sorry, something is wrong.');
  }

  $('#tags').text(tags.toString().replace(/,/g, ', '));
  return tags;
}

