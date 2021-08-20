importScripts('/resources/testharness.js');

'use strict';

promise_test(async t => {
  const dir = await navigator.storage.getDirectory();
  const fileHandle = await dir.getFileHandle('OPFS.test', {create: true});

  const syncHandle1 = await fileHandle
                        .createSyncAccessHandle({mode: "in-place"});
  await promise_rejects_dom(
      t, 'InvalidStateError',
      fileHandle.createSyncAccessHandle({mode: "in-place"}));

  await syncHandle1.close();
  const syncHandle2 = await fileHandle
                        .createSyncAccessHandle({mode: "in-place"});
  await syncHandle2.close();
}, 'There can only be one open access handle at any given time');

promise_test(async t => {
  const dir = await navigator.storage.getDirectory();
  const fooFileHandle = await dir.getFileHandle('foo.test', {create: true});
  const barFileHandle = await dir.getFileHandle('bar.test', {create: true});

  const fooSyncHandle = await fooFileHandle
                          .createSyncAccessHandle({mode: "in-place"});
  t.add_cleanup(() => fooSyncHandle.close());

  const barSyncHandle1 = await barFileHandle
                           .createSyncAccessHandle({mode: "in-place"});
  await promise_rejects_dom(
      t, 'InvalidStateError',
      barFileHandle.createSyncAccessHandle({mode: "in-place"}));

  await barSyncHandle1.close();
  const barSyncHandle2 = await barFileHandle
                           .createSyncAccessHandle({mode: "in-place"});
  await barSyncHandle2.close();
}, 'An access handle from one file does not interfere with the creation of an' +
     ' access handle on another file');

done();
