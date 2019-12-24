    //path
    export function isExternal(path) {
        return /^(https?:|mailto:|tel:)/.test(path)
    }
  
    //url
    export function validURL(url) {
        const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return reg.test(url)
    }
    
    //email
    export function validEmail(email) {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return reg.test(email)
    }
    
    //str
    export function isString(str) {
        if (typeof str === 'string' || str instanceof String) {
        return true
        }
        return false
    }
    
    //arg
    export function isArray(arg) {
        if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
        }
        return Array.isArray(arg)
    }
    //特殊字符
    export function isSpecialSymbol(symbol) {
        const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
        return reg.test(symbol)
    }
    //ip地址
    export function isIp(symbol) {
        const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
        return reg.test(symbol)
    }