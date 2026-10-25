export default function QueryProcessor(query: string): string {
  const q = query.toLowerCase();
  const nums = query.match(/\d+/g)?.map(Number) ?? [];

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

  if (q.includes("power")) {
    const raw = query.match(/\d+/g);
    if (raw && raw.length >= 2) {
      return (BigInt(raw[0]) ** BigInt(raw[1])).toString();
    }
    return "";
  }

  if (q.includes("square") && q.includes("cube")) {
    const hit = nums.find(n => {
      const r = Math.sqrt(n), c = Math.cbrt(n);
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

  if (q.includes("scrabble")) {
    const scores: Record<string, number> = {
      a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
      n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
    };
    const m = query.match(/"([^"]+)"|for ([a-zA-Z]+)/);
    const w = m?.[1] ?? m?.[2];
    if (w) return String(w.toLowerCase().split("").reduce((s, ch) => s + (scores[ch] ?? 0), 0));
  }

  if (q.includes("plus") || q.includes("minus") || q.includes("multiplied")) {
    const tokens = q.match(/\d+|plus|minus|multiplied/g);
    if (tokens) {
      const pass1: string[] = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "multiplied") {
          const left = Number(pass1.pop());
          const right = Number(tokens[i + 1]);
          i++;
          pass1.push(String(left * right));
        } else {
          pass1.push(tokens[i]);
        }
      }
      let result = Number(pass1[0]);
      for (let i = 1; i < pass1.length; i += 2) {
        const n = Number(pass1[i + 1]);
        if (pass1[i] === "plus") result += n;
        else if (pass1[i] === "minus") result -= n;
      }
      return String(result);
    }
  }
  const pass1: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "multiplied") {
      const left = Number(pass1.pop());
      const right = Number(tokens[i + 1]);
      pass1.push(String(left * right));
      i++;
    } else {
      pass1.push(tokens[i]);
    }
  }

  return "";
}