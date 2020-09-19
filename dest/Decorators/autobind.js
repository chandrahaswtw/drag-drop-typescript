export function autobind(_cons, _propName, descriptor) {
    const actualFunc = descriptor.value;
    return {
        enumerable: true,
        get() {
            return actualFunc.bind(this);
        }
    };
}
