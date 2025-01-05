function parseMana(str) {
    return str.split(/\s*({\w*})\s*/g).filter(Boolean);
}
let cardList = [];

async function afficherToutesLesCartes() {
    let url = "https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints";
    let hasMore = true;
    let template = document.querySelector("#card-template");

    symbolList = await getSymbols(); // le await est important ici

    while (hasMore) {
        let response = await fetch(url);
        let data = await response.json();

        for (card of data.data) {
            let clone = document.importNode(template.content, true);

            let newContent = clone.firstElementChild.innerHTML		
            .replace(/{{texte}}/g, card.printed_name)	

            clone.firstElementChild.innerHTML = newContent;	

            mana = parseMana(card.mana_cost);

            for (symbol of mana) {
                let img = document.createElement("img"); // let important ici
                img.classList.add("mana");
                img.src = symbolList[symbol];
                clone.querySelector(".mana-img").appendChild(img) // j'ai rajouté une div mana-img pour pouvoir bien positionner les éléments de mana
            }

            clone.querySelector(".card-img").src = card.image_uris.normal;
            document.getElementById("grid-container").appendChild(clone);

            cardList.push(card.printed_name); // Ajoute les cartes à une liste pour vérifier le nombre de cartes
        };

        hasMore = data.has_more;
        url = data.next_page;
    }
    console.log(cardList.length); // vérifier le nombre de cartes
}

async function getSymbols() {
    let url = "https://api.scryfall.com/symbology";
    let dico = {};

    let response = await fetch(url);
    let data = await response.json();

    for (card_symbol of data.data) {
        dico[card_symbol.symbol] = card_symbol.svg_uri;
    }
    return dico;
}

afficherToutesLesCartes();