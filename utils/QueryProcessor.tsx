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

  if (query.toLowerCase().includes("power")) {
    const nums = query.match(/\d+/g);
    if (nums && nums.length >= 2) {
      return (BigInt(nums[0]) ** BigInt(nums[1])).toString();
    }
  }

  if (query.toLowerCase().includes("fibonacci")) {
    const nums = query.match(/\d+/g);
    if (nums) {
      const n = Number(nums[0]);
      let a = 1n, b = 1n;
      for (let i = 1; i < n; i++) [a, b] = [b, a + b];
      return a.toString();
    }
  }
  if (query.toLowerCase().includes("scrabble")) {
    const scores: Record<string, number> = {
      a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
      n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
    };
    const word = query.match(/"([^"]+)"|for ([a-zA-Z]+)/);
    const w = word?.[1] ?? word?.[2];
    if (w) {
      return String(
        w.toLowerCase().split("").reduce((sum, ch) => sum + (scores[ch] ?? 0), 0)
      );
    }
  }
  if (query.toLowerCase().includes("plus") && query.toLowerCase().includes("multiplied")) {
    // handle explicitly — order of operations matters
  }

  if (query.toLowerCase().includes("multiplied") || query.toLowerCase().includes("plus") || query.toLowerCase().includes("minus")) {
    const tokens = query.toLowerCase().match(/\d+|plus|minus|multiplied/g);
    if (tokens) {
      // first pass: multiplication
      const pass1: (string)[] = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "multiplied") {
          const left = Number(pass1.pop());
          const right = Number(tokens[++i + 1]);
          i++;
          pass1.push(String(left * right));
        } else {
          pass1.push(tokens[i]);
        }
      }
      // second pass: addition and subtraction, left to right
      let result = Number(pass1[0]);
      for (let i = 1; i < pass1.length; i += 2) {
        const n = Number(pass1[i + 1]);
        if (pass1[i] === "plus") result += n;
        else if (pass1[i] === "minus") result -= n;
      }
      return String(result);
    }
  }
  return "";
}
