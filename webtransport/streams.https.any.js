// META: global=window,worker
// META: script=/common/get-host-info.sub.js
// META: script=resources/webtransport-test-helpers.sub.js

function webtransport_code_to_http_code(n) {
  const first = 0x52e4a40fa8db;
  return first + n + Math.floor(n / 0x1e);
}

promise_test(async t => {
  const code = webtransport_code_to_http_code(240);
  const wt = new WebTransport(
    webtransport_url(`abort-stream-from-server.py?code=${code}`));
  await wt.ready;

  const writable = await wt.createUnidirectionalStream();
  const writer = writable.getWriter();
  try {
    await writer.write(new Uint8Array([64]));
  } catch(e) {
  }
  // Sadly we cannot use promise_rejects_dom as the error constructor is
  // WebTransportError rather than DOMException. Ditto below.
  // We get a possible error, and then make sure wt.closed is rejected with it.
  const e = await writer.closed.catch(e => e);
  await promise_rejects_exactly(
      t, e, writer.closed, 'closed promise should be rejected');
  assert_true(e instanceof WebTransportError);
  assert_equals(e.source, 'stream', 'source');
  assert_equals(e.streamErrorCode, 240, 'streamErrorCode');
}, 'STOP_SENDING coming from server');

promise_test(async t => {
  const code = webtransport_code_to_http_code(127);
  const wt = new WebTransport(
    webtransport_url(`abort-stream-from-server.py?code=${code}`));
  await wt.ready;

  const bidi = await wt.createBidirectionalStream();
  const writer = bidi.writable.getWriter();
  try {
    await writer.write(new Uint8Array([64]));
  } catch(e) {
  }
  const reader = bidi.readable.getReader();
  const e = await reader.closed.catch(e => e);
  await promise_rejects_exactly(
      t, e, reader.closed, 'closed promise should be rejected');
  assert_true(e instanceof WebTransportError);
  assert_equals(e.source, 'stream', 'source');
  assert_equals(e.streamErrorCode, 127, 'streamErrorCode');
}, 'RESET_STREAM coming from server');