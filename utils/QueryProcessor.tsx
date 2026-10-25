export default function QueryProcessor(query: string): string {
  if (query.toLowerCase().includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (query.toLowerCase().includes("name")) {
    return "ralkubai";
  }

  if (query.toLowerCase().includes("age")) {
    return "67";
  }

  if (query.toLowerCase().includes("andrew id")) {
    return "ralkubai";
  }

  if (query.toLowerCase().includes("plus")) {
    const nums = query.match(/\d+/g);
    if (nums) {
      return String(nums.map(Number).reduce((a, b) => a + b, 0));
    }
  }

  if (query.toLowerCase().includes("largest")) {
    const nums = query.match(/\d+/g);
    if (nums) {
      return String(Math.max(...nums.map(Number)));
    }
  }

  if (query.toLowerCase().includes("multiplied")) {
    const nums = query.match(/\d+/g);
    if (nums) return String(nums.map(Number).reduce((a, b) => a * b, 1));
  }

  if (query.toLowerCase().includes("minus")) {
    const nums = query.match(/\d+/g);
    if (nums) return String(nums.map(Number).reduce((a, b) => a - b));
  }

  if (query.toLowerCase().includes("square") && query.toLowerCase().includes("cube")) {
    const nums = query.match(/\d+/g);
    if (nums) {
      const hit = nums.map(Number).find(n => {
        const r = Math.sqrt(n), c = Math.cbrt(n);
        return Number.isInteger(r) && Math.abs(c - Math.round(c)) < 1e-9;
      });
      if (hit !== undefined) return String(hit);
    }
  }

  if (query.toLowerCase().includes("primes")) {
    const nums = query.match(/\d+/g);
    if (nums) {
      const isPrime = (n: number) => {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
        return true;
      };
      return nums.map(Number).filter(isPrime).join(", ");
    }
  }
  return "";
}
