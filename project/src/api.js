export async function fetchToken(login, password) {
  return fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((parsedRes) => {
      if (parsedRes.error) throw Error(parsedRes.error);
      return parsedRes.payload.token;
    })
    .then((token) => {
      window.localStorage.setItem('coin-token', token);
      return token;
    });
}

export function getToken(login = null, password = null) {
  return (
    window.localStorage.getItem('coin-token') ??
    (login && password ? fetchToken(login, password) : null)
  );
}

export function getAccounts(token) {
  return fetch('http://localhost:3000/accounts', {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })
    .then((res) => res.json())
    .then((parsedRes) => parsedRes.payload);
}
