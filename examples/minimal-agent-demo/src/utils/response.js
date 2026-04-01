export function ok(data, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify({
      data,
      error: null
    })
  };
}

export function fail(error, statusCode = 500) {
  return {
    statusCode,
    body: JSON.stringify({
      data: null,
      error
    })
  };
}
