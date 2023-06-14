const getBaseURLFromPrefixAndName = (defaultBaseURL, pathPrefix, urlName) => {
  let baseURL = defaultBaseURL;
  if (pathPrefix || urlName) {
    let urlNames = [];
    if (pathPrefix) {
      urlNames.push(pathPrefix);
    }
    if (urlName) {
      urlNames.push(urlName);
    }
    baseURL = urlNames.join('/');
  }
  return baseURL;
};

const restorePrefixURL = (url, pathPrefix) => {
  const separator = '/';
  if (!pathPrefix || url.startsWith(pathPrefix)) {
    return url;
  }
  if (pathPrefix.endsWith(separator) || url.startsWith(separator)) {
    return [pathPrefix, url].join('');
  }
  return [pathPrefix, url].join(separator);
};

export { getBaseURLFromPrefixAndName, restorePrefixURL };
