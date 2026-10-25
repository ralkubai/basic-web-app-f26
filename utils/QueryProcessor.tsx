export default function QueryProcessor(query: string): string {
  const q = query.toLowerCase();
  const nums = (query.match(/\d+/g) ?? []).map(Number);

  if (q.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (q.includes("andrew id")) return "ralkubai";
  if (q.includes("name")) return "ralkubai";
  if (q.includes("age")) return "67";

  // anagram: "Which of the following is an anagram of admirer: border, random, ..."
  if (q.includes("anagram")) {
    const m = q.match(/anagram of (\w+)\s*:\s*(.+?)\??$/);
    if (m) {
      const target = m[1].split("").sort().join("");
      const options = m[2].split(/,\s*/).map(s => s.trim());
      const hit = options.find(
        o => o !== m[1] && o.split("").sort().join("") === target
      );
      if (hit) return hit;
    }
  }

  // scrabble: "What is the scrabble score of zoo?"
  if (q.includes("scrabble")) {
    const scores: Record<string, number> = {
      a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
      n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
    };
    const m = q.match(/score of ([a-z]+)/);
    if (m) {
      return String(
        m[1].split("").reduce((s, ch) => s + (scores[ch] ?? 0), 0)
      );
    }
  }

  // power: BigInt, exponents get huge
  if (q.includes("power")) {
    const raw = query.match(/\d+/g);
    if (raw && raw.length >= 2) {
      return (BigInt(raw[0]) ** BigInt(raw[1])).toString();
    }
  }

  if (q.includes("square") && q.includes("cube")) {
    const hit = nums.find(n => {
      const r = Math.sqrt(n);
      const c = Math.cbrt(n);
      return Number.isInteger(r) && Math.abs(c - Math.round(c)) < 1e-9;
    });
    if (hit !== undefined) return String(hit);
  }

  if (q.includes("primes")) {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
      return true;
    };
    return nums.filter(isPrime).join(", ");
  }

  if (q.includes("largest")) return String(Math.max(...nums));

  if (q.includes("fibonacci")) {
    let a = 1n, b = 1n;
    for (let i = 1; i < nums[0]; i++) [a, b] = [b, a + b];
    return a.toString();
  }

  // arithmetic with precedence: multiplication before plus/minus
  if (q.includes("plus") || q.includes("minus") || q.includes("multiplied")) {
    const tokens = q.match(/\d+|plus|minus|multiplied/g);
    if (tokens) {
      const reduced: string[] = [];
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === "multiplied") {
          const left = Number(reduced.pop());
          const right = Number(tokens[i + 1]);
          reduced.push(String(left * right));
          i += 2;
        } else {
          reduced.push(tokens[i]);
          i += 1;
        }
      }
      let result = Number(reduced[0]);
      for (let j = 1; j < reduced.length - 1; j += 2) {
        const n = Number(reduced[j + 1]);
        if (reduced[j] === "plus") result += n;
        else if (reduced[j] === "minus") result -= n;
      }
      return String(result);
    }
  }

  return "";
}