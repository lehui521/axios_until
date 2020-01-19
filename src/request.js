export default function request(options){
    let xhr = new XMLHttpRequest();
  
    xhr.open(options.method, options.url, true);
  
    for (let name in options.headers) {
      xhr.setRequestHeader(name, options.headers[name]);
    }
  
    xhr.send(options.data);
}