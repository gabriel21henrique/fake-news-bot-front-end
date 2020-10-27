var data = {};

$(() => {
  sendRequest();
});

async function sendRequest() {
  await setDateTime();
  await setPosition();
  await setDeviceType();
  await setNewsType();

  // const url = "http://localhost:3333/access";
  const url = "https://your-news-central-back-end.herokuapp.com/access";

  console.log(data);

  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(this.responseText);
    }
  };

  var access = JSON.stringify({
    "dateTime": data.dateTime,
    "deviceType": data.deviceType,
    "newsType": data.newsType,
    "location": {
      "latitude": data.latitude,
      "longitude": data.longitude,
      "state": data.state
    }
  });

  xhr.send(access);
}

async function setDateTime() {
  let options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  currentDateTime = new Intl.DateTimeFormat([], options)
    .format(new Date());

  data.dateTime = currentDateTime;
}

async function setPosition() {
  if (!(window.navigator.geolocation)) {
    return false;
  }
  window.navigator.geolocation.getCurrentPosition(setLocation, console.log);
}

function setLocation(position) {
  const { latitude, longitude } = position.coords;
  data.latitude = latitude;
  data.longitude = longitude;
  const key = '2ecd535e1bd44d10bbbbbbca22af4728';
  $.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${key}`)
    .then(response => data.location.state = response.results[0].components.state);
};

async function setDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    data.deviceType = "Tablet";
  }
  if (
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    data.deviceType = "Mobile";
  }
  data.deviceType = "Desktop";
};

async function setNewsType() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const newsType = urlParams.get('newsType');
  data.newsType = newsType;
}
