    export class Player {
    
    public getCard(cardDeck:string[], hand:string[]):void {
        let index_card = Math.floor(Math.random() * cardDeck.length)
        hand.push(cardDeck[index_card])
        cardDeck.splice(index_card, 1)
    }

    public getSumOfHand(hand:string[]):number {
        let handSum:number = 0
        let firstLetters:string[] = hand.map(card => card[0]);
        for (let i=0;i<firstLetters.length;i++) {
            let element = Number(firstLetters[i])
            if (!isNaN(element)) {
                handSum += element
                if (element == 1) {
                    handSum +=9
                }
            } else {
                if (firstLetters[i] == 'A') {
                    handSum += 11
                } else {
                    handSum += 10
                }
            }
        }
        return handSum
    }
}


