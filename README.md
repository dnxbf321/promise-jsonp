# jd-promise-jsonp

将 jsonp 请求 promise 化

## 用法

```js
var jsonp = require('jd-promise-jsonp') // window['promise-jsonp']

jsonp({
	url: '/jsonp',  // 接口地址
	callback: 'jsoncallback',  // 服务端接收的 jsonp callback 参数名，默认是 jsoncallback
	data: {
		v: 1,
		obj: {
			key1: '1',
			key2: '2'
		} // 将调用 JSON.stringify 将 object 类型转换成 string
	}
}).then(function(ret) {
	console.log(ret)
}).catch(function(err) {
	console.error(err)
})
```
