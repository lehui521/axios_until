import Axios from "./axios"

let axios = Axios.create()

Axios('/data/1.text', {
    baseUrl: 'http://www.baidu.com/',
    headers: {
        a: 12,
    },
});
