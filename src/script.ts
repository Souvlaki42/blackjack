let dealerSum: number = 0;
let yourSum: number = 0;

let dealerAceCount: number = 0;
let yourAceCount: number = 0;

let hidden: string | undefined;

let canHit: boolean = true;

function checkElement<T extends HTMLElement>(selector: string): T {
	const element = document.querySelector(selector);
	if (!element)
		throw new Error(
			`Element with selector ${selector} is not currenly defined in the page!`
		);
	else return element as T;
}

function buildDeck(): string[] {
	const values = [
		"A",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"J",
		"Q",
		"K",
	];
	const types = ["C", "D", "H", "S"];
	const deck: string[] = [];

	types.forEach((type) =>
		values.forEach((value) => deck.push(`${value}-${type}`))
	);
	return deck;
}

function shuffleDeck(deck: string[]): string[] {
	for (let i = 0; i < deck.length; i++) {
		const j = Math.floor(Math.random() * deck.length);
		const temp = deck[i];
		deck[i] = deck[j];
		deck[j] = temp;
	}
	return deck;
}

function reduceAce(playerSum: number, playerAceCount: number): number {
	while (playerSum > 21 && playerAceCount > 0) {
		playerSum -= 10;
		playerAceCount -= 1;
	}
	return playerSum;
}

function checkAce(card: string): boolean {
	if (card[0] === "A") return true;
	return false;
}

function getValue(card: string): number {
	const data = card?.split("-");
	const value = data[0];
	if (isNaN(Number(value))) {
		if (value === "A") return 11;
		return 10;
	}
	return Number(value);
}

function calculateAndShowSums(hidden: string, dealerSumHidden: boolean = true) {
	yourSum = reduceAce(yourSum, yourAceCount);
	dealerSum = reduceAce(
		dealerSum - (dealerSumHidden ? getValue(hidden) : 0),
		dealerAceCount - (dealerSumHidden && checkAce(hidden) ? 1 : 0)
	);
	elements.yourSumText.innerText = yourSum.toString();
	elements.dealerSumText.innerText =
		dealerSum.toString() + (dealerSumHidden ? " + Hidden" : "");
}

const elements = {
	dealerCards: checkElement<HTMLDivElement>("#dealer-cards"),
	yourCards: checkElement<HTMLDivElement>("#your-cards"),
	hitBtn: checkElement<HTMLButtonElement>("#hit"),
	stayBtn: checkElement<HTMLButtonElement>("#stay"),
	restartBtn: checkElement<HTMLButtonElement>("#restart"),
	hiddenCard: checkElement<HTMLImageElement>("#hidden"),
	resultsText: checkElement<HTMLHeadingElement>("#results"),
	dealerSumText: checkElement<HTMLSpanElement>("#dealer-sum"),
	yourSumText: checkElement<HTMLSpanElement>("#your-sum"),
};

window.addEventListener("load", startGame);

function startGame() {
	const { dealerCards, yourCards, hitBtn, stayBtn, hiddenCard } = elements;

	let deck: string[] = buildDeck();
	deck = shuffleDeck(deck);

	hidden = deck.pop();
	if (!hidden) return;

	hiddenCard.src = `/cards/B-${hidden.split("-")[1]}.png`;

	dealerSum += getValue(hidden);
	dealerAceCount += checkAce(hidden) ? 1 : 0;

	while (dealerSum < 17) {
		const cardImg = document.createElement("img");
		const card = deck.pop();
		cardImg.src = `/cards/${card}.png`;
		if (!card) return;
		dealerSum += getValue(card);
		dealerAceCount += checkAce(card) ? 1 : 0;
		dealerCards.append(cardImg);
	}

	for (let i = 0; i < 2; i++) {
		const cardImg = document.createElement("img");
		const card = deck.pop();
		cardImg.src = `/cards/${card}.png`;
		if (!card) return;
		yourSum += getValue(card);
		yourAceCount += checkAce(card) ? 1 : 0;
		yourCards.append(cardImg);
	}

	calculateAndShowSums(hidden);

	hitBtn.addEventListener("click", () => hit(deck));
	stayBtn.addEventListener("click", stay);
}

function hit(deck: string[]) {
	if (!canHit) return;
	const { yourCards } = elements;
	const cardImg = document.createElement("img");
	const card = deck.pop();
	cardImg.src = `/cards/${card}.png`;
	if (!card) return;
	yourSum += getValue(card);
	yourAceCount += checkAce(card) ? 1 : 0;
	yourCards.append(cardImg);

	calculateAndShowSums(hidden ?? "");

	if (yourSum > 21) canHit = false;
}

function stay() {
	const { hiddenCard, resultsText, restartBtn } = elements;

	restartBtn.addEventListener("click", () => location.reload());

	calculateAndShowSums(hidden ?? "", false);

	canHit = false;
	hiddenCard.src = `/cards/${hidden}.png`;

	let message = "";
	if (yourSum > 21 && yourSum != dealerSum) message = "You lose!";
	else if (dealerSum > 21 && yourSum != dealerSum) message = "You win!";
	else if (yourSum === dealerSum) message = "Tie!";
	else if (yourSum > dealerSum) message = "You win!";
	else if (yourSum < dealerSum) message = "You lose!";
	else message = "Invalid Result!";

	resultsText.innerText = message;

	console.log("------- Open for debuging purposes! ------");
	console.log(`Dealer's sum: ${dealerSum}`);
	console.log(`Your sum: ${yourSum}`);
}
