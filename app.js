const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = items => items[randInt(0, items.length - 1)];
const randStep = (min, max, step) => randInt(Math.ceil(min / step), Math.floor(max / step)) * step;
const money = value => `£${Number(value).toFixed(2)}`;
const tidy = value => Number(Number(value).toFixed(2));
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const simplify = (n, d) => `${n / gcd(n, d)}/${d / gcd(n, d)}`;
const difficultyScale = { Easy: 1, Medium: 2, Hard: 3 };
const contextNames = ["Aisha", "Ben", "Chloe", "Darius", "Ella", "Farah", "Grace", "Harvey", "Imani", "Jay"];
const styleAt = (styles, index) => styles[index % styles.length];
const numberWordsOnes = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const numberWordsTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function formatClock(totalMinutes) {
  const minutesInDay = 24 * 60;
  const wrapped = ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
  const hours24 = Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  const suffix = hours24 < 12 ? "am" : "pm";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatFractions(value) {
  return String(value).replace(/\b(\d{1,3})\/(\d{1,3})\b/g, `<span class="fraction"><span>$1</span><span>$2</span></span>`);
}

function formatText(value) {
  return formatFractions(value);
}

function underThousandToWords(number) {
  const hundred = Math.floor(number / 100);
  const remainder = number % 100;
  const words = [];
  if (hundred) words.push(`${numberWordsOnes[hundred]} hundred`);
  if (remainder) {
    if (remainder < 20) words.push(numberWordsOnes[remainder]);
    else words.push(`${numberWordsTens[Math.floor(remainder / 10)]}${remainder % 10 ? ` ${numberWordsOnes[remainder % 10]}` : ""}`);
  }
  return words.join(" ");
}

function numberToWords(number) {
  const thousands = Math.floor(number / 1000);
  const rest = number % 1000;
  return `${underThousandToWords(thousands)} thousand${rest ? `, ${underThousandToWords(rest)}` : ""}`;
}

function question(text, answer, solution, extras = {}) {
  return { text, answer: String(answer), solution, marks: 2, responseSize: "medium", ...extras };
}

function validateQuestion(item) {
  const quality = item.quality;
  if (!quality) return item;
  if (quality.exactScale && quality.target % quality.start !== 0) throw new Error("Proportion target must be an exact multiple.");
  if (quality.nonNegative && quality.value < 0) throw new Error("Question produced an unexpected negative value.");
  if (quality.uniqueValues && new Set(quality.values).size !== quality.values.length) throw new Error("Question requires unique values.");
  if (quality.uniqueHighest && quality.counts.filter(count => count === Math.max(...quality.counts)).length !== 1) throw new Error("Question requires one clear highest value.");
  if (quality.hundredths && Math.abs(Math.round(quality.value * 100) - quality.value * 100) > 1e-8) throw new Error("Question produced unnecessary decimal precision.");
  return item;
}

function spinnerVisual(values) {
  const centre = 100;
  const radius = 82;
  const labelRadius = 61;
  const sectors = values.map((value, index) => {
    const startAngle = -90 + index * 36;
    const endAngle = startAngle + 36;
    const start = {
      x: centre + radius * Math.cos(startAngle * Math.PI / 180),
      y: centre + radius * Math.sin(startAngle * Math.PI / 180)
    };
    const end = {
      x: centre + radius * Math.cos(endAngle * Math.PI / 180),
      y: centre + radius * Math.sin(endAngle * Math.PI / 180)
    };
    const labelAngle = startAngle + 18;
    const label = {
      x: centre + labelRadius * Math.cos(labelAngle * Math.PI / 180),
      y: centre + labelRadius * Math.sin(labelAngle * Math.PI / 180)
    };
    return `<path d="M ${centre} ${centre} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z" class="spinner-sector sector-${index % 2}"></path><text x="${label.x.toFixed(2)}" y="${(label.y + 4).toFixed(2)}">${value}</text>`;
  }).join("");
  return `<div class="spinner-visual" aria-label="Spinner with ten equal sections labelled ${values.join(", ")}"><svg viewBox="0 0 200 200" role="img">${sectors}<circle cx="100" cy="100" r="8" class="spinner-pin"></circle><path d="M100 100 L100 35 L94 48 M100 35 L106 48" class="spinner-arrow"></path></svg></div>`;
}

const topics = {
  addition: { group: "Number", label: "Addition", make: (d, index = 0) => {
    const max = [100, 1000, 10000][difficultyScale[d] - 1], a = randInt(max / 5, max), b = randInt(max / 5, max);
    const total = a + b;
    const text = styleAt([
      `A community event sold ${a.toLocaleString()} tickets online and ${b.toLocaleString()} tickets at the venue. How many tickets were sold altogether?`,
      `A warehouse received ${a.toLocaleString()} boxes on Monday and ${b.toLocaleString()} boxes on Tuesday. How many boxes were received in total?`,
      `A charity raised £${a.toLocaleString()} at a sponsored walk and £${b.toLocaleString()} at a bake sale. How much did it raise altogether?`,
      `A bus travelled ${a.toLocaleString()} miles in the first week and ${b.toLocaleString()} miles in the second week. What distance did it travel across both weeks?`,
      `${a.toLocaleString()} people visited a leisure centre in the morning. A further ${b.toLocaleString()} visited in the afternoon. What was the total number of visitors?`,
      `A college ordered ${a.toLocaleString()} notebooks and ${b.toLocaleString()} folders. How many items did it order altogether?`
    ], index);
    const answer = styleAt([total.toLocaleString(), `${total.toLocaleString()} boxes`, `£${total.toLocaleString()}`, `${total.toLocaleString()} miles`, `${total.toLocaleString()} people`, `${total.toLocaleString()} items`], index);
    return question(text, answer, `${a.toLocaleString()} + ${b.toLocaleString()} = ${answer}`, { styleId: `addition-${index % 6}` });
  }},
  subtraction: { group: "Number", label: "Subtraction", make: (d, index = 0) => {
    const max = [200, 2000, 20000][difficultyScale[d] - 1], a = randInt(max / 2, max), b = randInt(max / 5, a - 1);
    const text = styleAt([
      `A warehouse had ${a.toLocaleString()} items in stock and dispatched ${b.toLocaleString()}. How many items remain?`,
      `A venue has space for ${a.toLocaleString()} people. ${b.toLocaleString()} seats have been booked. How many seats are still available?`,
      `A fundraising target is £${a.toLocaleString()}. The group has raised £${b.toLocaleString()}. How much more is needed?`,
      `A delivery route is ${a.toLocaleString()} miles long. The driver has completed ${b.toLocaleString()} miles. How far is left to travel?`,
      `A printer began with ${a.toLocaleString()} sheets of paper and used ${b.toLocaleString()}. How many sheets are left?`
    ], index);
    return question(text, (a - b).toLocaleString(), `${a.toLocaleString()} − ${b.toLocaleString()} = ${(a - b).toLocaleString()}`, { styleId: `subtraction-${index % 5}` });
  }},
  multiplication: { group: "Number", label: "Multiplication", make: (d, index = 0) => {
    const a = randInt(3, [12, 25, 60][difficultyScale[d] - 1]), b = randInt(3, [12, 40, 90][difficultyScale[d] - 1]);
    const text = styleAt([
      `A hall has ${a} rows with ${b} chairs in each row. How many chairs are there altogether?`,
      `A shop packs ${b} bottles into each crate. How many bottles are in ${a} crates?`,
      `A worker earns £${b} per shift and works ${a} shifts. What is the total pay?`,
      `A school orders ${a} packs containing ${b} pens each. How many pens are ordered?`,
      `A journey of ${b} miles is made ${a} times. How many miles are travelled altogether?`
    ], index);
    return question(text, a * b, `${a} × ${b} = ${a * b}`, { styleId: `multiplication-${index % 5}` });
  }},
  division: { group: "Number", label: "Division", make: (d, index = 0) => {
    const b = randInt(3, [10, 15, 25][difficultyScale[d] - 1]), answer = randInt(3, [12, 30, 50][difficultyScale[d] - 1]), a = b * answer;
    const text = styleAt([
      `${a} leaflets are shared equally between ${b} volunteers. How many leaflets does each volunteer receive?`,
      `${a} items are packed equally into ${b} boxes. How many items go in each box?`,
      `A total of £${a} is shared equally between ${b} clubs. How much does each club receive?`,
      `A ${a}-mile route is split into ${b} equal stages. How long is each stage?`,
      `${a} tickets are arranged into rows of ${b}. How many rows are needed?`
    ], index);
    return question(text, answer, `${a} ÷ ${b} = ${answer}`, { styleId: `division-${index % 5}` });
  }},
  negatives: { group: "Number", label: "Negative numbers", make: d => {
    const start = randInt(-12, 5), change = randInt(4, [9, 15, 22][difficultyScale[d] - 1]) * pick([-1, 1]), end = start + change;
    return question(`At 6 am the temperature was ${start}°C. It then ${change > 0 ? "rose" : "fell"} by ${Math.abs(change)}°C. What was the new temperature?`, `${end}°C`, `${start} ${change >= 0 ? "+" : "−"} ${Math.abs(change)} = ${end}°C`);
  }},
  rounding: { group: "Number", label: "Rounding & estimation", make: d => {
    const place = [10, 100, 1000][difficultyScale[d] - 1], n = randInt(place, place * 20), ans = Math.round(n / place) * place;
    return question(`Round ${n.toLocaleString()} to the nearest ${place.toLocaleString()}.`, ans.toLocaleString(), `${n.toLocaleString()} lies closest to ${ans.toLocaleString()} when rounded to the nearest ${place.toLocaleString()}.`);
  }},
  orderOperations: { group: "Number", label: "Order of operations", make: d => {
    const a = randInt(20, [60, 90, 140][difficultyScale[d] - 1]), b = randInt(4, 18), c = pick([2, 3, 4, 6]), dValue = randInt(2, 8), answer = a + b * dValue - c * dValue;
    return question(`${a} + ${b} × ${dValue} - (${c} × ${dValue}) =`, answer, `Calculate the multiplications first: ${b} × ${dValue} = ${b*dValue} and ${c} × ${dValue} = ${c*dValue}. Then ${a} + ${b*dValue} - ${c*dValue} = ${answer}.`, { marks: 2, styleId: "order-operations" });
  }},
  wordToFigures: { group: "Number", label: "Words and figures", make: d => {
    const number = randInt(120, [250, 650, 950][difficultyScale[d] - 1]) * 1000 + randInt(100, 999);
    return question(`Write the following number using figures: ${numberToWords(number)}.`, number.toLocaleString(), `${numberToWords(number)} is written as ${number.toLocaleString()}.`, { marks: 1, responseSize: "small", styleId: "word-to-figures" });
  }},
  simplifyFractions: { group: "Fractions", label: "Simplifying fractions", make: d => {
    const baseD = randInt(3, [8, 12, 18][difficultyScale[d] - 1]), baseN = randInt(1, baseD - 1), factor = randInt(2, 8), n = baseN * factor, den = baseD * factor;
    return question(`Write ${n}/${den} in its simplest form.`, simplify(n, den), `The highest common factor is ${gcd(n, den)}. Divide top and bottom by ${gcd(n, den)}: ${n}/${den} = ${simplify(n, den)}.`);
  }},
  fractionAmount: { group: "Fractions", label: "Fractions of amounts", make: d => {
    const den = pick([2, 3, 4, 5, 8, 10]), n = randInt(1, den - 1), unit = randInt(3, [12, 25, 40][difficultyScale[d] - 1]), total = den * unit;
    return question(`${pick(contextNames)} spends ${n}/${den} of £${total} on travel. How much is spent on travel?`, money(n * unit), `£${total} ÷ ${den} = £${unit}; £${unit} × ${n} = ${money(n * unit)}.`);
  }},
  compareFractions: { group: "Fractions", label: "Comparing fractions", make: () => {
    let a = randInt(1, 8), b = randInt(a + 1, 12), c = randInt(1, 8), d = randInt(c + 1, 12);
    while (a * d === c * b) c = randInt(1, d - 1);
    const leftLarger = a * d > c * b;
    return question(`Which fraction is larger: ${a}/${b} or ${c}/${d}?`, leftLarger ? `${a}/${b}` : `${c}/${d}`, `Cross-multiply: ${a} × ${d} = ${a * d} and ${c} × ${b} = ${c * b}. The larger result belongs to ${leftLarger ? `${a}/${b}` : `${c}/${d}`}.`);
  }},
  decimalCalculations: { group: "Decimals", label: "Decimal calculations", make: (d, index = 0) => {
    const a = tidy(randInt(20, [100, 500, 2000][difficultyScale[d] - 1]) / 10), b = tidy(randInt(10, a * 10) / 10);
    const text = styleAt([
      `A cable is ${a} m long. Another cable is ${b} m long. What is their total length?`,
      `A walking route has two sections measuring ${a} km and ${b} km. What is the total distance?`,
      `Two parcels weigh ${a} kg and ${b} kg. What is their combined weight?`,
      `A container holds ${a} litres and another holds ${b} litres. How much do they hold altogether?`
    ], index);
    return question(text, `${tidy(a + b)} ${index % 4 === 1 ? "km" : index % 4 === 2 ? "kg" : index % 4 === 3 ? "litres" : "m"}`, `${a} + ${b} = ${tidy(a + b)}`, { styleId: `decimal-${index % 4}` });
  }},
  orderDecimals: { group: "Decimals", label: "Ordering decimals", make: d => {
    const places = difficultyScale[d] === 1 ? 10 : 100, nums = Array.from(new Set(Array.from({length: 7}, () => randInt(1, places * 3) / places))).slice(0, 4);
    const ordered = [...nums].sort((a,b) => a-b);
    return question(`Put these numbers in ascending order: ${nums.join(", ")}.`, ordered.join(", "), `Ascending means smallest to largest: ${ordered.join(" < ")}.`);
  }},
  percentages: { group: "Percentages", label: "Percentages of amounts", make: (d, index = 0) => {
    const pct = pick([5, 10, 20, 25, 40, 50, 75]), base = randInt(2, [12, 30, 60][difficultyScale[d] - 1]) * 20, ans = base * pct / 100;
    const text = styleAt([
      `A training course has ${base} learners. ${pct}% complete an online module. How many learners complete it?`,
      `A survey is completed by ${base} people. ${pct}% choose option A. How many people choose option A?`,
      `A shop has ${base} items in stock. ${pct}% are sold. How many items are sold?`,
      `A venue has ${base} seats. ${pct}% are occupied. How many seats are occupied?`
    ], index);
    return question(text, ans, `${pct}% of ${base} = ${pct}/100 × ${base} = ${ans}.`, { styleId: `percentage-${index % 4}` });
  }},
  increase: { group: "Percentages", label: "Percentage increase & decrease", make: d => {
    const pct = pick([5, 10, 20, 25]), base = randInt(2, [10, 25, 50][difficultyScale[d] - 1]) * 20, up = pick([true, false]), change = base * pct / 100, ans = up ? base + change : base - change;
    return question(`A monthly budget of ${money(base)} is ${up ? "increased" : "decreased"} by ${pct}%. What is the new budget?`, money(ans), `${pct}% of ${money(base)} = ${money(change)}. ${money(base)} ${up ? "+" : "−"} ${money(change)} = ${money(ans)}.`);
  }},
  discounts: { group: "Percentages", label: "Discounts & VAT", make: (d, index = 0) => {
    const discount = pick([10, 15, 20, 25, 30]), price = randInt(2, [10, 25, 60][difficultyScale[d] - 1]) * 20, saving = price * discount / 100, sale = price - saving;
    const item = styleAt(["jacket", "bicycle", "laptop", "sofa", "train ticket"], index);
    return question(`A ${item} costs ${money(price)}. It is reduced by ${discount}%. What is the sale price?`, money(sale), `${discount}% of ${money(price)} = ${money(saving)}. ${money(price)} − ${money(saving)} = ${money(sale)}.`, { styleId: `discount-${index % 5}` });
  }},
  simplifyRatio: { group: "Ratio & proportion", label: "Simplifying ratios", make: d => {
    const a = randInt(1, [6, 10, 15][difficultyScale[d] - 1]), b = randInt(1, [6, 10, 15][difficultyScale[d] - 1]), factor = randInt(2, 8);
    return question(`Simplify the ratio ${a * factor}:${b * factor}.`, `${a / gcd(a,b)}:${b / gcd(a,b)}`, `Divide both parts by ${factor * gcd(a,b)} to get ${a / gcd(a,b)}:${b / gcd(a,b)}.`);
  }},
  sharingRatio: { group: "Ratio & proportion", label: "Sharing in ratios", make: d => {
    const a = randInt(1, 5), b = randInt(1, 5), unit = randInt(3, [10, 20, 40][difficultyScale[d] - 1]), total = (a + b) * unit;
    return question(`${money(total)} is shared between two clubs in the ratio ${a}:${b}. How much does each club receive?`, `${money(a * unit)} and ${money(b * unit)}`, `Total parts = ${a} + ${b} = ${a+b}. One part = ${money(total)} ÷ ${a+b} = ${money(unit)}. Shares: ${a} × ${money(unit)} = ${money(a*unit)} and ${b} × ${money(unit)} = ${money(b*unit)}.`);
  }},
  shopping: { group: "Money", label: "Shopping & change", make: d => {
    const price = tidy(randInt(100, [800, 2500, 6000][difficultyScale[d] - 1]) / 100), qty = randInt(2, 5), paid = Math.ceil(price * qty / 10) * 10, total = tidy(price * qty);
    return question(`${pick(contextNames)} buys ${qty} items costing ${money(price)} each and pays with ${money(paid)}. How much change should they receive?`, money(paid - total), `${qty} × ${money(price)} = ${money(total)}. ${money(paid)} − ${money(total)} = ${money(paid - total)}.`);
  }},
  budgets: { group: "Money", label: "Budgets", make: d => {
    const rent = randInt(5, 15) * 20, food = randInt(3, 10) * 20, travel = randInt(2, 8) * 20, left = randInt(2, [8, 18, 30][difficultyScale[d] - 1]) * 20, income = rent + food + travel + left;
    return question(`A household has ${money(income)} available. It budgets ${money(rent)} for rent, ${money(food)} for food and ${money(travel)} for travel. How much remains?`, money(left), `Total spending = ${money(rent)} + ${money(food)} + ${money(travel)} = ${money(rent+food+travel)}. Remaining = ${money(income)} − ${money(rent+food+travel)} = ${money(left)}.`, { quality: { nonNegative: true, value: left } });
  }},
  subscriptionCompare: { group: "Money", label: "Contract comparison", make: d => {
    const currentMonthly = tidy(randStep(2500, [4500, 6500, 9000][difficultyScale[d]-1], 50) / 100);
    const joiningFee = randStep(1500, [4000, 7000, 10000][difficultyScale[d]-1], 500) / 100;
    const newMonthly = tidy(Math.max(15, currentMonthly - randStep(200, 900, 50) / 100));
    const months = 12;
    const currentTotal = currentMonthly * months;
    const newTotal = joiningFee + newMonthly * months;
    const saving = tidy(currentTotal - newTotal);
    return question(`${pick(contextNames)} currently pays ${money(currentMonthly)} per month for a subscription. A new company charges a joining fee of ${money(joiningFee)} plus ${money(newMonthly)} per month for a minimum contract of 1 year. Will changing company save money? Explain your answer.`, `${saving > 0 ? "Yes" : "No"}; ${saving > 0 ? `saves ${money(saving)}` : `costs ${money(Math.abs(saving))} more`}`, `Current yearly cost = 12 × ${money(currentMonthly)} = ${money(currentTotal)}. New yearly cost = ${money(joiningFee)} + 12 × ${money(newMonthly)} = ${money(newTotal)}. Difference = ${money(Math.abs(saving))}.`, {
      marks: 3,
      responseSize: "large",
      parts: ["Calculate the current yearly cost.", "Calculate the new yearly cost.", "State whether changing saves money."]
    });
  }},
  sharedBillCheck: { group: "Money", label: "Shared bill check", make: d => {
    const people = randInt(3, [5, 8, 12][difficultyScale[d]-1]);
    const share = tidy(randStep(1200, [3500, 5500, 7500][difficultyScale[d]-1], 25) / 100);
    const bill = tidy(people * share);
    const suggested = tidy(share + pick([-1, 0, 1]) * randStep(25, 150, 25) / 100);
    const correct = suggested === share;
    return question(`${people} friends share a restaurant bill of ${money(bill)} equally. One person thinks each friend should pay ${money(suggested)}. Is this correct?`, `${correct ? "Yes" : "No"}; each should pay ${money(share)}`, `${money(bill)} ÷ ${people} = ${money(share)}. Compare this with ${money(suggested)}.`, {
      marks: 3,
      responseSize: "medium"
    });
  }},
  bestBuys: { group: "Money", label: "Best buys", make: () => {
    const qtyA = pick([4,5,6]), priceA = tidy(randInt(350, 850)/100), qtyB = qtyA+pick([2,3,4]), priceB = tidy(randInt(Math.ceil(priceA*100), Math.ceil(priceA*180))/100), unitA=priceA/qtyA, unitB=priceB/qtyB;
    return question(`Pack A contains ${qtyA} items for ${money(priceA)}. Pack B contains ${qtyB} items for ${money(priceB)}. Which is the better buy?`, unitA < unitB ? "Pack A" : "Pack B", `Pack A: ${money(priceA)} ÷ ${qtyA} = ${money(unitA)} each. Pack B: ${money(priceB)} ÷ ${qtyB} = ${money(unitB)} each. ${unitA < unitB ? "Pack A" : "Pack B"} has the lower unit price.`);
  }},
  profit: { group: "Money", label: "Profit & loss", make: d => {
    const cost = randInt(5, [20, 50, 100][difficultyScale[d]-1])*5, selling = cost + randInt(-Math.floor(cost/4), Math.floor(cost/2)), diff=selling-cost;
    return question(`A trader buys an item for ${money(cost)} and sells it for ${money(selling)}. State the profit or loss.`, `${diff >= 0 ? "Profit" : "Loss"} of ${money(Math.abs(diff))}`, `${money(selling)} − ${money(cost)} = ${money(diff)}. This is a ${diff >= 0 ? "profit" : "loss"} of ${money(Math.abs(diff))}.`);
  }},
  simpleInterest: { group: "Money", label: "Simple interest", make: d => {
    const principal = randStep(200, [1000, 5000, 20000][difficultyScale[d]-1], 10);
    const rate = pick([2, 3, 4, 5, 6]);
    const years = randInt(1, [1, 3, 5][difficultyScale[d]-1]);
    const interest = principal * rate / 100 * years;
    const final = principal + interest;
    return question(`A savings account contains ${money(principal)} and pays ${rate}% simple interest per year. How much will be in the account after ${years} ${years === 1 ? "year" : "years"}?`, money(final), `Interest = ${rate}% of ${money(principal)} × ${years} = ${money(interest)}. Final amount = ${money(principal)} + ${money(interest)} = ${money(final)}.`, {
      marks: 3,
      responseSize: "medium"
    });
  }},
  time: { group: "Time", label: "Duration & clocks", make: (d, index = 0) => {
    const startH=randInt(7,16), startM=pick([0,10,15,20,30,45]), duration=randInt(2,[8,18,30][difficultyScale[d]-1])*15, total=startH*60+startM+duration, endH=Math.floor(total/60)%24,endM=total%60;
    const activity = styleAt(["course", "film", "train journey", "workshop", "sports session"], index);
    const startTime = formatClock(startH * 60 + startM), finishTime = formatClock(total);
    return question(`A ${activity} starts at ${startTime} and lasts ${duration} minutes. What time does it finish?`, finishTime, `Add ${duration} minutes to ${startTime}. The finish time is ${finishTime}.`, { styleId: `time-${index % 5}` });
  }},
  conversions: { group: "Measures", label: "Metric conversions", make: d => {
    const type=pick(["length","weight","capacity"]), units={length:["m","cm",100],weight:["kg","g",1000],capacity:["litres","ml",1000]}[type], value=randInt(2,[10,25,50][difficultyScale[d]-1]);
    return question(`Convert ${value} ${units[0]} into ${units[1]}.`, `${value*units[2]} ${units[1]}`, `${value} × ${units[2]} = ${value*units[2]} ${units[1]}.`);
  }},
  perimeter: { group: "Geometry", label: "Perimeter", make: (d, index = 0) => {
    const l=randInt(3,[12,25,50][difficultyScale[d]-1]),w=randInt(2,l);
    const place = styleAt(["garden", "playground", "car park", "sports court", "room"], index);
    return question(`A rectangular ${place} is ${l} m long and ${w} m wide. What is its perimeter?`, `${2*(l+w)} m`, `Perimeter = 2 × (${l} + ${w}) = ${2*(l+w)} m.`, { styleId: `perimeter-${index % 5}` });
  }},
  area: { group: "Geometry", label: "Area", make: (d, index = 0) => {
    const l=randInt(3,[12,25,50][difficultyScale[d]-1]),w=randInt(2,l);
    const place = styleAt(["floor", "garden", "wall", "playing field", "patio"], index);
    return question(`A rectangular ${place} is ${l} m by ${w} m. What is its area?`, `${l*w} m²`, `Area = length × width = ${l} × ${w} = ${l*w} m².`, { styleId: `area-${index % 5}` });
  }},
  volume: { group: "Geometry", label: "Volume", make: d => {
    const l=randInt(2,[6,10,15][difficultyScale[d]-1]),w=randInt(2,l),h=randInt(2,[6,10,15][difficultyScale[d]-1]);
    return question(`A cuboid container measures ${l} cm by ${w} cm by ${h} cm. What is its volume?`, `${l*w*h} cm³`, `Volume = ${l} × ${w} × ${h} = ${l*w*h} cm³.`);
  }},
  angles: { group: "Geometry", label: "Angles", make: d => {
    const total=pick([90,180,360]), a=randInt(10,total-20), b=d==="Easy" ? null : randInt(10,total-a-10), missing=total-a-(b||0);
    return question(`Angles ${a}°${b ? `, ${b}°` : ""} and x add up to ${total}°. Find x.`, `${missing}°`, `x = ${total}° − ${a}°${b ? ` − ${b}°` : ""} = ${missing}°.`);
  }},
  averages: { group: "Statistics", label: "Mean, median, mode & range", make: d => {
    const type=pick(["mean","median","range"]), count=d==="Easy"?5:7, nums=Array.from({length:count},()=>randInt(2,[12,25,50][difficultyScale[d]-1])).sort((a,b)=>a-b);
    if(type==="mean"){ const sum=nums.reduce((a,b)=>a+b,0); nums[nums.length-1]+= (count-(sum%count))%count; const s=nums.reduce((a,b)=>a+b,0); return question(`Find the mean of: ${nums.join(", ")}.`, s/count, `Total = ${s}. There are ${count} values. ${s} ÷ ${count} = ${s/count}.`);}
    if(type==="median") return question(`Find the median of: ${nums.join(", ")}.`, nums[Math.floor(count/2)], `The values are in order. The middle value is ${nums[Math.floor(count/2)]}.`);
    return question(`Find the range of: ${nums.join(", ")}.`, nums[count-1]-nums[0], `Range = highest − lowest = ${nums[count-1]} − ${nums[0]} = ${nums[count-1]-nums[0]}.`);
  }},
  probability: { group: "Probability", label: "Basic probability", make: d => {
    const red=randInt(1,[5,10,20][difficultyScale[d]-1]),blue=randInt(1,[5,10,20][difficultyScale[d]-1]),total=red+blue;
    return question(`A bag contains ${red} red counters and ${blue} blue counters. What is the probability of choosing a red counter?`, simplify(red,total), `There are ${total} counters altogether. Probability = red ÷ total = ${red}/${total} = ${simplify(red,total)}.`);
  }},
  probabilityScale: { group: "Probability", label: "Probability scale", make: () => {
    const favourable = pick([1, 2, 3, 4, 5]);
    const answer = simplify(favourable, 6);
    return question(`A fair dice is rolled. A player wins if it lands on one of ${favourable} winning numbers. What is the probability of winning? Show where this belongs on the probability scale.`, answer, `There are ${favourable} winning outcomes out of 6 equally likely outcomes, so the probability is ${favourable}/6 = ${answer}.`, {
      marks: 2,
      responseSize: "medium",
      visual: `<div class="probability-scale"><span>Impossible<br>0</span><i></i><span>Even chance<br>1/2</span><i></i><span>Certain<br>1</span></div>`
    });
  }},
  fractionConversionTable: { group: "Fractions", label: "Fraction, decimal & percentage", make: () => {
    const options = [[1,2],[1,4],[3,4],[1,5],[2,5]], [n,d] = pick(options), decimal = n/d, percentage = decimal*100;
    return question(`Complete the table to show this fraction as a decimal and a percentage.`, `${decimal} and ${percentage}%`, `${n} ÷ ${d} = ${decimal}. Multiply the decimal by 100 to get ${percentage}%.`, {
      marks: 2, responseSize: "small", visual: `<table class="data-table conversion-table"><thead><tr><th>Fraction</th><th>Decimal</th><th>Percentage</th></tr></thead><tbody><tr><td>${n}/${d}</td><td class="blank-cell"></td><td class="blank-cell"></td></tr></tbody></table>`
    });
  }},
  salesTable: { group: "Statistics", label: "Reading and ordering a table", make: d => {
    const months = ["January","February","March","April","May"], values = [];
    while (values.length < months.length) {
      const value = randInt(35, [90,160,250][difficultyScale[d]-1])*100;
      if (!values.includes(value)) values.push(value);
    }
    const highest = Math.max(...values), lowest = Math.min(...values);
    return question(`Use the sales table to answer both questions.`, `${months[values.indexOf(highest)]}; ${money(highest-lowest)}`, `The highest value is ${money(highest)}, in ${months[values.indexOf(highest)]}. Range = ${money(highest)} − ${money(lowest)} = ${money(highest-lowest)}.`, {
      marks: 3, responseSize: "medium",
      visual: `<table class="data-table"><thead><tr>${months.map(m => `<th>${m.slice(0,3)}</th>`).join("")}</tr></thead><tbody><tr>${values.map(v => `<td>${money(v)}</td>`).join("")}</tr></tbody></table>`,
      parts: [`a) Which month had the highest sales?`, `b) What is the range of the sales figures?`],
      quality: { uniqueValues: true, values }
    });
  }},
  reviewSummaryTable: { group: "Statistics", label: "Complete a summary table", make: () => {
    const total = pick([100, 200, 250]);
    const excellentPct = pick([20, 25, 30, 40, 45]);
    const excellent = total * excellentPct / 100;
    const good = randStep(total * 0.25, total * 0.45, 5);
    const average = total - excellent - good;
    const goodPct = good / total * 100;
    const averagePct = average / total * 100;
    return question(`A website received ${total} reviews for a new product. ${excellentPct}% rated it excellent. ${good} rated it good. The remainder rated it average. Complete the summary table.`, `Excellent: ${excellent}; Good: ${goodPct}%; Average: ${average} and ${averagePct}%`, `Excellent score = ${excellentPct}% of ${total} = ${excellent}. Average score = ${total} - ${excellent} - ${good} = ${average}. Good percentage = ${good}/${total} × 100 = ${goodPct}%. Average percentage = ${average}/${total} × 100 = ${averagePct}%.`, {
      marks: 3,
      responseSize: "large",
      visual: `<table class="data-table"><thead><tr><th>Rating</th><th>Score</th><th>Percentage</th></tr></thead><tbody><tr><td>Excellent</td><td class="blank-cell"></td><td>${excellentPct}%</td></tr><tr><td>Good</td><td>${good}</td><td class="blank-cell"></td></tr><tr><td>Average</td><td class="blank-cell"></td><td class="blank-cell"></td></tr></tbody></table>`
    });
  }},
  meanRangeCompare: { group: "Statistics", label: "Mean and range comparison", make: d => {
    const count = 7;
    const values = Array.from({ length: count }, () => randInt(10, [80, 180, 260][difficultyScale[d]-1])).sort((a,b)=>a-b);
    const sum = values.reduce((a,b)=>a+b,0);
    values[count - 1] += (count - (sum % count)) % count;
    values.sort((a,b)=>a-b);
    const total = values.reduce((a,b)=>a+b,0);
    const mean = total / count;
    const range = values[count-1] - values[0];
    const oldMean = mean + pick([-12, -8, 8, 12]);
    const oldRange = Math.max(5, range + pick([-15, -10, 10, 15]));
    const meanClaim = mean < oldMean;
    const rangeClaim = range < oldRange;
    return question(`A learner records these figures over seven days: ${values.join("  ")}. Last year the mean was ${oldMean} and the range was ${oldRange}. They think both the mean and range are lower this year. Are they correct?`, `${meanClaim && rangeClaim ? "Yes" : "No"}; mean ${mean}, range ${range}`, `Mean = ${total} ÷ ${count} = ${mean}. Range = ${values[count-1]} - ${values[0]} = ${range}. Compare these with last year's mean of ${oldMean} and range of ${oldRange}.`, {
      marks: 3,
      responseSize: "large",
      parts: ["Calculate this year's mean.", "Calculate this year's range.", "State whether the claim is correct."]
    });
  }},
  mixedWeights: { group: "Measures", label: "Mixed-unit total", make: d => {
    const grams = [randStep(250,900,10), randStep(300,950,10), randStep(400,1200,10)], kilos = [tidy(randInt(4,[12,20,30][difficultyScale[d]-1])/10), tidy(randInt(5,18)/10)];
    const totalG = grams.reduce((a,b)=>a+b,0) + kilos.reduce((a,b)=>a+b,0)*1000;
    return question(`These parcels need to be loaded into a van. Calculate their total weight. Give your answer in kilograms.`, `${tidy(totalG/1000)} kg`, `${grams.join(" g + ")} g, plus ${kilos.join(" kg + ")} kg. Convert all values to kilograms and add them: ${tidy(totalG/1000)} kg.`, {
      marks: 3, responseSize: "large", visual: `<div class="value-cards">${[...grams.map(v=>`${v} g`),...kilos.map(v=>`${v} kg`)].map(v=>`<span>${v}</span>`).join("")}</div>`,
      quality: { hundredths: true, value: totalG/1000 }
    });
  }},
  compareServices: { group: "Money", label: "Compare service costs", make: d => {
    const length=randInt(20,[40,70,100][difficultyScale[d]-1]), width=randInt(10,[25,45,60][difficultyScale[d]-1]), area=length*width;
    const rate=pick([3,4,5,6,7,8]), variable=area*rate/100, direction=variable > 30 ? pick([-1,1]) : 1, difference=randInt(3,Math.max(3,Math.floor(variable*0.3))), fixed=tidy(variable + direction*difference), cheaper=fixed<variable?"Clear Cut":"Green Team";
    return question(`A community group needs this rectangular field maintained. Which company is cheaper? Show enough working to support your decision.`, `${cheaper} (${money(Math.min(fixed,variable))})`, `Area = ${length} × ${width} = ${area} m². Green Team costs ${area} × ${rate}p = ${money(variable)}. Clear Cut costs ${money(fixed)}. Therefore ${cheaper} is cheaper.`, {
      marks: 5, responseSize: "large",
      visual: `<div class="comparison-layout"><div class="diagram-card"><strong>Field</strong><span>${length} m × ${width} m</span></div><div class="quote-card"><strong>Clear Cut</strong><span>Fixed price ${money(fixed)}</span></div><div class="quote-card"><strong>Green Team</strong><span>${rate}p per square metre</span></div></div>`
    });
  }},
  journeyFormula: { group: "Time", label: "Formula and journey time", make: d => {
    const distance=randInt(4,[10,20,35][difficultyScale[d]-1])*10, speed=pick([30,40,50,60]), stops=randInt(1,4), stopMinutes=pick([10,15,20]), travelMinutes=distance/speed*60, startH=randInt(7,12), total=startH*60+travelMinutes+stops*stopMinutes, endH=Math.floor(total/60), endM=total%60;
    const startTime = formatClock(startH * 60), finishTime = formatClock(total);
    return question(`A delivery driver travels ${distance} miles at an average speed of ${speed} mph and makes ${stops} stops of ${stopMinutes} minutes each. The driver leaves at ${startTime}. What time will the driver finish?`, finishTime, `Travel time = ${distance} ÷ ${speed} = ${distance/speed} hours (${travelMinutes} minutes). Stops take ${stops} × ${stopMinutes} = ${stops*stopMinutes} minutes. Total time = ${travelMinutes+stops*stopMinutes} minutes, so the finish time is ${finishTime}.`, {
      marks: 5, responseSize: "large", visual: `<div class="formula-box"><strong>Use the formula</strong><span>time = distance ÷ average speed</span></div>`
    });
  }},
  cookingFormula: { group: "Time", label: "Cooking formula time", make: d => {
    const people = randInt(6, [12, 20, 30][difficultyScale[d]-1]);
    const gramsEach = pick([100, 125, 150, 175, 200]);
    const weightKg = tidy(people * gramsEach / 1000);
    const cookingMinutes = weightKg * 40 + 15;
    const readyTime = formatClock(randInt(12, 18) * 60);
    const readyMinutes = parseInt(readyTime.split(":")[0], 10) % 12 * 60 + (readyTime.endsWith("pm") ? 12 * 60 : 0);
    const startTime = formatClock(readyMinutes - cookingMinutes);
    return question(`${pick(contextNames)} is cooking for ${people} people. Each person will have ${gramsEach}g of meat. Use the formula to work out the cooking time, then find the start time if the food needs to be ready at ${readyTime}.`, `${cookingMinutes} minutes; start at ${startTime}`, `Total weight = ${people} × ${gramsEach}g = ${people*gramsEach}g = ${weightKg}kg. Cooking time = ${weightKg} × 40 + 15 = ${cookingMinutes} minutes. Count back ${cookingMinutes} minutes from ${readyTime}: ${startTime}.`, {
      marks: 5,
      responseSize: "large",
      visual: `<div class="formula-box"><strong>Use the formula</strong><span>cooking time in minutes = weight in kg × 40 + 15</span></div>`,
      parts: ["Calculate the cooking time.", "What time should cooking start?"]
    });
  }},
  probabilityParts: { group: "Probability", label: "Probability with explanation", make: () => {
    const mostLikely=randInt(1,5), otherValues=[1,2,3,4,5].filter(value=>value!==mostLikely), extras=[...otherValues].sort(()=>Math.random()-0.5).slice(0,2), values=[mostLikely,mostLikely,mostLikely,mostLikely,...otherValues,...extras].sort(()=>Math.random()-0.5), target=pick(values), count=values.filter(v=>v===target).length;
    return question(`A spinner has ten equal sections labelled as shown. Answer both questions.`, `${simplify(count,10)}; ${mostLikely}`, `The number ${target} appears ${count} times out of 10, so its probability is ${simplify(count,10)}. The number ${mostLikely} appears most often, so it has the highest probability.`, {
      marks: 4, responseSize: "large", visual: spinnerVisual(values),
      parts: [`a) What is the probability of landing on ${target}? Give your answer as a fraction in its simplest form.`, `b) Which number has the highest probability? Explain your answer.`],
      quality: { uniqueHighest: true, counts: [1,2,3,4,5].map(value => values.filter(item => item === value).length) }
    });
  }},
  proportionReliability: { group: "Ratio & proportion", label: "Proportion and reliability", make: d => {
    const knownDistance=pick([4,5,6]), minutesPerMile=randInt(6,10), knownMinutes=knownDistance*minutesPerMile, multiplier=pick({Easy:[2],Medium:[2,3],Hard:[3,4,5]}[d]), target=knownDistance*multiplier, estimate=knownMinutes*multiplier;
    return question(`${pick(contextNames)} takes ${knownMinutes} minutes to travel ${knownDistance} miles by bicycle. Estimate how long it will take to travel ${target} miles. Give one reason why the estimate may be unreliable.`, `${estimate} minutes; speed may change`, `${knownMinutes} ÷ ${knownDistance} = ${knownMinutes/knownDistance} minutes per mile. ${knownMinutes/knownDistance} × ${target} = ${estimate} minutes. The estimate assumes the same speed throughout, but traffic, hills or tiredness could change the speed.`, {
      marks: 4, responseSize: "large", parts: [`a) Calculate the estimated time.`, `b) Give one reason why this estimate may be unreliable.`],
      quality: { exactScale: true, start: knownDistance, target }
    });
  }}
};

const noCalculatorKeys = new Set([
  "addition", "subtraction", "multiplication", "division", "negatives", "rounding", "orderOperations", "wordToFigures",
  "simplifyFractions", "fractionAmount", "compareFractions", "orderDecimals", "percentages",
  "simplifyRatio", "sharingRatio", "subscriptionCompare", "simpleInterest", "time", "cookingFormula", "conversions", "perimeter", "area", "angles",
  "averages", "probability", "probabilityScale", "fractionConversionTable", "salesTable", "reviewSummaryTable", "meanRangeCompare", "probabilityParts"
]);
const calculatorKeys = new Set([
  "decimalCalculations", "increase", "discounts", "shopping", "budgets", "bestBuys", "profit", "sharedBillCheck",
  "volume", "mixedWeights", "compareServices", "journeyFormula", "proportionReliability"
]);
const variedFormatKeys = ["fractionConversionTable", "salesTable", "reviewSummaryTable", "meanRangeCompare", "mixedWeights", "compareServices", "subscriptionCompare", "sharedBillCheck", "simpleInterest", "journeyFormula", "cookingFormula", "probabilityParts", "probabilityScale", "proportionReliability", "orderOperations", "wordToFigures"];
const groupMixedPrefix = "mixed-group:";

const state = { questions: [], topicKey: "mixed", difficulty: "Medium", calculatorMode: "Mixed", view: "worksheet" };
const els = {
  form: document.querySelector("#generator-form"), topic: document.querySelector("#topic"),
  count: document.querySelector("#question-count"), countOutput: document.querySelector("#question-count-output"),
  paper: document.querySelector("#paper-preview"), includeAnswers: document.querySelector("#include-answers"),
  detail: document.querySelector("#ready-detail"), printAnswers: document.querySelector("#print-answers"),
  calculatorModes: document.querySelectorAll("input[name=calculator-mode]")
};

function topicSupports(key, mode) {
  if (mode === "Mixed") return true;
  if (mode === "No calculator") return noCalculatorKeys.has(key);
  return true;
}

function isGroupMixedKey(key) {
  return key.startsWith(groupMixedPrefix);
}

function groupFromMixedKey(key) {
  return key.slice(groupMixedPrefix.length);
}

function optionSupports(value, mode) {
  if (value === "mixed") return true;
  if (isGroupMixedKey(value)) {
    const group = groupFromMixedKey(value);
    return Object.keys(topics).some(key => topics[key].group === group && topicSupports(key, mode));
  }
  return topicSupports(value, mode);
}

function effectiveDifficulty(difficulty, calculatorMode) {
  if (calculatorMode === "No calculator" && difficulty === "Hard") return "Medium";
  return difficulty;
}

function calculatorForQuestion(key, requestedMode, index = 0) {
  if (requestedMode !== "Mixed") return requestedMode;
  if (noCalculatorKeys.has(key) && !calculatorKeys.has(key)) return "No calculator";
  if (calculatorKeys.has(key) && !noCalculatorKeys.has(key)) return "Calculator";
  return index % 2 ? "Calculator" : "No calculator";
}

function makeQuestion(key, index = 0) {
  const calculatorMode = calculatorForQuestion(key, state.calculatorMode, index);
  return validateQuestion({
    ...topics[key].make(effectiveDifficulty(state.difficulty, calculatorMode), index),
    topicLabel: topics[key].label,
    calculatorMode
  });
}

function validateQuestionSequence(items) {
  items.forEach((item, index) => {
    if (index > 0 && item.styleId && item.styleId === items[index - 1].styleId) {
      throw new Error("Adjacent questions must not use the same question style.");
    }
  });
}

function fillTopics() {
  const groups = {};
  Object.entries(topics).forEach(([key, item]) => (groups[item.group] ||= []).push([key, item]));
  const mixedGroup = document.createElement("optgroup");
  mixedGroup.label = "Mixed practice";
  mixedGroup.append(new Option("Mixed topics", "mixed"));
  els.topic.append(mixedGroup);
  Object.entries(groups).forEach(([group, items]) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group;
    optgroup.append(new Option("Mixed topics", `${groupMixedPrefix}${group}`));
    items.forEach(([key, item]) => optgroup.append(new Option(item.label, key)));
    els.topic.append(optgroup);
  });
  els.topic.value = state.topicKey;
  document.querySelector("#template-count").textContent = `${Object.keys(topics).length}+`;
}

function updateTopicAvailability() {
  const mode = document.querySelector("input[name=calculator-mode]:checked").value;
  [...els.topic.options].forEach(option => {
    option.disabled = !optionSupports(option.value, mode);
  });
  if (els.topic.selectedOptions[0]?.disabled) els.topic.value = "mixed";
}

function generate() {
  state.topicKey = els.topic.value;
  state.difficulty = document.querySelector("input[name=difficulty]:checked").value;
  state.calculatorMode = document.querySelector("input[name=calculator-mode]:checked").value;
  const total = Number(els.count.value);
  if (state.topicKey === "mixed" || isGroupMixedKey(state.topicKey)) {
    const selectedGroup = isGroupMixedKey(state.topicKey) ? groupFromMixedKey(state.topicKey) : null;
    const belongsToSelectedGroup = key => !selectedGroup || topics[key].group === selectedGroup;
    const eligibleVariedKeys = variedFormatKeys.filter(key => belongsToSelectedGroup(key) && topicSupports(key, state.calculatorMode));
    const variedFormatStart = eligibleVariedKeys.length ? randInt(0, eligibleVariedKeys.length - 1) : 0;
    const topicKeys = Object.keys(topics).filter(key => belongsToSelectedGroup(key) && !variedFormatKeys.includes(key) && topicSupports(key, state.calculatorMode));
    const groupBuckets = Object.entries(topicKeys.reduce((groups, key) => {
      (groups[topics[key].group] ||= []).push(key);
      return groups;
    }, {}));
    state.questions = Array.from({ length: total }, (_, index) => {
      const useVariedFormat = index % 3 === 2 && eligibleVariedKeys.length;
      const [, keys] = groupBuckets[index % groupBuckets.length];
      const key = useVariedFormat ? eligibleVariedKeys[(variedFormatStart + Math.floor(index / 3)) % eligibleVariedKeys.length] : pick(keys);
      return makeQuestion(key, index);
    });
    state.questions.sort(() => Math.random() - 0.5);
  } else {
    state.questions = Array.from({ length: total }, (_, index) => makeQuestion(state.topicKey, index));
  }
  validateQuestionSequence(state.questions);
  state.view = "worksheet";
  document.querySelectorAll(".view-tabs button").forEach(button => button.classList.toggle("active", button.dataset.view === state.view));
  render();
}

function sheetHeader(answerSheet = false) {
  const topic = state.topicKey === "mixed" ? "Mixed topics" : isGroupMixedKey(state.topicKey) ? `Mixed ${groupFromMixedKey(state.topicKey)} topics` : topics[state.topicKey].label;
  const totalMarks = state.questions.reduce((sum, item) => sum + item.marks, 0);
  return `<div class="sheet-topline"><span class="sheet-brand">MathsMint</span><span class="sheet-level">Functional Skills · Level 1</span></div>
    <h1 class="sheet-title">${answerSheet ? "Answer sheet" : (state.topicKey === "mixed" || isGroupMixedKey(state.topicKey)) ? "Level 1 practice paper" : topic}</h1>
    <p class="sheet-subtitle">${topic} · ${state.difficulty} · ${state.calculatorMode} · ${state.questions.length} questions · ${totalMarks} marks</p>
    ${answerSheet ? "" : `<div class="student-details"><span>Name:</span><span>Date:</span></div><p class="sheet-instructions"><strong>${state.calculatorMode === "No calculator" ? "Do not use a calculator." : state.calculatorMode === "Calculator" ? "A calculator may be used." : "Check each question to see whether a calculator may be used."}</strong> Show your working in the space provided and remember to include units where needed.</p>`}`;
}

function questionBody(q) {
  return `${q.visual ? formatText(q.visual) : ""}${q.parts ? `<div class="question-parts">${q.parts.map(part => `<p>${formatText(part)}</p>`).join("")}</div>` : ""}`;
}

function answerLines(q) {
  if (!q.parts?.length) return `<div class="answer-line">Answer</div>`;
  return `<div class="part-answer-lines">${q.parts.map((_, index) => `<div class="answer-line">Answer ${String.fromCharCode(97 + index)})</div>`).join("")}</div>`;
}

function render() {
  const answers = state.view === "answers";
  els.paper.innerHTML = sheetHeader(answers) + (answers
    ? state.questions.map((q, i) => `<section class="answer-card"><div class="answer-heading"><span class="question-number">${i + 1}</span><div><span class="question-topic">${q.topicLabel}</span><h4>${formatText(q.text)}</h4></div><div class="question-meta"><span class="calculator-tag ${q.calculatorMode === "No calculator" ? "no-calculator" : ""}">${q.calculatorMode}</span><span class="marks">${q.marks} marks</span></div></div>${questionBody(q)}<p class="answer"><strong>Answer</strong>${formatText(q.answer)}</p><p class="solution"><strong>How to work it out</strong>${formatText(q.solution)}</p></section>`).join("")
    : state.questions.map((q, i) => `<section class="question"><div class="question-row"><span class="question-number">${i + 1}</span><div><span class="question-topic">${q.topicLabel}</span><p>${formatText(q.text)}</p></div><div class="question-meta"><span class="calculator-tag ${q.calculatorMode === "No calculator" ? "no-calculator" : ""}">${q.calculatorMode}</span><span class="marks">${q.marks} marks</span></div></div>${questionBody(q)}<div class="working-area ${q.responseSize}"><span>Show your working and answer</span><div class="working-lines"></div>${answerLines(q)}</div></section>`).join(""));
  els.detail.textContent = `${state.questions.length} questions · ${state.questions.reduce((sum, item) => sum + item.marks, 0)} marks · ${state.calculatorMode} · ${state.difficulty}`;
  els.printAnswers.hidden = !els.includeAnswers.checked;
}

function printSheet(type) {
  const original = state.view;
  state.view = type;
  render();
  setTimeout(() => { window.print(); state.view = original; render(); }, 100);
}

els.form.addEventListener("submit", event => { event.preventDefault(); generate(); });
els.count.addEventListener("input", () => els.countOutput.value = els.count.value);
els.includeAnswers.addEventListener("change", render);
els.calculatorModes.forEach(input => input.addEventListener("change", updateTopicAvailability));
document.querySelectorAll(".view-tabs button").forEach(button => button.addEventListener("click", () => {
  state.view = button.dataset.view;
  document.querySelectorAll(".view-tabs button").forEach(b => b.classList.toggle("active", b === button));
  render();
}));
document.querySelector("#print-worksheet").addEventListener("click", () => printSheet("worksheet"));
els.printAnswers.addEventListener("click", () => printSheet("answers"));

fillTopics();
updateTopicAvailability();
generate();
