import { Point } from "./Point";
import { Renderer } from "./Renderer";
import { RealTimeGraph } from "./RealTimeGraph";

export class GameOfLife {	
    private pointsVivants : Map<string, Point>;
    private renderer: Renderer;
    private maxFps : number;
    private canContinue: boolean = true;
    private param1: number = 2;
    private param2: number = 3;
    private param3: number = 3;
    private rtGraph : RealTimeGraph;

    private isAlive(point: Point){
        return this.pointsVivants.has(point.getHashKey());
    }

    private lastFrame: Date;

    public redraw(){
        this.renderer.drawPointsVivants(this.pointsVivants);        
    }

    private runGame(){
        if (!this.canContinue){
            return;
        }

        let nouveauxPoints = new Map<string, Point>();

        // on cherche la liste des cases potentiellement à changer
        let casesAEtudier = new Map<string, Point>();

        let nbVoisinsVivants = new Map<string, number>();

        this.pointsVivants.forEach(function(point: Point, key: string){
            let voisins = point.getNeighbours(this.renderer.getWidth(), this.renderer.getHeight());
            voisins.forEach(function (v: Point){
                let k = v.getHashKey();

                if (!nbVoisinsVivants.has(k)){
                    nbVoisinsVivants.set(k, 1);
                }else{
                    let valeurPrécédente = nbVoisinsVivants.get(k);
                    nbVoisinsVivants.set(k, valeurPrécédente+1);
                    if ( valeurPrécédente+1 >= 2){
                        casesAEtudier.set(k, v);
                    }
                }                
            }.bind(this));            
        }.bind(this));

        // on ne garde que les cases qui ont au moins 2 voisins vivants
        
        casesAEtudier.forEach(function(value: Point){
            let key = value.getHashKey();
            let sommePointsVivants = nbVoisinsVivants.get(key);            

            if (this.isAlive(value) && (sommePointsVivants == this.param1 || sommePointsVivants == this.param2)){
                // staying alive !
                nouveauxPoints.set(key, value);
            }else{
                if (!this.isAlive(value) && sommePointsVivants == this.param3){
                    nouveauxPoints.set(key, value);
                }
            }
        }.bind(this));

        this.pointsVivants = nouveauxPoints;

        this.redraw();    
        this.rtGraph.addValue(nouveauxPoints.size);    

        // contrôle du FPS
        let duréeEntreDeuxFrames = 1000 / this.maxFps;
        // est-on en retard ?
        let now = new Date();

        let nowMilliTimeStamp = 60000 * now.getMinutes() +  1000 * now.getSeconds() + now.getMilliseconds();
        let lastFrameMilliTimeStamp = 60000 * this.lastFrame.getMinutes() +  1000 * this.lastFrame.getSeconds() + this.lastFrame.getMilliseconds();

        let pause = duréeEntreDeuxFrames - (nowMilliTimeStamp - lastFrameMilliTimeStamp);
        
        if (pause < 0){
            pause = 1;
        }

        this.lastFrame = now;
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
        this.pointsVivants = new Map<string, Point>();   
        this.canContinue = false;  

        // au début on remplit 20%
        let nb = Math.floor(0.2 * this.renderer.getWidth() * this.renderer.getHeight());

        // on met des points au hasard
        for (let i = 0; i< nb; i++){
            let p = new Point(Math.floor(Math.random() * this.renderer.getWidth()), Math.floor(Math.random() * this.renderer.getHeight()));
            this.pointsVivants.set(p.getHashKey(), p);
        }

        this.canContinue = true;
        this.redraw();
    }

    public clear(){
        this.pointsVivants = new Map<string, Point>();
        this.redraw();

        for (let i = 0; i<10; i++){
            this.rtGraph.addValue(0);
        }
    }

	constructor(renderer: Renderer, maxFps: number, input1: any, input2: any, input3: any){
        this.renderer = renderer;
        this.rtGraph = new RealTimeGraph("graph");
        
        this.maxFps = maxFps;
        this.lastFrame = new Date();

        this.pointsVivants = new Map<string, Point>();   
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