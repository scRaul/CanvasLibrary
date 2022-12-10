//Timer object meant to countdown from a set time 
// can also be set to count up by calling Timer.CountUp(true)
// timer.setTime( hrs,min,sec) sets a time to countdown from 
//

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
    }//set MS left 
    setMsLeft(ms){ 
        if(typeof ms != 'number') return;
        this.#ms_left = parseInt(ms);
        this.#sec_left = this.#ms_left / 1000;
    }
    getMsStart(){return this.#ms_init;}//get time the timer started / initial time set 
    getMsLeft(){return this.#ms_left;}// get the time in ms that have passed since started not inlcluding paused
    getSecondsLeft(){return this.#sec_left;}//get time in sec since start 
    setToCountUp(bCountUp=true){this.#countUp = bCountUp;} // set to count up
    start(){
        this.#paused = false;
        this.#prev_time = Date.now();
        if(this.#countUp) this.#ms_init = this.#prev_time;
        this.#tic(); 
    }
    stop(){ // pause the timer 
        this.#paused = true;
    }
    reset(){ // reset the timer ,, will also pause it
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
        if(this.#ms_left <= 0){
            this.#sec_left = 0; 
            this.#paused = true;
            return; 
        }
        if(!this.#paused) this.#tic();
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