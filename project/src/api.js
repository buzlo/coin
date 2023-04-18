export async function fetchToken(login, password) {
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const parsedRes = await res.json();
  if (parsedRes.error) throw Error(parsedRes.error);

  const token = parsedRes.payload.token;

  window.localStorage.setItem('coin-token', token);

  return token;
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

export async function createAccount(token) {
  const res = await fetch('http://localhost:3000/create-account', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  const parsedRes = await res.json();
  return parsedRes.payload;
}
