//enum barrage_state { inited, playing,end }
enum opeart { none, play, pause, seek, stop }

class _point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


class _item {
    text: string;
    color: string;
    opacity: number = 100;
    time: number;
    fontSize: number = 14;
    speed: number = 0.5;
    range: number[] = [0.5, 0.5];
    location: _point | any;
    enable: boolean = false;
    private _width: number = 0;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    public get width() { return this._width; }

    constructor(text: string, color: string, time: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

        this.text = text;
        this.color = color;
        this.time = time;
        this.canvas = canvas;
        this.context = context;

        this._width = this.context.measureText(this.text).width;
        
        this.location = new _point(this.canvas.clientWidth*this.range[0], 50);
    }

    draw():void{
        this.context.shadowColor = 'rgba(0,0,0,' + this.opacity + ')';
        this.context.shadowBlur = 2;
        this.context.font = this.fontSize + 'px "microsoft yahei", sans-serif';
        if (/rgb\(/.test(this.color)) {
            this.context.fillStyle = 'rgba(' + this.color.split('(')[1].split(')')[0] + ',' + this.opacity + ')';
        } else {
            this.context.fillStyle = this.color;
        }
        this.context.fillText(this.text,this.location.x, this.location.y);
    }

}



class barrage {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | any;
    video: HTMLVideoElement;
    private width: number = 0;
    private height: number = 0;
    data: _item[] = [];
    opeart: opeart = opeart.none;
    constructor(canves: HTMLCanvasElement, video: HTMLVideoElement) {
        let $this = this;
        this.canvas = canves;
        this.video = video;
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;

        this.video.addEventListener('play', function () { $this.play(); });
        this.video.addEventListener('pause', function () { $this.pause(); });
        this.video.addEventListener('seeked', function () { $this.seek(); });
    }


    render(): void {
        let $this = this;
        switch (this.opeart) {
            case opeart.pause:
                break;
            case opeart.play:
                let time = Math.floor($this.video.currentTime);
               
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.data.forEach((item, index, array) => {
                    if (!item.enable) {
                        item.enable = item.time == time;
                    }
                    if (item.enable) {
                        var x = item.location.x - item.speed;
                        if (x + item.width > 0) {
                            item.location.x = x;
                            item.draw();
                        } else {
                            item.enable = false;
                        }
                    }
                });
               
                break;
            case opeart.seek:
                this.clear();
                break;
            case opeart.stop:
                //this.clear();
                break;
        }
        requestAnimationFrame(function () { $this.render(); });

    }

    reset(): void {
        this.data.forEach((item, index, array) => {
            item.enable = false;
        });
    }

    clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public getVideoTime():number{
        return Math.floor(this.video.currentTime);
    }

    public add(text: string, color: string, time: number): void {
        this.data.push(new _item(text, color, time, this.canvas, this.context))
    }

    public draw():void{
        let $this=this;
        $this.clear();
        $this.data.forEach((item,index,array)=>{
            item.location.x = item.location.x-item.speed;
            if(item.location.x+item.width<0){
                item.location.x= $this.width*item.range[0];
                //item.enable=false;
            }
            $this.context.fillText(item.text, item.location.x, item.location.y);
        });
        requestAnimationFrame(function () { $this.draw(); });
    }

    public play(): void {
        this.opeart=opeart.play;
        this.render();
    }

    public pause(): void {
        this.opeart = opeart.pause;
    }

    public seek(): void {
        //set all barrage item enable=false
        this.opeart = opeart.seek;
        this.reset();
        let time = Math.floor(this.video.currentTime);

        this.data.forEach((item, index, array) => {
            item.enable = item.time == time;
        });
    }


}

// let canvas = document.getElementById('canvas') as HTMLCanvasElement;
// let video = document.getElementById('video') as HTMLVideoElement;
// canvas.style.width = video.style.width;
// canvas.style.height = video.style.height;
// let obj = new barrage(canvas, video);
// for (let index = 5; index < 50; index++) {
//     obj.add('hello word' + index, '#E20000', index);
// }

