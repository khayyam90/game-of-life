enum StopStartButtonEnum {
    STOP = 1,
    START = 2
}

export class StopStartButton{
    private node: any;
    private span: any;
    private state: StopStartButtonEnum;

    constructor(id: string, state = StopStartButtonEnum.STOP){
        this.node = document.getElementById(id);
        this.span = this.node.getElementsByTagName("span")[0];

        this.setState(state);

        this.node.addEventListener("click", function(){
            if (this.state == StopStartButtonEnum.STOP){
                this.setState(StopStartButtonEnum.START);
                if (this.onStopCallback){
                    this.onStopCallback();
                }
            }else{
                this.setState(StopStartButtonEnum.STOP);
                if (this.onStartCallback){
                    this.onStartCallback();
                }
            }
        }.bind(this), false);
    }

    public setState(state: StopStartButtonEnum){
        this.state = state;
        switch(state){
            case StopStartButtonEnum.START:
                this.span.className = "glyphicon glyphicon-play";
                break;
            case StopStartButtonEnum.STOP:
                this.span.className = "glyphicon glyphicon-pause";
                break;
        }
    }

    private onStartCallback: any = null;
    public onStart(f: any){
        this.onStartCallback = f;
    }

    private onStopCallback: any = null;
    public onStop(f: any){
        this.onStopCallback = f;
    }
}