export default class Dice{

    public throwDice():number {
        return Math.floor(Math.random() * (7 - 1) + 1)
        
    }
}