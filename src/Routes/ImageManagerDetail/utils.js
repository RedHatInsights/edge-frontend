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
  if (!pathPrefix || url.startsWith(pathPrefix)) {
    return url;
  }
  return [pathPrefix, url].join('/');
};

export { getBaseURLFromPrefixAndName, restorePrefixURL };
