export class Point {	
    public x: number;
    public y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public getNeighbours(width: number, height: number){
        let result = [];
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                if (i == 0 && j == 0){
                    continue;
                }

                if (this.x + i >= 0 && this.x + i < width && this.y + j >= 0 && this.y + j < height){
                    result.push(new Point(this.x + i, this.y + j));                    
                }
            }
        }

        return result;
    }

    public getHashKey(): string{
        return "x" + this.x + "y" + this.y;
    }
}