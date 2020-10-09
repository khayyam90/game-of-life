import { Point } from "./Point";
import { FrameRateCalculator } from "./FrameRateCalculator";

export class Renderer {	
    private div: any;
    private canvas: any;
    private ctx: any;
    private canvasData: any;
    private frameRate: FrameRateCalculator;
    private pointSize: number;
    private gridSize: number;

    private playingWidth: number;
    private playingHeight: number;

    private previousLivingPoints: Map<string, Point>;

    constructor(div: any, canvas: any, taillePoint: number, tailleGrille: number){
        this.div = div;
        this.canvas = canvas;
        this.pointSize = taillePoint;
        this.gridSize = tailleGrille;
        this.frameRate = new FrameRateCalculator();
        this.previousLivingPoints = new Map<string, Point>();
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
        for (let i = 0; i<= this.pointSize-1; i++){
            for (let j = 0; j<= this.pointSize-1; j++){
                this.setPixelValue( (this.gridSize + this.pointSize)*point.x + i, (this.gridSize + this.pointSize)*point.y + j, color);
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

    public drawLivingPoints(livingPoints: Map<string, Point>){
        this.canvasData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        livingPoints.forEach(function (value: Point){            
            this.setPointValue(value, {r: 0, g: 0, b: 0, a: 255});
            this.previousLivingPoints.delete(value.getHashKey());
        }.bind(this));

        // the points not more living are set to white
        this.previousLivingPoints.forEach(function(value: Point){
            this.setPointValue(value, {r: 255, g: 255, b: 255, a: 0});
        }.bind(this));

        this.previousLivingPoints = livingPoints;

        this.flushToCanvas();
        let fps = this.frameRate.hit();        
        
        if (livingPoints.size == 0){
            this.div.textContent = "No more living cell";
        }else  if (livingPoints.size == 0){
            this.div.textContent = "1 living cell";
        }else{
            this.div.textContent = livingPoints.size + " living cells";
        }

        this.div.textContent = livingPoints.size + " cells (" + fps + " FPS)";
    }

    private flushToCanvas(){
        this.ctx.putImageData(this.canvasData, 0, 0);
    }

    public addClickHandler(f: any){
        this.canvas.addEventListener("click", function(event: any){
            let elemRect = this.canvas.getBoundingClientRect();

            let x = event.clientX - elemRect.left;
            let y = event.clientY - elemRect.top;

            x = Math.floor(x/ (this.gridSize + this.pointSize));
            y = Math.floor(y/ (this.gridSize + this.pointSize));
            
            f(new Point(x, y));
        }.bind(this), false);
    }

    private drawGrille(){
        let color = {r: 196, g: 196, b: 196, a: 255};

        for(let i = this.pointSize; i < this.canvas.width; i += (this.gridSize + this.pointSize)){
            for (let j = 0; j<this.canvas.height; j++){
                this.setPixelValue(i,j, color);
            }            
        }

        for(let i = this.pointSize; i < this.canvas.height; i += (this.gridSize + this.pointSize)){
            for (let j = 0; j<this.canvas.width; j++){
                this.setPixelValue(j,i, color);
            }            
        }
    }
}