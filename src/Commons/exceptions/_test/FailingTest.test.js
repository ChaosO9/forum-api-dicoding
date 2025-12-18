describe('Intentional Failing Test - CI Demonstration', () => {
  it('should demonstrate a failing test case', () => {
    // This test will fail intentionally to show CI failure
    const expectedValue = 10;
    const actualValue = 5;
    
    expect(actualValue).toBe(expectedValue);
  });
});
