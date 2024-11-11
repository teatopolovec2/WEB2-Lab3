if(!localStorage.getItem("max"))localStorage.setItem("max", 0)	
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
c.width = window.innerWidth-30; //canvas preko cijelog zaslona (rub 15px)
c.height = window.innerHeight-30;

const wP = 300;  //palica
const hP = 10;
let xP = (c.width - wP) / 2;
const yP = c.height - 50;
const speedP = 20;  

function nacrtajPalicu(){
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.shadowBlur = 19; //sjencanje palice
    ctx.shadowColor = "red";
    ctx.fillRect(xP, yP, wP, hP);
}
nacrtajPalicu()

document.addEventListener('keydown', (event) => { //micanje palice
    ctx.clearRect(xP - 20, yP - 40, wP + 40, hP + 100); //brisanje palice na prethodnoj poziciji
    if (event.key === 'ArrowLeft' && xP - speedP >= 0) { //lijevo
        xP = xP -  speedP;
    } else if (event.key === 'ArrowRight' && xP + wP + speedP <= c.width) { //desno
        xP = xP + speedP;
    }
    nacrtajPalicu(); //crtanje palice na novoj poziciji
});

const radijus = 10;  //loptica
let xL = c.width / 2;  
let yL = yP - radijus;
let dxL = Math.floor(Math.random() * (8 - 5 + 1)) + 5; //slucajna brzina micanja loptice u smjeru x osi na pocetku
if (Math.random() > 0.5) dxL = -dxL
let dyL = -Math.floor(Math.random() * (8 - 5 + 1)) + 5;  //slucajna brzina micanja loptice u smjeru y osi na pocetku  

function nacrtajLopticu() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.shadowBlur = 0;
    ctx.arc(xL, yL, radijus, 0, 2 * Math.PI);
    ctx.fill();
}
    
let interval = setInterval(kretanjeLoptice, (1000 / 500) * Math.sqrt(dxL * dxL + dyL * dyL)); //brzina loptice će uvijek biti konstantna, bez obzira na dxL i dyL

const cigle = [];  //cigle
const wC = (c.width-10) / 15;  //15 cigli u redu
const hC = 40;
for (let row = 0; row < 3; row++) {// 3 reda po 15 cigla
    cigle[row] = [];
    for (let col = 0; col < 15; col++) {
        cigle[row][col] = {   //za svaku ciglu pamti se pozicija i informacija je li uništena
            x: col * wC+5, //5 da se vidi sjencanje
            y: row * hC+5, //5 da se vidi sjencanje
            unistena: false
        };
    }
}
function nacrtajCigle(){
    for (let row of cigle) {  
        for (let cigla of row) {
            if (!cigla.unistena) { 
                ctx.beginPath();
                ctx.fillStyle = "#941def";
                ctx.strokeStyle = "black";
                ctx.shadowBlur = 10; //sjencanje cigle
                ctx.shadowColor = "red";
                ctx.rect(cigla.x, cigla.y, wC, hC);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}
nacrtajCigle()


let rezultat = 0
function rez(){  //ispisuje trenutni i maksimalni rezultat
    ctx.shadowBlur = 0; 
    ctx.font = "20px Verdana";
    ctx.fillStyle = "white";
    var txt = "najbolji rezultat: " + localStorage.getItem("max")
    ctx.fillText(txt, (c.width - ctx.measureText(txt).width - 5), 25); //centriranje
    var txt2 = "rezultat: " + rezultat
    ctx.fillText(txt2, (c.width - ctx.measureText(txt2).width - 5), 55); //centriranje
}

function igraGotovaL(){ //kraj igre - izgubljena
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.font = "90px Georgia";  
    ctx.fillStyle = "red";
    ctx.textAlign = "start";
    ctx.fillText("GAME OVER", (c.width - ctx.measureText("GAME OVER").width) / 2, c.height / 2); //centriranje
    ctx.restore();
    clearInterval(interval);
    if (rezultat > localStorage.getItem("max")) {
        localStorage.setItem("max", rezultat)
    }
}

function igraGotovaW(){  //kraj igre - pobjeda
    ctx.save();
    ctx.shadowBlur = 0; 
    ctx.font = "90px Georgia";  //kraj igre
    ctx.fillStyle = "green";
    ctx.textAlign = "start";
    ctx.fillText("BRAVO!", (c.width - ctx.measureText("BRAVO!").width) / 2, c.height / 2);
    ctx.restore();
    clearInterval(interval);
}

function sudariCigle() { //udar loptice u ciglu
    let a = 0;
    for (let row of cigle) {
        for (let cigla of row) {
            if (!cigla.unistena) { 
                var poX = (xL + radijus > cigla.x && xL + radijus < cigla.x + wC) || (xL - radijus > cigla.x && xL - radijus < cigla.x + wC) //loptica unutar cigle po x osi
                var poY = (yL + radijus > cigla.y && yL + radijus < cigla.y + hC) || (yL - radijus > cigla.y && yL - radijus < cigla.y + hC) //loptica unutar cigle po y osi
                if (poX && poY) {
                    cigla.unistena = true;
                    rezultat = rezultat + 1
                    let dno = Math.min(xL + radijus - cigla.x, cigla.x + wC - (xL - radijus)); //loptica je udarila odozgora ili odozdola
                    let stranica = Math.min(yL + radijus - cigla.y, cigla.y + hC - (yL - radijus));//loptica je udarila bocno
                    if (dno < stranica) {
                        dxL = -dxL;
                    } else {
                        dyL = -dyL;
                    }
                    a = 1
                    if (rezultat > localStorage.getItem("max")) localStorage.setItem("max", rezultat) //prikaz novog rezultata nakon sudara
                    rez()
                    break
                }          
            }
        }
        if (a==1)break
    }
    if (rezultat == 3*15) { //sve cigle unistene
        ctx.clearRect(0,0,c.width, c.height)
        setTimeout(() => {igraGotovaW();}, 100); //ceka da se prvo podrucje igre isprazni
    }
}

function kretanjeLoptice() {
    ctx.clearRect(0, 0, c.width, c.height); //brisanje cijelog canvasa
    nacrtajCigle()
    rez(); //ispis rezultata
    nacrtajPalicu();
    xL = xL + dxL; //nova pozicija loptice
    yL = yL + dyL;
    if (xL + radijus > c.width || xL - radijus < 0) { //udar loptice u bocni okvir canvasa
        dxL = -dxL;
    }
    if ((yL - radijus) < 0) { //udar loptice u gornji okvir
        dyL = -dyL;
    }
    if (yL + radijus > yP && yL + radijus <= yP + 5 && xL + radijus > xP && xL - radijus < xP + wP) { //udar loptice u palicu
        const sredinaPalice = xP + (wP / 2);
        if (dxL > 0 && xL > sredinaPalice) dxL = Math.abs(dxL);
        else if (dxL < 0 && xL < sredinaPalice) dxL = -Math.abs(dxL);
        else dxL = -dxL;
        dyL = -dyL;
    } else if (yL + radijus > c.height) {  //loptica izvan donjeg okvira
        ctx.clearRect(0,0,c.width, c.height)
        setTimeout(() => {igraGotovaL();}, 100); //ceka da se prvo podrucje igre isprazni
    }
    sudariCigle();
    nacrtajLopticu();

}
