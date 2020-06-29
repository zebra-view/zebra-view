export default function request(opts) {
  const params = {
    baseURL: 'http://localhost:8000',
    method: 'GET',
    header: {},
    data: {},
  };
  const options = { ...params, ...opts, headers: { ...params.headers, ...(opts.headers || {}) } };
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url, true);
    Object.entries(options.headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    xhr.responseType = 'json';
    xhr.upload.onprogress = options.onProgress;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (/(2|3)\d{2}/.test(`${xhr.status}`)) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    };
    options.setXHR && options.setXHR(xhr);
    xhr.send(options.data);
  });
}
