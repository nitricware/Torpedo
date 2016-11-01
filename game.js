/**
 *   _______                        _
 *  |__   __|                      | |
 *     | | ___  _ __ _ __   ___  __| | ___
 *     | |/ _ \| '__| '_ \ / _ \/ _` |/ _ \
 *     | | (_) | |  | |_) |  __/ (_| | (_) |
 *     |_|\___/|_|  | .__/ \___|\__,_|\___/
 *                  | |
 *                  |_|
 *
 * Torpedo v. 1.1
 * 1. November 2016
 * NitricWare - nitricware.com
 * MIT License
 */

/**
 * Settings
 */

var maxFieldSizeX = 150     // Specify game field width, also change css
var maxFieldSizeY = 100     // Specify game field heigth, also change css
var maxSubmarines = 5       // Specify number of simultaneous active boats
var tickTimeInMS = 1000     // Specify tick length
var initTorpedoPosX = 15    // Compare with body margin in css
var initTorpedoPosY = 15    // Compare with body margin in css
var initSubmarinePosX = 40  // Closest X position of boat at spawn
var initSubmarinePosY = 30  // Closest Y position of boat at spawn
var torpedoSpeed = 0.7      // Torpedo speed
var submarineSpeed = 0.2    // Boat speed
var screenBorder = 15       // Compare with body margin in css
var maxTorpedoHits = 2      // How many hits before torpedo is terminated
var creditsPerHit = 100     // Credits given for sinking a boat

/**
 * Game Logic
 */

/**
 * returns a random integer in range of min and max
 * @param  {int} min min number
 * @param  {int} max max number
 * @return {int}     random int
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a submarine div.
 * @return {array} Contains the div, and initial x and y
 */
function createNewSubmarine(){
    var submarineDummy = document.getElementById("submarineDummy");
    var newSubmarine = submarineDummy.cloneNode(true);
    spawnCount++
    newSubmarine.id = "submarine_"+spawnCount
    document.body.appendChild(newSubmarine);
    return [newSubmarine,0,0];
}

/**
 * Places submarine div at x and y.
 * @param  {array} submarine the submarine array
 * @param  {int} x           new x position
 * @param  {int} y           new y position
 * @return {bool}            true
 */
function placeSubmarine(submarine,x,y){
    submarine[0].style.left = x+"px"
    submarine[0].style.top = y+"px"
    submarine[1] = x
    submarine[2] = y
    return true
}

/**
 * Places torpedo div at x and y.
 * @param  {array} torpedo the torpedo array
 * @param  {int} x         new x position
 * @param  {int} y         new y position
 * @return {bool}          true
 */
function placeTorpedo(torpedo,x,y){
    torpedo[0].style.left = x+"px"
    torpedo[0].style.top = y+"px"
    torpedo[1] = x
    torpedo[2] = y
    torpedo[3]++
    return true
}

/**
 * Creates a torpedo div and sets its direction.
 * @param  {int} deg   direction in degrees
 * @return {array}     the new torpedo array
 */
function createNewTorpedo(deg){
    var torpedoDummy = document.getElementById("torpedoDummy");
    var newTorpedo = torpedoDummy.cloneNode(true);
    newTorpedo.id = "torpedo_"+spawnCount
    document.body.appendChild(newTorpedo);
    var direction = convertDegToVector(deg)
    return [newTorpedo,initTorpedoPosX,initTorpedoPosY,direction[0],direction[1],0];
    //div,x,y,vx,vy,hitCounter
}

/**
 * Creates submarines until maxSubmarines is reached
 * @return {bool} true
 */
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

/**
 * Collision detection.
 * @param  {array} torpedo       the torpedo array
 * @param  {int} torpedoNumber   index of torpedo inside torpedoes
 * @return {bool}                true
 */
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
                torpedoes[torpedoNumber][5]++
                updateScore(creditsPerHit*torpedoes[torpedoNumber][5])
                if (torpedoes[torpedoNumber][5] > maxTorpedoHits){
                    terminateTorpedo(torpedoNumber)
                }
        }
    }
    return true
}

/**
 * Deletes the torpedo div and splices it from torpedoes.
 * @param  {int} torpedoNumber  index inside torpedoes
 * @return {bool}               true
 */
function terminateTorpedo(torpedoNumber){
    torpedoes[torpedoNumber][0].parentNode.removeChild(torpedoes[torpedoNumber][0])
    torpedoes.splice(torpedoNumber, 1)
    return true
}

/**
 * Deletes the boat div and splices it from submarines.
 * @param  {int} submarineNumber index inside
 * @return {bool}                true
 */
function terminateSubmarine(submarineNumber){
    submarines[submarineNumber][0].parentNode.removeChild(submarines[submarineNumber][0])
    submarines.splice(submarineNumber, 1)
    return true
}

/**
 * Converts degrees to a directional vector.
 * @param  {int} deg degrees
 * @return {array}   vector
 */
function convertDegToVector(deg){
    var rad = deg * Math.PI / 180;
    var vectorX = Math.floor(Math.cos(rad)*10)
    var vectorY = Math.floor(-1*Math.sin(rad)*10)
    /*var vectorX = Math.cos(rad)
    var vectorY = -1*Math.sin(rad)*/
    return [vectorX,vectorY]
}

/**
 * Creates a new torpedo and sets its degrees by reading from an input field.
 * @return {bool} true
 */
function fireTorpedo(){
    var deg = document.getElementById("torpedoDegValue").value
    console.log("Firing torpedo at "+deg+" degrees...")
    var torpedo = createNewTorpedo(deg)
    torpedoes.push(torpedo)
    return true
}

function updateScore(credits){
    score += credits
    document.getElementById("score").innerHTML = score
    return true
}

/**
 * Does a tick.
 * @return {bool} true
 */
function tick(){
    console.log("Tick begins...")

    for (var i = 0; i < torpedoes.length; i++) {
        var newX = torpedoes[i][1]+torpedoes[i][3]*torpedoSpeed
        var newY = torpedoes[i][2]+torpedoes[i][4]*torpedoSpeed
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

submarines = []
torpedoes = []

spawnCount = 0

score = 0

setInterval(tick, tickTimeInMS)
