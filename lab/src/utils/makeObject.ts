export function makeObject(name: string, value: number) {
    return { name, value };
}

export function testMakeObject() {
    console.log(makeObject('Sannim', 28));
}
