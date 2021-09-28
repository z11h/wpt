function delayByFrames(f, num_frames) {
  function recurse(depth) {
    if (depth == 0)
      f();
    else
      requestAnimationFrame(() => recurse(depth-1));
  }
  recurse(num_frames);
}

// Returns a Promise which is resolved with the event object when the event is
// fired.
function waitForEvent(eventType) {
  return new Promise(resolve => {
    document.body.addEventListener(eventType, e => resolve(e), {once: true});
  });
}


// Returns a Promise which is resolved with a "true" iff transient activation
// was available and successfully consumed.
//
// This function relies on Fullscreen API to check/consume user activation
// state.
async function consumeTransientActivation() {
  return new Promise(resolve => {
    document.body.requestFullscreen()
        .then(document.exitFullscreen())
        .then(() => resolve(true))
        .catch(() => resolve(false));
  });
}
