const heroContainer = document.querySelector('#heroContainer')
const enemyContainer = document.querySelector('#enemyContainer')
const mathExpressionContainer = document.querySelector('#mathExpressionContainer')

const startBtn = document.querySelector('#startBtn')
const hideEL = document.querySelectorAll('.hide-El')
const gameMessage = document.querySelector('.game-message')
const endMessage = document.querySelector('#endMessage')

const timerContainer = document.querySelector('#timer-el')


startBtn.addEventListener('click', function() {
    startGame()
})

function timer(time) {
    let setTime = time
    let timer = setInterval(function() {
        timerContainer.textContent = setTime
        setTime--
        if (setTime < 0) {
            clearInterval(timer);
            return setTime
        }
    }, 1000)
}

function startGame() {
    setTimeout(() => {
        hideEL.forEach(function(div) {
            div.classList.add('show-El')
        })
    
        startBtn.classList.add('hide-El')
        gameMessage.classList.remove('show-El')
        gameMessage.classList.add('hide-message')
    }, 1000);
    
    timer(20)
    setTimeout(()=>{
        diplayDamage()
    },22000)
}

let enemysArray = ["goblin","orc", "demon"]
function getNewEnemy() {
    const newEnemyData = characterData[enemysArray.shift()]
    return newEnemyData ? new Character(newEnemyData) : {}
}

function diplayDamage() {
    timer(8)
    //hide buttons
    hideEL.forEach(function(div) {
        div.classList.remove('show-El')
        div.classList.add('hide-El')
    })
    gameMessage.classList.remove('hide-message')
    gameMessage.classList.add('show-El')

    //displays character stats changes
    enemy.attackPoints = getEnemyRandomAttackpoints()
    displayCharacter()
    setTimeout(() => {
        enemy.takeDamage(hero.attackPoints)
        hero.resetAttackPoints()
        hero.takeDamage(enemy.attackPoints)
        enemy.resetAttackPoints()

        setTimeout(() => {
            if (hero.dead) {
                endGame()
                gameMessage.classList.remove('hide-message')
                gameMessage.classList.add('show-El')
            } else if(enemy.dead) {
                if (enemysArray.length > 0) {
                    hero.resetHeroHealth()
                    enemy = getNewEnemy()
                    newOperation = getNewOperation()
                    displayCharacter()
                    //show buttons 
                    setTimeout(()=>{
                        startGame()
                        renderMathExpression() 
                        renderAnswerBtn()
                    },4000)
                }  else {
                    endGame()
                    gameMessage.classList.remove('hide-message')
                    gameMessage.classList.add('show-El')
                } 
            } else {
                setTimeout(()=>{
                    startGame()
                    renderMathExpression() 
                    renderAnswerBtn()
                },4000)
            }
        }, 2000) 
       
        displayCharacter()
        
    }, 3000)
}

function endGame() {
    return endMessage.textContent = hero.health === 0 && enemy.health === 0 ? "Game Over! The game is draw. Great Job!" :
    hero.health > 0 ? "Game Over! You Win. Great Job!" : "Game Over! You lose. Need more practice!"    
}

const characterData = {
    mathWizard: {
        name: "Wizard",
        avatar: "images/wizard.png",
        health: 500,
        attackPoints: 0
    },

    goblin: {
        name: "Goblin",
        avatar: "images/goblin.png",
        health: 400,
        attackPoints: 0
    },

    orc: {
        name: "Orc",
        avatar: "images/orc.png",
        health: 400,
        attackPoints: 0
    },

    demon: {
        name: "Demon",
        avatar: "images/demon.png",
        health: 400,
        attackPoints: 0
    }
}

class Character {
    constructor(data) {
        Object.assign(this,data)
        this.maxHealth = this.health
    }

    getCharacterHtnl() {
        const {name, avatar, health, attackPoints, maxHealth} = this
        const healthBarPercentage = (100 * health) / maxHealth
        return `
        <p class="hero-name">${name}</p>
        <img src="${avatar}" alt="a wizard">
        <p class="text-left">health: ${health}</p>
        <div class="health-bar-container">
            <div class="health-bar" style="width: ${healthBarPercentage}%;"></div>
        </div>
        <p>Attack Points: <span class="attack-points">${attackPoints}</span></p>
        `
    }

    addingAttackPoints() {      
        if (newOperation.getAnswer() === parseInt(userAnswer)) {           
            return this.attackPoints += 10
        } else {
            return this.attackPoints -= 10
        }
    }

    resetAttackPoints() {
        this.attackPoints = 0
    }

    resetHeroHealth() {
        this.health = 500
    }

    takeDamage(oppositeAttackPoints) {
        if (oppositeAttackPoints < 0) {
            oppositeAttackPoints = 0
        }
        this.health -= oppositeAttackPoints
        if (this.health <= 0) {
            this.health = 0
            this.dead = true
        }
    }
}

const hero = new Character(characterData.mathWizard)
let enemy = getNewEnemy()

//display character
function displayCharacter() {
    heroContainer.innerHTML = hero.getCharacterHtnl()
    enemyContainer.innerHTML = enemy.getCharacterHtnl()
}

displayCharacter()


//Operations
const mathOperation = {
    addition: {
        operationName: "Addition",
        symbol: "+"
    },

    subtraction: {
        operationName: "Subtraction",
        symbol: "-"
    },

    multiplication: {
        operationName: "Multiplication",
        symbol: "x"
    }
}


class MathExpression {
    constructor(data) {
        Object.assign(this, data)
    }

    getMathExpressionHtml() {
        switch (this.symbol) {
            case "+":
                this.firstNum = getRandomNumbers(1,20);
                this.secondNum = getRandomNumbers(1,20);
                break;
            case "-":
                this.firstNum = getRandomNumbers(1,20);
                this.secondNum = getRandomNumbers(1,20);
                if (this.firstNum < this.secondNum) {
                    this.secondNum = [this.firstNum, this.firstNum = this.secondNum] [0]
                }
                break;
            case "x":
                this.firstNum = getRandomNumbers(1,9);
                this.secondNum = getRandomNumbers(1,9);
                break;
        }
        let {firstNum, secondNum, symbol} = this
        return `
        <p><span class="first-number">${firstNum}</span> <span class="operation"> ${symbol} </span><span class="second-number">${secondNum}</span></p>
        `
    }

    getAnswer() {
        const {firstNum, secondNum, symbol} = this
        switch(symbol) {
            case "+" : return add(firstNum, secondNum);
            break;
            case "-" : return subtract(firstNum, secondNum);
            break;
            case "x" : return multiply(firstNum, secondNum);
            break;
        }
    }

    getChoices() {
        let firstChoice = this.getAnswer()
        let secondChoice = getRandomNumbers(1,99)
        let thirdChoice = getRandomNumbers(1,99)
        
        while (firstChoice === secondChoice || firstChoice === thirdChoice || secondChoice === thirdChoice) {
            secondChoice = getRandomNumbers(1,99)
            thirdChoice = getRandomNumbers(1,99)
        }
        let choices = [firstChoice, secondChoice, thirdChoice]
        let randomIdex = Math.floor(Math.random() * choices.length)
        let removedItem = choices.splice(0,1)
        choices.splice(randomIdex, 0, removedItem)                      
        return choices
    }
}

// Change operation
let operationsArray = ["addition", "subtraction", "multiplication"]
function getNewOperation() {
    const newOperation = mathOperation[operationsArray.shift()]
    return newOperation ? new MathExpression(newOperation) : {}
}
let newOperation = getNewOperation()


//Buttons function
let userAnswer = ""
const answerBtn = document.querySelectorAll('.btn')
answerBtn.forEach(button => {
    button.addEventListener('click', () => {
        userAnswer = button.textContent
        hero.addingAttackPoints()
        displayCharacter()
        renderMathExpression()
        renderAnswerBtn()
    })
})

function renderMathExpression() {
    mathExpressionContainer.innerHTML = newOperation.getMathExpressionHtml()
}

function renderAnswerBtn() {
    const userChoices = newOperation.getChoices()
    const userChoicesLength = userChoices.length
    for (let i = 0; i < userChoicesLength; i++) {
        answerBtn[i].textContent = userChoices[i]      
    }
}

function getRandomNumbers(rangeFrom, rangeTo) {
    return Math.floor(Math.random() * rangeTo ) + rangeFrom
}

function add(num1, num2) {
    return num1 + num2
}

function subtract(num1, num2) {
    return num1 - num2
}

function multiply(num1, num2) {
    return num1 * num2
}

function getEnemyRandomAttackpoints() {
    return (Math.floor( Math.random() * 4 ) + 7) * 10
}

renderMathExpression() 
renderAnswerBtn()