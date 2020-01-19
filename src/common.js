export function assert(exp, msg = 'assert,faild') {
    if (!exp) {
        throw new Error(msg);
    }
}
//递归 合并赋值
export function merge(dest, src) {
    for (let name in src) {
        if (typeof src[name] == 'object') {
            if (!dest[name]) {
                dest[name] = {}
            }
            merge(dest[name], src[name])
        } else {
            if (dest[name] === undefined) {
                dest[name] = src[name];
            }
        }
    }
}
