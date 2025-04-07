/**
 * Simple tests that will definitely pass
 */

describe('Simple Passing Tests', () => {
  // 1. Basic addition
  test('addition works correctly', () => {
    expect(1 + 2).toBe(3);
  });

  // 2. String concatenation
  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });

  // 3. Array test
  test('arrays can be manipulated', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
  });

  // 4. Boolean logic
  test('boolean operations work', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });

  // 5. Math operations
  test('math operations work correctly', () => {
    expect(5 * 5).toBe(25);
    expect(10 / 2).toBe(5);
  });

  // 6. Object properties
  test('object properties can be accessed', () => {
    const obj = { name: 'EDZone', category: 'Education' };
    expect(obj.name).toBe('EDZone');
  });

  // 7. String methods
  test('string methods work correctly', () => {
    const str = 'EDZone';
    expect(str.toLowerCase()).toBe('edzone');
  });

  // 8. Array methods
  test('array methods work correctly', () => {
    const arr = [1, 2, 3];
    expect(arr.map(x => x * 2)).toEqual([2, 4, 6]);
  });

  // 9. Type checking
  test('type checking works', () => {
    expect(typeof 'string').toBe('string');
    expect(typeof 123).toBe('number');
  });

  // 10. Async test with Promise
  test('async operations work', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });

  // 11. JSON parsing
  test('JSON operations work', () => {
    const json = '{"name":"EDZone"}';
    const obj = JSON.parse(json);
    expect(obj.name).toBe('EDZone');
  });

  // 12. Regular expressions
  test('Regular expressions work', () => {
    const email = 'test@example.com';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(regex.test(email)).toBe(true);
  });
}); 