const msgpack = require('msgpack5');


class ExampleClass {

}

const object = new ExampleClass();
object.prop = 'tesadgfasd';
object.date = new Date();

Object.freeze(object);
Object.freeze(object.date);

const m = msgpack();

m.register(0x00, ExampleClass, (o) => {
    return m.encode(Object.assign({}, o));
}, (o) => {
    const data = m.decode(o);
    return Object.assign(new ExampleClass(), data);
});

m.register(0x01, Date, (o) => {
    return Buffer.from(o.toISOString(), 'utf8');
}, (d) => {
    return new Date(d.toString('utf8'));
});

console.log(m.decode(m.encode(object)));