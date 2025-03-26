    type typeCardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A'
    type typeCardSuit = 'D' | 'H' | 'S' | 'C'

    export interface iCard {
        cardValue:typeCardValue,
        cardSuit:typeCardSuit
    }
    
    export class Player {

    public cardValues:typeCardValue[] = [2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,10 ,'J','Q','K','A'];
    public cardSuits:typeCardSuit[] = ['D', 'H', 'S', 'C']
    
    public getCard(handToAdd:iCard[], otherHand:iCard[]):iCard[] {
        const cardsInGame:iCard[] = [...handToAdd, ...otherHand]

        let card:iCard = {
            cardValue:this.cardValues[Math.floor(Math.random() * this.cardValues.length)],
            cardSuit:this.cardSuits[Math.floor(Math.random() * this.cardSuits.length)]
        }
        
        while (cardsInGame.some(existing => existing.cardValue === card.cardValue && existing.cardSuit === card.cardSuit)) {
            card = {
                cardValue:this.cardValues[Math.floor(Math.random() * this.cardValues.length)],
                cardSuit:this.cardSuits[Math.floor(Math.random() * this.cardSuits.length)]
            } 
        }
        
        handToAdd.push(card)
        return handToAdd
        
    }

    public getSumOfHand(hand:iCard[]):number {
        let handSum:number
        const cardValues:typeCardValue[] = hand.map((card) => card.cardValue)
        cardValues.forEach((card) => {
            if (typeof card == 'number') {
                handSum += card
            }
            if (card == 'A') {
                handSum += 11
            }
            if (card == 'J' || card == 'Q' || card == 'K') {
                handSum += 10
            }
        })
        return handSum
    }
}


