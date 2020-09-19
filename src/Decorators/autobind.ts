export function autobind(_cons: any, _propName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const actualFunc = descriptor.value;
    return {
        enumerable: true,
        get() {
            return actualFunc.bind(this);
        }
    }
}

