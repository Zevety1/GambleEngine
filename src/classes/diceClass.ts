export default class Dice{

    public throwDice():number {
        return Math.floor(Math.random() * 6 + 1); 
    }
}