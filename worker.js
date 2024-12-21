//variables goblales del tiempo
let hours = 0, minutes = 0, seconds = 0;

//Clase de Temporizadores
class Timer{
    constructor(asociatedTime){
        this.asociatedTime = asociatedTime;
    }

    reasing(){
        this.hours = parseInt(this.asociatedTime[0]);
        this.minutes = parseInt(this.asociatedTime[1]);
        this.seconds = parseInt(this.asociatedTime[2]);
    }
}
//temporizadores
var focusTime;
var restTime;

//Temporizador en uso
var mainTimer;
var mainTimerID = 0;

//Verifica si el temporizador se ha iniciado
let reseted = true;

//Verifica el estado del timer
let stopped = true;

//Intervalo
let countEverySeconds;

//Cuenta cuando pasa cada segundo
function CountTime(){
    seconds--;
    if(hours == 0 && minutes == 0 && seconds <= 0) {
        seconds = 0;
        minutes = 0;
        hours = 0;
        RestartGlobalTime();
        CambiarTimer();
        postMessage({command: "play song"});
        reseted = true;
    }
    if(seconds < 0) {
        minutes--;
        seconds += 60;
    }
    if(minutes < 0) {
        hours--;
        minutes += 60;
    }
    UpdateDOM();
}

//---Funciones del tiempo----
function IniciarTimer(){
    if(reseted == true){
        focusTime.reasing();
        restTime.reasing();
    
        RestartGlobalTime();
        UpdateDOM();
        
        reseted = false;
        stopped = false;
    }
    if(countEverySeconds == null) {
        countEverySeconds = setInterval(CountTime, 1000);
    }
    else{
        clearInterval(countEverySeconds);
        countEverySeconds = setInterval(CountTime, 1000)
    }
}

function PausarTimer(){
    if(countEverySeconds != null) {
        clearInterval(countEverySeconds);
        countEverySeconds = null;
        stopped = true;
    }
}

function ReiniciarTimer(autoStop){
    focusTime.reasing();
    restTime.reasing();
    
    RestartGlobalTime();
    
    if(autoStop) {
        reseted = true;
        PausarTimer();
    }
    
    postMessage({command: "reasing time"});

    UpdateDOM();
}

function CambiarTimer(){
    CambiarTimeModeTittle();

    if(mainTimerID == 0) {
        mainTimer = restTime;
        mainTimerID = 1;
    }
    else if(mainTimerID == 1) {
        mainTimer = focusTime;
        mainTimerID = 0;
    }

    RestartGlobalTime();
    UpdateDOM();
    ReiniciarTimer(false);
}

function CambiarTimeModeTittle(){
    let text;
    let color;
    if(mainTimerID == 0) {
        text = "Descanso"
        color = "var(--green-neon)"
    }
    else if(mainTimerID == 1) {
        text = "Consentración"
        color = "var(--pink-neon)"
    }

    postMessage({command: "chage time mode tittle", text: text, color: color})
}

function RestartGlobalTime(){
    hours = mainTimer.hours;
    minutes = mainTimer.minutes;
    seconds = mainTimer.seconds;
    UpdateDOM();
}

//Actualiza los datos del dom
function UpdateDOM(){
    postMessage({command: "update", hours: hours, minutes: minutes, seconds: seconds});
}

//Llamadas del worker
onmessage = function(e){
    //al iniciar el programa
    if(e.data.command == "start program"){
        //Declarando remporizadores
        focusTime = new Timer(e.data.focusTimeValues)
        focusTime.reasing();

        restTime = new Timer(e.data.restTimeValues)
        restTime.reasing();

        mainTimer = focusTime;
    }

    if(e.data.command == "start"){
        IniciarTimer();
    }

    if(e.data.command == "pause"){
        PausarTimer();
    }

    if(e.data.command == "restart"){
        ReiniciarTimer(true);
    }

    if(e.data.command == "change"){
        CambiarTimer();
    }

    if(e.data.command == "reasing time"){
        if(reseted) {
            focusTime.asociatedTime = e.data.focusTimeValues;
            restTime.asociatedTime = e.data.restTimeValues;
            focusTime.reasing();
            restTime.reasing();

            if(mainTimerID == 0) mainTimer = focusTime;
            else if(mainTimerID == 1) mainTimer = restTime;
            RestartGlobalTime();
        }
    }
}