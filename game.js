var maxFieldSizeX = 150
var maxFieldSizeY = 100
var maxSubmarines = 5
var tickTimeInMS = 1000
var initTorpedoPosX = 15
var initTorpedoPosY = 15
var initSubmarinePosX = 40
var initSubmarinePosY = 30
var torpedoSpeed = 0.7
var submarineSpeed = 0.2
var screenBorder = 15
var maxTorpedoHits = 2

// Game logic

submarines = []
torpedoes = []

spawnCount = 0

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNewSubmarine(){
    var submarineDummy = document.getElementById("submarineDummy");
    var newSubmarine = submarineDummy.cloneNode(true);
    spawnCount++
    newSubmarine.id = "submarine_"+spawnCount
    document.body.appendChild(newSubmarine);
    return [newSubmarine,0,0];
}

function placeSubmarine(submarine,x,y){
    submarine[0].style.left = x+"px"
    submarine[0].style.top = y+"px"
    submarine[1] = x
    submarine[2] = y
    return true
}

function placeTorpedo(torpedo,x,y){
    torpedo[0].style.left = x+"px"
    torpedo[0].style.top = y+"px"
    torpedo[1] = x
    torpedo[2] = y
    torpedo[3]++
    return true
}

function createNewTorpedo(deg){
    var torpedoDummy = document.getElementById("torpedoDummy");
    var newTorpedo = torpedoDummy.cloneNode(true);
    newTorpedo.id = "torpedo_"+spawnCount
    document.body.appendChild(newTorpedo);
    var direction = convertDegToVector(deg)
    return [newTorpedo,initTorpedoPosX,initTorpedoPosY,direction[0],direction[1],0];
    //div,x,y,vx,vy,hitCounter
}

function initialSubmarines(){
    console.log("Creating Submarines...")
    while (submarines.length < maxSubmarines) {
        var newSubmarine = createNewSubmarine()
        var randX = getRandomInt(initSubmarinePosX, maxFieldSizeX)
        var randY = getRandomInt(initSubmarinePosY, maxFieldSizeY)
        placeSubmarine(newSubmarine,randX,randY);
        submarines.push(newSubmarine)
    }
    console.log(submarines)
    return true;
}

function checkTorpedo(torpedo, torpedoNumber){
    for (var i = 0; i < submarines.length; i++) {
        if ((torpedo[1] >= submarines[i][1] || torpedo[1]+5 >= submarines[i][1]) &&
            (torpedo[1] <= submarines[i][1]+10 || torpedo[1]+5 <= submarines[i][1]+10) &&
            (torpedo[2] >= submarines[i][2] || torpedo[2]+5 >= submarines[i][2]) &&
            (torpedo[2] <= submarines[i][2]+10 || torpedo[2]+5 <= submarines[i][2]+10)){
                console.log("Torpedo hit submarine...")
                //submarines[i][0].parentNode.removeChild(submarines[i][0])
                //submarines.splice(i, 1)
                terminateSubmarine(i)
                torpedo[5]++
                if (torpedo[5] > maxTorpedoHits){
                    terminateTorpedo(torpedoNumber)
                }
        }
    }
    return true
}

function terminateTorpedo(torpedoNumber){
    torpedoes[torpedoNumber][0].parentNode.removeChild(torpedoes[torpedoNumber][0])
    torpedoes.splice(torpedoNumber, 1)
}

function terminateSubmarine(submarineNumber){
    submarines[submarineNumber][0].parentNode.removeChild(submarines[submarineNumber][0])
    submarines.splice(submarineNumber, 1)
}

function convertDegToVector(deg){
    var rad = deg * Math.PI / 180;
    var vectorX = Math.floor(Math.cos(rad)*10)
    var vectorY = Math.floor(-1*Math.sin(rad)*10)
    /*var vectorX = Math.cos(rad)
    var vectorY = -1*Math.sin(rad)*/
    return [vectorX,vectorY]
}

function fireTorpedo(){
    var deg = document.getElementById("torpedoDegValue").value
    console.log("Firing torpedo at "+deg+" degrees...")
    var torpedo = createNewTorpedo(deg)
    torpedoes.push(torpedo)
    return true
}

function tick(){
    console.log("Tick begins...")

    for (var i = 0; i < torpedoes.length; i++) {
        var newX = torpedoes[i][1]+torpedoes[i][3]*torpedoespeed
        var newY = torpedoes[i][2]+torpedoes[i][4]*torpedoespeed
        if (newX < screenBorder) newX = screenBorder
        if (newY < screenBorder) newY = screenBorder
        placeTorpedo(torpedoes[i], newX, newY)
        checkTorpedo(torpedoes[i],i)
        if (newX > maxFieldSizeX || newY > maxFieldSizeY){
            terminateTorpedo(i)
        }
    }

    for (var i = 0; i < submarines.length; i++) {
        var newX = submarines[i][1]-10*submarineSpeed
        var newY = submarines[i][2]-10*submarineSpeed
        if (newX < screenBorder) newX = screenBorder
        if (newY < screenBorder) newY = screenBorder
        placeSubmarine(submarines[i], newX, newY)
    }
    initialSubmarines()
    console.log("Tick ended. Next tick in "+tickTimeInMS+"ms...")
    return true;
}

initialSubmarines()

setInterval(tick, tickTimeInMS)
