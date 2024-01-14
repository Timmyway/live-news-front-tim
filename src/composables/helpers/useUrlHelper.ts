export function useUrlHelper() {
  /* Note: In dev stage, I use a Nodejs backend to generate the avatars url.
    1. You may have to change the api url inside application store.
    2. Your post author's avatar should use absolute url, else you have to
    remove the call of prefixUrl helper.
  */
  const prefixUrl = (url: string, prefix: string): string => {
    // We will append the prefix if it's not an absolute url
    const hasProtocol = /^(http|https):\/\//.test(url);

    if (!hasProtocol) {
      return `${prefix}${url}`;
    }

    // If the URL already has a protocol, return it as is
    return url;
  };

  return { prefixUrl };
}
