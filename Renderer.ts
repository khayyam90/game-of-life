import { Point } from "./Point";
import { FrameRateCalculator } from "./FrameRateCalculator";

export class Renderer {	
    private div: any;
    private canvas: any;
    private ctx: any;
    private canvasData: any;
    private frameRate: FrameRateCalculator;
    private taillePoint: number;
    private tailleGrille: number;

    private playingWidth: number;
    private playingHeight: number;
    private currentHighlightedPoint: Point = null;

    private previousPointsVivants: Map<string, Point>;

    constructor(div: any, canvas: any, taillePoint: number, tailleGrille: number){
        this.div = div;
        this.canvas = canvas;
        this.taillePoint = taillePoint;
        this.tailleGrille = tailleGrille;
        this.frameRate = new FrameRateCalculator();
        this.previousPointsVivants = new Map<string, Point>();
 this.ctx = canvas.getContext("2d");
        this.canvasData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
       
        this.playingHeight = canvas.height / (tailleGrille + taillePoint);
        this.playingWidth = canvas.width / (tailleGrille + taillePoint);
        
        this.drawGrille();
        this.flushToCanvas();
    }

    public getWidth(): number{
        return this.playingWidth;
    }

    public getHeight(): number{
        return this.playingHeight;
    }

    private setPointValue(point: Point, color: any){
        for (let i = 0; i<= this.taillePoint-1; i++){
            for (let j = 0; j<= this.taillePoint-1; j++){
                this.setPixelValue( (this.tailleGrille + this.taillePoint)*point.x + i, (this.tailleGrille + this.taillePoint)*point.y + j, color);
            }
        }
    }

    private setPixelValue(x: number, y: number, color: any){
        let idx = (x + y * this.canvas.width) * 4;

        this.canvasData.data[idx + 0] = color.r;
        this.canvasData.data[idx + 1] = color.g;
        this.canvasData.data[idx + 2] = color.b;
        this.canvasData.data[idx + 3] = color.a;
    }

    public drawPointsVivants(pointsVivants: Map<string, Point>){
        this.canvasData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        pointsVivants.forEach(function (value: Point){            
            this.setPointValue(value, {r: 0, g: 0, b: 0, a: 255});
            this.previousPointsVivants.delete(value.getHashKey());
        }.bind(this));

        // et pour les points qui étaient et qui ne sont plus, on les passe en blanc
        this.previousPointsVivants.forEach(function(value: Point){
            this.setPointValue(value, {r: 255, g: 255, b: 255, a: 0});
        }.bind(this));

        this.previousPointsVivants = pointsVivants;

        this.flushToCanvas();
       /* let fps = this.frameRate.hit();        
        
        this.div.textContent = pointsVivants.size + " cells (" + fps + " FPS)";*/

        if (pointsVivants.size == 0){
            this.div.textContent = "No more living cell";
        }else  if (pointsVivants.size == 0){
            this.div.textContent = "1 living cell";
        }else{
            this.div.textContent = pointsVivants.size + " living cells";
        }
    }

    private flushToCanvas(){
        this.ctx.putImageData(this.canvasData, 0, 0);
    }

    public addClickHandler(f: any){
        this.canvas.addEventListener("click", function(event: any){
            let elemRect = this.canvas.getBoundingClientRect();

            let x = event.clientX - elemRect.left;
            let y = event.clientY - elemRect.top;

            x = Math.floor(x/ (this.tailleGrille + this.taillePoint));
            y = Math.floor(y/ (this.tailleGrille + this.taillePoint));
            
            f(new Point(x, y));
        }.bind(this), false);
    }

    private drawGrille(){
        let color = {r: 196, g: 196, b: 196, a: 255};

        for(let i = this.taillePoint; i < this.canvas.width; i += (this.tailleGrille + this.taillePoint)){
            for (let j = 0; j<this.canvas.height; j++){
                this.setPixelValue(i,j, color);
            }            
        }

        for(let i = this.taillePoint; i < this.canvas.height; i += (this.tailleGrille + this.taillePoint)){
            for (let j = 0; j<this.canvas.width; j++){
                this.setPixelValue(j,i, color);
            }            
        }
    }
}