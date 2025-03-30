import { describe, expect, it } from "vitest";

export function add(a: number, b: number) {
  return a + b;
}

export function showCorrectPostfix(number: number) {
  if (number > 0 && number < 5) {
    return `${number} transakce`;
  }
  if (number >= 5) {
    return `${number} transakcí`;
  }
  if (number == 0) {
    return `žádná transakce`;
  }
  return `${number} transakcí`;
}

describe("Math", () => {
  it("should add two numbers", () => {
    expect(add(1, 1)).toBe(2);
  });

  it("should add two numbers", () => {
    expect(add(1, 9)).toBe(10);
  });

  it("should add two numbers", () => {
    expect(add(1, -9)).toBe(-8);
  });

  it("should add two numbers", () => {
    expect(add(1, -1)).toBe(0);
  });

  it("should add two numbers", () => {
    expect(add(1, 0)).toBe(1);
  });
});

describe("showCorrectPostfix", () => {
  it("should return correct postfix", () => {
    expect(showCorrectPostfix(1)).toBe("1 transakce");
  });

  it("should return correct postfix for 2", () => {
    expect(showCorrectPostfix(2)).toBe("2 transakce");
  });

  it("should return correct postfix for 5", () => {
    expect(showCorrectPostfix(5)).toBe("5 transakcí");
  });

  it("should return correct postfix for 0", () => {
    expect(showCorrectPostfix(0)).toBe("žádná transakce");
  });

  it("should return correct postfix for 10", () => {
    expect(showCorrectPostfix(10)).toBe("10 transakcí");
  });

  it("should return correct postfix for 11", () => {
    expect(showCorrectPostfix(11)).toBe("11 transakcí");
  });

  it("should return correct postfix for 12", () => {
    expect(showCorrectPostfix(12)).toBe("12 transakcí");
  });
});
