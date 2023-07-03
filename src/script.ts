let dealerSum: number = 0;
let yourSum: number = 0;

let dealerAceCount: number = 0;
let yourAceCount: number = 0;

let hidden: string | undefined;
let deck: string[];

let canHit: boolean = true;

interface Elements {
	dealerCards: HTMLDivElement;
	yourCards: HTMLDivElement;
	hitBtn: HTMLButtonElement;
	stayBtn: HTMLButtonElement;
	hiddenCard: HTMLImageElement;
	resultsText: HTMLParagraphElement;
	dealerSumText: HTMLSpanElement;
	yourSumText: HTMLSpanElement;
}

window.addEventListener("load", () => {

  console.clear();

	const dealerCards = document.querySelector("#dealer-cards");
	const yourCards = document.querySelector("#your-cards");
	const hitBtn = document.querySelector("#hit");
	const stayBtn = document.querySelector("#stay");
	const hiddenCard = document.querySelector("#hidden");
	const resultsText = document.querySelector("#results");
	const dealerSumText = document.querySelector("#dealer-sum");
	const yourSumText = document.querySelector("#your-sum");

	if (
		!dealerCards ||
		!yourCards ||
		!hitBtn ||
		!stayBtn ||
		!hiddenCard ||
		!resultsText ||
		!dealerSumText ||
		!yourSumText
	) {
		console.error(
			"One or more of the required ui elements is currenly undefined!"
		);
		return;
	}

	buildDeck();
	shuffleDeck();
	startGame({
		dealerCards,
		yourCards,
		hitBtn,
		stayBtn,
		hiddenCard,
		resultsText,
		dealerSumText,
		yourSumText,
	} as Elements);
});

function buildDeck() {
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
	deck = [];

	types.forEach((type) =>
		values.forEach((value) => deck.push(`${value}-${type}`))
	);
}

function shuffleDeck() {
	for (let i = 0; i < deck.length; i++) {
		const j = Math.floor(Math.random() * deck.length);
		const temp = deck[i];
		deck[i] = deck[j];
		deck[j] = temp;
	}
}

function startGame(elements: Elements) {
	const { dealerCards, yourCards, hitBtn, stayBtn } = elements;

	hidden = deck.pop();
	if (!hidden) return;

	dealerSum += getValue(hidden);
	dealerAceCount += checkAce(hidden);

	while (dealerSum < 17) {
		const cardImg = document.createElement("img");
		const card = deck.pop();
		cardImg.src = `/cards/${card}.png`;
		if (!card) return;
		dealerSum += getValue(card);
		dealerAceCount += checkAce(card);
		dealerCards.append(cardImg);
	}

	// console.log(dealerSum);

	for (let i = 0; i < 2; i++) {
		const cardImg = document.createElement("img");
		const card = deck.pop();
		cardImg.src = `/cards/${card}.png`;
		if (!card) return;
		yourSum += getValue(card);
		yourAceCount += checkAce(card);
		yourCards.append(cardImg);
	}

	// console.log(yourSum);

	hitBtn.addEventListener("click", () => hit(elements));
	stayBtn.addEventListener("click", () => stay(elements));
}

function hit(elements: Elements) {
	if (!canHit) return;
	const { yourCards } = elements;
	const cardImg = document.createElement("img");
	const card = deck.pop();
	cardImg.src = `/cards/${card}.png`;
	if (!card) return;
	yourSum += getValue(card);
	yourAceCount += checkAce(card);
	yourCards.append(cardImg);

	if (reduceAce(yourSum, yourAceCount) > 21) canHit = false;
}

function stay(elements: Elements) {
	const { hiddenCard, resultsText, dealerSumText, yourSumText } = elements;
	dealerSum = reduceAce(dealerSum, dealerAceCount);
	yourSum = reduceAce(yourSum, yourAceCount);

	canHit = false;
	hiddenCard.src = `/cards/${hidden}.png`;

	let message = "";
	if (yourSum > 21) message = "You lose!";
	else if (dealerSum > 21) message = "You win!";
	else if (yourSum === dealerSum) message = "Tie!";
	else if (yourSum > dealerSum) message = "You win!";
	else if (yourSum < dealerSum) message = "You lose!";
	else message = "Invalid Result!";

	dealerSumText.innerText = dealerSum.toString();
	yourSumText.innerText = yourSum.toString();
	resultsText.innerText = message;

	console.log("------- Open for debuging purposes! ------");
	console.log(`Dealer's sum: ${dealerSum}`);
	console.log(`Your sum: ${yourSum}`);
}

function getValue(card: string) {
	const data = card?.split("-");
	const value = data[0];
	if (isNaN(parseInt(value))) {
		if (value === "A") return 11;
		return 10;
	}
	return parseInt(value);
}

function checkAce(card: string) {
	if (card[0] === "A") return 1;
	return 0;
}

function reduceAce(playerSum: number, playerAceCount: number) {
	while (playerSum > 21 && playerAceCount > 0) {
		playerSum -= 10;
		playerAceCount -= 1;
	}
	return playerSum;
}
