//variables goblales del tiempo
let hours = 0, minutes = 0, seconds = 0;

//Referencia del tiempo principal
var principalTimeNode = document.querySelector("#time");

//Referencia al modo de time
var timeMode = document.querySelector("#time_mode")

//Funcion que se ejecuta cada segundo
var countEverySeconds;

//Referencia de los temporizadores
var focusTimeInputs = document.querySelectorAll(".focus_timer input");
var restTimeInputs = document.querySelectorAll(".rest_timer input");

var allTimeImputs = document.querySelectorAll(".timers_continer input");

//convirtiendo las listas de inputs a arrays (para que pueda ser manejado con el worker)
var focusTimeValues = Array.from(focusTimeInputs).map(input => input.value);
var restTimeValues = Array.from(restTimeInputs).map(input => input.value);

//Referencia de los botones
var iniciarBtn = document.querySelector(".buttons #iniciar_btn");
var pausarBtn = document.querySelector(".buttons #pausar_btn");
var reiniciarBtn = document.querySelector(".buttons #reiniciar_btn");
var cambiarBtn = document.querySelector(".buttons #cambiar_btn");

//Eventlistener de los botones
iniciarBtn.addEventListener("click", iniciarBtnClick);
pausarBtn.addEventListener("click", pausarBtnClick);
reiniciarBtn.addEventListener("click", reiniciarBtnClick);
cambiarBtn.addEventListener("click", cambiarBtnClick);

//Detecta la consistencia de los valores el valor
for(let i = 0; i < allTimeImputs.length; i++){
    let input = allTimeImputs[i];
    input.addEventListener('change', function(){
        if(input.value > parseInt(input.max)) {
            input.value = parseInt(input.max);
        }
        else if(input.value < parseInt(input.min)) input.value = parseInt(input.min);
        
        if(input.value == "") input.value = 0;
        reasingArrayTimerValues();
        timeWorker.postMessage({command: "reasing time", focusTimeValues: focusTimeValues, restTimeValues: restTimeValues});
    })

//Auto seleccionar
    input.addEventListener('click', function(e) {
        let input2 = e.target;
        input2.select();
    })
}

//Modifica el contador del DOM
function modifiePrincipalTime(){
    principalTimeNode.textContent = "" + (hours > 9? hours : "0" + hours) + ":" + (minutes > 9? minutes : "0" + minutes) + ":" + (seconds > 9? seconds : "0" + seconds); 
}
//Modifica el titulo de la pagina
function modifiePageTittle(){
    document.title =  "" + (hours > 9? hours : "0" + hours) + ":" + (minutes > 9? minutes : "0" + minutes) + ":" + (seconds > 9? seconds : "0" + seconds) + " Pomodoro timer";
}
function CambiarTimeModeTittle(text, color){
    timeMode.textContent = text;
    timeMode.style.color = color;
}

//reasignar valores
function reasingArrayTimerValues(){
    focusTimeValues = Array.from(focusTimeInputs).map(input => input.value);
    restTimeValues = Array.from(restTimeInputs).map(input => input.value);
}

//Sonido de alarma
var alarmSong = new Audio();
alarmSong.src = "./sound/Minecraft\ Level\ Up\ Sound\ Effect.mp3"

//Worker
var timeWorker = new Worker('./worker.js');
timeWorker.postMessage({command: "start program", focusTimeValues: focusTimeValues, restTimeValues: restTimeValues});

//Funcione a la que llaman los botones
function iniciarBtnClick(){
    reasingArrayTimerValues();
    timeWorker.postMessage({command: "start"})
}
function pausarBtnClick(){timeWorker.postMessage({command: "pause"})}
function reiniciarBtnClick(){timeWorker.postMessage({command: "restart"})}
function cambiarBtnClick(){timeWorker.postMessage({command: "change"})}

timeWorker.onmessage = function(e){
    let data = e.data;
    if(data.command == "update"){
        hours = e.data.hours;
        minutes = e.data.minutes;
        seconds = e.data.seconds;
        modifiePrincipalTime();
        modifiePageTittle();
    }

    if(data.command == "chage time mode tittle"){
        CambiarTimeModeTittle(data.text, data.color);
    }
    if(data.command == "play song"){
        alarmSong.play();
    }

    if(data.command == "reasing time"){
        focusTimeValues = Array.from(focusTimeInputs).map(input => input.value);
        restTimeValues = Array.from(restTimeInputs).map(input => input.value);
        this.postMessage({command: "reasing time", focusTimeValues: focusTimeValues, restTimeValues: restTimeValues});
    }
}