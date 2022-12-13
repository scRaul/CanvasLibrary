class Timer{
    #TIC_DELAY = 20; // 10 ms updates
    #sec_left;
    #ms_left;
    #ms_init;
    #paused;
    #prev_time;
    #countUp = false;
    constructor(){
        this.#ms_init = 0;
        this.#ms_left = 0;
        this.#sec_left = 0;
        this.#paused = true;
        this.#prev_time = 0; 
    }
    setTime(hours,minutes=0,seconds=0){
        this.#checkInput(hours,minutes,seconds);
        this.#sec_left = hours * 60 * 60; 
        this.#sec_left += minutes * 60; 
        this.#sec_left += seconds; 
        this.#ms_init = this.#ms_left = this.#sec_left * 1000; 
    }
    setMsLeft(ms){ 
        if(typeof ms != 'number') return;
        this.#ms_left = parseInt(ms);
        this.#sec_left = this.#ms_left / 1000;
    }
    isPaused(){return this.#paused; }
    getMsStart(){return this.#ms_init;}
    getMsLeft(){return this.#ms_left;}
    getSecondsLeft(){return this.#sec_left;}
    setToCountUp(bCountUp=true){this.#countUp = bCountUp;}
    start(){
        this.#paused = false;
        this.#prev_time = Date.now();
        this.#tic(); 
    }
    stop(){
        this.#paused = true;
    }
    reset(){
        this.#paused = true;
        this.#ms_left = this.#ms_init;
        this.#sec_left = this.#ms_left / 1000;
    }
    async #tic(){
        var startTime = Date.now();
        var t = (this.#countUp==true) ? -1: 1;
        this.#ms_left -= t*(startTime - this.#prev_time);
        this.#sec_left = Math.ceil(this.#ms_left/1000);
        this.#prev_time = startTime;
        await new Promise(r => setTimeout(r,(startTime+this.#TIC_DELAY)-Date.now() ));
        if(this.#ms_left < 0){
            this.#sec_left = 0; 
            this.#paused = true;
            return; 
        }
        if(!this.#paused) 
            this.#tic();
    }
    #checkInput(hours,minutes,seconds){
        if(typeof minutes != 'number' || typeof seconds != 'number' || typeof hours != 'number')
            throw console.error("hours,minutes, and seconds must be a number");
        if(minutes < 0 || seconds < 0){
            throw console.error('minutes and seconds must be a positive number');
        }
        if(!Number.isInteger(hours)){
            console.log("seconds must be an Int. has been transformed");
            minutes = Math.floor(seconds);
        }
        if(!Number.isInteger(minutes)){
            console.log("minutes must be an Int. has been transformed");
            minutes = Math.floor(minutes);
        }
        if(!Number.isInteger(seconds)){
            console.log("seconds must be an Int. has been transformed");
            minutes = Math.floor(seconds);
        }
    }
}
