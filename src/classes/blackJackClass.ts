    type typeCardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A'
    type typeCardSuit = 'D' | 'H' | 'S' | 'C'

export interface iCard {
        cardValue:typeCardValue,
        cardSuit:typeCardSuit
    }
    
export class Player {

    public cardValues:typeCardValue[] = [2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,10 ,'J','Q','K','A'];
    public cardSuits:typeCardSuit[] = ['D', 'H', 'S', 'C'];
    
    public getCard(handToAdd:iCard[], otherHand:iCard[]):iCard[] {
        const cardsInGame:iCard[] = [...handToAdd, ...otherHand];

        let card:iCard = {
            cardValue:this.cardValues[Math.floor(Math.random() * this.cardValues.length)],
            cardSuit:this.cardSuits[Math.floor(Math.random() * this.cardSuits.length)],
        };
        
        while (cardsInGame.some(existing => existing.cardValue === card.cardValue && existing.cardSuit === card.cardSuit)) {
            card = {
                cardValue:this.cardValues[Math.floor(Math.random() * this.cardValues.length)],
                cardSuit:this.cardSuits[Math.floor(Math.random() * this.cardSuits.length)],
            };
        }
        
        handToAdd.push(card);

        return handToAdd;   
    }

    public getSumOfHand(hand:iCard[]):number {
        const cardValues:number[] = hand.map((card) => {
            if (card.cardValue === 'A') {
                return 11;
            }
            if (card.cardValue === 'J' || card.cardValue === 'Q' || card.cardValue === 'K') {
                return 10;
            }
            return card.cardValue;
        });

        let sumHand = cardValues.reduce((acc, current) => acc + current, 0);
        let aceIndex:number;

        while (sumHand > 21 && (aceIndex = cardValues.indexOf(11)) >= 0) {
            cardValues[aceIndex] = 1;
            sumHand -= 10;
        }

        return sumHand;
    }
}
            
            
            
            
            
            
            
            
            
            
            
            
            

    
        