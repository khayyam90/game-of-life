export class FrameRateCalculator{
    private lastInstant: number;
    private nbFrames: number;
    private lastFrameRate: number;

    constructor(){
        this.lastInstant = (new Date()).getMilliseconds();
        this.nbFrames = 0;
        this.lastFrameRate = 0;
    }


    public hit(){
        // est-ce encore la même seconde ?
        let now = (new Date()).getMilliseconds();

        if (now < this.lastInstant){
            this.lastFrameRate = this.nbFrames;
            this.nbFrames = 0;         
        }

        this.lastInstant = now;

        this.nbFrames++;

        return this.lastFrameRate;
    }
}