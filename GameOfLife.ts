import { Point } from "./Point";
import { Renderer } from "./Renderer";
import { RealTimeGraph } from "./RealTimeGraph";

export class GameOfLife {	
    private livingPoints : Map<string, Point>;
    private renderer: Renderer;
    private maxFps : number;
    private canContinue: boolean = true;
    private param1: number = 2;
    private param2: number = 3;
    private param3: number = 3;
    private rtGraph : RealTimeGraph;

    private isAlive(point: Point){
        return this.livingPoints.has(point.getHashKey());
    }

    private lastFrame: number;

    public redraw(){
        this.renderer.drawLivingPoints(this.livingPoints);        
    }

    private runGame(){
        if (!this.canContinue){
            return;
        }

        let newPoints = new Map<string, Point>();

        // let's find all the potential usefull cells
        let cellsToStudy = new Map<string, Point>();

        let nbLivingNeighbours = new Map<string, number>();

        this.livingPoints.forEach(function(point: Point, key: string){
            let neighbours = point.getNeighbours(this.renderer.getWidth(), this.renderer.getHeight());
            neighbours.forEach(function (v: Point){
                let k = v.getHashKey();

                if (!nbLivingNeighbours.has(k)){
                    nbLivingNeighbours.set(k, 1);
                }else{
                    let previousValue = nbLivingNeighbours.get(k);
                    nbLivingNeighbours.set(k, previousValue+1);
                    if ( previousValue+1 >= 2){
                        cellsToStudy.set(k, v);
                    }
                }                
            }.bind(this));            
        }.bind(this));

        // we only keep the cells with 2+ neighbours
        
        cellsToStudy.forEach(function(value: Point){
            let key = value.getHashKey();
            let sumLivingPoints = nbLivingNeighbours.get(key);            

            // if I am alive and have enough living neighbours
            if (this.isAlive(value) && (sumLivingPoints == this.param1 || sumLivingPoints == this.param2)){
                // staying alive !
                newPoints.set(key, value);
            }else{
                // if I am dead and have enough living neighbours
                if (!this.isAlive(value) && sumLivingPoints == this.param3){
                    newPoints.set(key, value);
                }
            }
        }.bind(this));

        // at this moment, we known the cells to display in the current iteration.
        // let's draw

        this.livingPoints = newPoints;

        this.redraw();    
        this.rtGraph.addValue(newPoints.size);    

        // FPS control
        let durationBetweenTwoFrames = 1000 / this.maxFps;
        // do we need to slow down ?
        let now = Date.now();

        let pause = durationBetweenTwoFrames - (now - this.lastFrame);

        console.log("pause " + pause);
        
        if (pause < 0){
            pause = 0;
        }

        this.lastFrame = now;
        // the setTimeout is not that accurate, the FPS will not be perfectly respected. Maybe with promises ?
        setTimeout(this.runGame.bind(this), pause);       
    }    

    public stop(){
        this.canContinue = false;
    }

    public start(){
        this.canContinue = true;
        this.runGame();
    }

    public resetRandom(){
        this.livingPoints = new Map<string, Point>();   
        this.canContinue = false;  

        // at the beginning, let's fill 20% witl living cells
        let nb = Math.floor(0.2 * this.renderer.getWidth() * this.renderer.getHeight());

        // let's fill randomly
        for (let i = 0; i< nb; i++){
            let p = new Point(Math.floor(Math.random() * this.renderer.getWidth()), Math.floor(Math.random() * this.renderer.getHeight()));
            this.livingPoints.set(p.getHashKey(), p);
        }

        this.canContinue = true;
        this.redraw();
    }

    public clear(){
        this.livingPoints = new Map<string, Point>();
        this.redraw();

        for (let i = 0; i<10; i++){
            this.rtGraph.addValue(0);
        }
    }

	constructor(renderer: Renderer, maxFps: number, input1: any, input2: any, input3: any){
        this.renderer = renderer;
        this.rtGraph = new RealTimeGraph("graph");
        
        this.maxFps = maxFps;
        this.lastFrame = Date.now();

        this.livingPoints = new Map<string, Point>();   
        this.resetRandom();   

        input1.addEventListener("change", function(){
            this.param1 = input1.value;
        }.bind(this));
        input2.addEventListener("change", function(){
            this.param2 = input2.value;
        }.bind(this));
        input3.addEventListener("change", function(){
            this.param3 = input3.value;
        }.bind(this));

/*
        this.renderer.addClickHandler(function(point: Point){
            this.pointsVivants.set(point.getHashKey(), point);

            if (!this.canContinue){
                this.redraw();
            }
        }.bind(this));
*/
        this.runGame();
    }
}