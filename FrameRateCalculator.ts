export class FrameRateCalculator{
    private lastInstant: number;
    private nbFrames: number;
    private lastFrameRate: number;

    constructor(){
        this.lastInstant = Date.now();
        this.nbFrames = 0;
        this.lastFrameRate = 0;
    }


    public hit(){
        // is it still the same second ?
        let now = Date.now();

        if (now - this.lastInstant > 1000){
            this.lastFrameRate = this.nbFrames;
            this.nbFrames = 0;         
            this.lastInstant = now;
            return this.lastFrameRate;
        }else{
            this.nbFrames++;

            return this.lastFrameRate;
        }
    }
}