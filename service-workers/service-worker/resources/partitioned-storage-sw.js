var promise = new Promise(function(resolve) {
  self.addEventListener('fetch', function(event) {
    fetchEventHandler(event, resolve);
  })
});

function fetchEventHandler(event, resolve){
  var request_url = new URL(event.request.url);
  var url_search = request_url.search;
  request_url.search = "";
  if ( request_url.href.endsWith('waitUntilResolved.fakehtml') ) {

      event.waitUntil(promise);

      event.respondWith(promise.then(function(){
      return new Response("Resolved for " + url_search);
    }));


  }
  else if ( request_url.href.endsWith('resolve.fakehtml') ) {
    event.respondWith(new Response("Promise settled for " + url_search));
    resolve();
  }
}