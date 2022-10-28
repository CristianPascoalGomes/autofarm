url = "192.168.0.15:80"

async function led1(e) {
  data = {
    "value": 69,
    "text": "lewd"
  }

  msg = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  document.getElementById("monitor").innerHTML = msg;
}

