const msgpack = require('msgpack5');

const m = msgpack();

m.register(0x00, Date, (d) => {
    const buf = Buffer.alloc(8);
    buf.writeDoubleBE(+d, 0);
    return buf;
}, (data) => {
    return new Date(data.readDoubleBE(0))
});


const o = 120391241233;
const tab = [];
for (let i = 0; i < 100; i++) {
    tab.push(o);
}


console.log(m.encode(tab).length);
console.log(JSON.stringify(tab).length);