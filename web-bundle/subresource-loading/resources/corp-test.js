
promise_test(async () => {
  const prefix = 'https://www1.web-platform.test:8444/web-bundle/resources/wbn/cors/';
  await addScriptAndWaitForExecution(prefix + 'no-corp.js');
  await addScriptAndWaitForError(prefix + 'corp-same-origin.js');
  await addScriptAndWaitForExecution(prefix + 'corp-cross-origin.js');
}, "Subresource loading from WebBundles should respect Cross-Origin-Resource-Policy header.");

promise_test(async () => {
  const no_corp_url = 'urn:uuid:5eafff38-e0a0-4661-bde0-434255aa9d93';
  const iframe = document.createElement('iframe');
  iframe.src = no_corp_url;
  await addElementAndWaitForLoad(iframe);
  assert_equals(
    await evalInIframe(iframe, 'location.href'),
    no_corp_url);
}, "Urn:uuid iframe without Cross-Origin-Resource-Policy: header should not be blocked.");

promise_test(async () => {
  const corp_cross_origin_url = 'urn:uuid:86d5b696-8867-4454-8b07-51239a0817f7';
  const iframe = document.createElement('iframe');
  iframe.src = corp_cross_origin_url;
  await addElementAndWaitForLoad(iframe);
  assert_equals(
    await evalInIframe(iframe, 'location.href'),
    corp_cross_origin_url);
}, "Urn:uuid iframe with Cross-Origin-Resource-Policy: cross-origin should not be blocked.");
