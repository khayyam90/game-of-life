/**
 * Basic class to manage the evolution of the population. 
 * On each iteration, the graph gets a new value and it displays the last values
 */

export class RealTimeGraph{    
    private values = new Array<number>();
    private maxValuesToDisplay: number;    
    private maximum: number = 0;
    private ctx: any;
    private canvas: any;

    constructor(id: string){
        this.canvas = document.getElementById(id);
        this.maxValuesToDisplay = this.canvas.width;
        this.ctx = this.canvas.getContext("2d");
    }

    public display(){        
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 

        let posX = 0;
        let step = Math.floor(this.canvas.width / this.values.length);

        this.ctx.fillStyle = "gray";

        this.values.forEach(function(value: number){
            // let's draw a rectangle
            let height = Math.floor(100 * value / this.maximum);

            this.ctx.fillRect(posX, this.canvas.height - height, step, height); 
            posX += step;
        }.bind(this));
    }    

    public addValue(value: number){  
        if (value > this.maximum){
            this.maximum = value;
        }
        
        this.values.push(value);
        if (this.values.length > this.maxValuesToDisplay){
            this.values.shift();
        }
        this.display();
    }

}