(function(name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition()
  } else if (typeof define === 'function' && define.amd) {
    define(definition)
  } else {
    context[name] = definition()
  }
}('promise-jsonp', window, function() {

  var JSONP = {
    extendConfig: function(config) {
      config = config || {}
      config.url = config.url || '/'
      config.data = config.data || {}
      config.callback = config.callback || 'jsoncallback'
      return config
    },
    obj2arr: function(data) {
      var query = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key]
          if (typeof val !== 'string') {
            val = JSON.stringify(val)
          }
          query.push(key + '=' + data[key])
        }
      }
      return query
    },
    run: function(url, generatedFunction, resolve, reject) {
      window[generatedFunction] = function(ret) {
        try {
          delete window[generatedFunction]
        } catch ( e ) {
          window[generatedFunction] = undefined
        }
        resolve(ret)
      }
      var jsonpScript = document.createElement('script')
      jsonpScript.onerror = function() {
      	console.error(url + ' can not successfully load')
        reject()
      }
      jsonpScript.setAttribute('src', url)
      document.getElementsByTagName('head')[0].appendChild(jsonpScript)
    }
  }

  return function(config) {
    var data, query, src, generatedFunction, timestamp

    config = JSONP.extendConfig(config)
    data = JSONP.obj2arr(config.data)
    timestamp = new Date().getTime()
    generatedFunction = 'jsonp' + Math.round(timestamp + Math.random() * 1000001)

    query = [
      '_=' + timestamp,
      config.callback + '=' + generatedFunction
    ].concat(data)
    query = query.join('&')

    src = config.url + (config.url.indexOf('?') > -1 ? '&' : '?') + query

    return new Promise(function(resolve, reject) {
      JSONP.run(src, generatedFunction, resolve, reject)
    })
  }

}))
