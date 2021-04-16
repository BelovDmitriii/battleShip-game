let view = {
    // Вывод сообщений в области сообщений
    displayMessage: function (msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    //Расположение кораблей (попадание)
    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    // Указатель промахов 
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

// Первая проверка

// view.displayMiss("00");
// view.displayHit("34");
// view.displayMiss("55");
// view.displayHit("12");
// view.displayMiss("25");
// view.displayHit("26");

view.displayMessage("Ну давай, попробуй победить!");

// объект Модель. Массив кораблей

// let ships = [{locations: [0, 0, "30"], hits: ["", "", ""]},
//              {locations: ["32", "33", "34"], hits: ["", "", ""]},
//              {locations: ["63", "64", "65"], hits: ["", "", "hit"]}];

// Создание бъекта модели

let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]}],

    fire: function (guess) {
        // перебираем массив ships, проверка каждого корабля
        for(let i = 0; i < this.numShips; i++){
            let ship = this.ships [i];

            let index = ship.locations.indexOf(guess);

                if (index >= 0){
                    ship.hits[index] = "hit";  
                    
                    view.displayHit(guess);
                    view.displayMessage("Попадание!");

                    if (this.isSunk(ship)) {
                        view.displayMessage("Ты потопил корабль!!!")
                        this.shipsSunk++;
                    }
                    return true;
                }
                
            }
            view.displayMiss(guess);
            view.displayMessage("Ты промазал!!!")
            return false; 
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i ++) {
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    // Размещение кораблей

    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++){   
            do {
                locations = this.generateShip();   
            } while (this.collision(locations));   
            this.ships[i].locations = locations;    
        }
    },

    generateShip: function (){
        let direction = Math.floor(Math.random() * 2);   
        let row, col;                                    
        if (direction === 1){
            row = Math.floor(Math.random() * this.boardSize);     
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));  
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength)); 
            col = Math.floor(Math.random() * this.boardSize);                     
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++){
            if (direction === 1){                               
                newShipLocations.push(row + "" + (col + i));     
            } else {                                            
                newShipLocations.push((row + i) + "" + col);    
            }
        }
        return newShipLocations;         
    },

    collision: function (locations) {     // проверка на одинаковые позиции 
        for (let i = 0; i < this.numShips; i++ ){   
            let ship = model.ships[i];               
            for (let j = 0; j < locations.length; j++) {       
                if (ship.locations.indexOf(locations[j]) >= 0){  
                    return true;
                }
            }
        }
        return false;
    }

};


// тест на попадание
// model.fire("53"); // miss

// model.fire("06"); // hit
// model.fire("16"); // hit
// model.fire("26"); // hit

// model.fire("34"); // hit
// model.fire("24"); // hit
// model.fire("44"); // hit

// model.fire("12"); // hit
// model.fire("11"); // hit
// model.fire("10"); // hit

// model.fire("36");
// model.fire("35");
// model.fire("34");

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];  
    if (guess === null || guess.length !== 2){  
        alert ("Введите букву и цифру в таблицу!")
    } else {
        firstChar = guess.charAt(0);   
        let row = alphabet.indexOf(firstChar);  
        let column = guess.charAt(1);   

        if(isNaN(row) || isNaN(column)){
            alert("Таких символов нет на поле!!!");
        }else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Здесь нет таких значений!!!");
        }else {
            return row + column;
        }
    }
    return null;
}

// Проверка на правильновть ввода данных (буква-цифра)

// console.log(parseGuess("AA"));
// console.log(parseGuess("B6"));
// //console.log(parseGuess("C8"));
// console.log(parseGuess("F4"));
// //console.log(parseGuess("S2"));
// console.log(parseGuess("E3"));
// console.log(parseGuess("G6"));

// реализация контроллера попаданий, создание объекта 

let controller = {
    guesses: 0,
    processGuess: function (guess) {  
        let location = parseGuess(guess);
        if(location) {
            this.guesses++ ;               
            let hit = model.fire(location);
            
            if(hit && model.shipsSunk === model.numShips) {  
                view.displayMessage("Ты потопил все корабли за " + this.guesses + " выстрелов.");
            }
        }
    }
};


// проверка работы контроллера

// controller.processGuess("A0"); // miss

// controller.processGuess("A6"); // hit
// controller.processGuess("B6"); // hit
// controller.processGuess("C6"); // hit

// controller.processGuess("C4"); // hit
// controller.processGuess("D4"); // hit
// controller.processGuess("E4"); // hit

// controller.processGuess("B0"); // hit
// controller.processGuess("B1"); // hit
// controller.processGuess("B2"); // hit


// Связь обработчика с кнопкой Огонь!

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;  
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();    
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");  
    let guess = guessInput.value;                            
    controller.processGuess(guess);                         
    guessInput.value = "";                                   
}
window.onload = init;