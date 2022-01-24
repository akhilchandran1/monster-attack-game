const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredMaxLife = prompt('maximum life for you and the monster?', '100');

let chosenMaxLife = parseInt(enteredMaxLife);
let battleLog = [];

if(isNaN(enteredMaxLife) || enteredMaxLife <= 0){
  chosenMaxLife = 100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };
  if(ev === LOG_EVENT_PLAYER_ATTACK || ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
    logEntry.target = 'MONSTER';
  }else if(ev === LOG_EVENT_MONSTER_ATTACK || ev === LOG_EVENT_PLAYER_HEAL){
    logEntry.target = 'PLAYER';
  }else if(ev === LOG_EVENT_GAME_OVER){
    
  }
  battleLog.push(logEntry);
}

function reset(){
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound(){
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
    alert('you won!!!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0){
    alert('Game draw');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW GAME",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }else if(currentMonsterHealth >= 0 && currentPlayerHealth <= 0){
    alert('you failed');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if(currentMonsterHealth <= 0 || currentPlayerHealth <= 0){
    reset();
  }
}

function attackMonster(mode){
  // TERNARY OPERATION
  //(Note: we can use ternary operations insted of small if statements. 
  // we should pass two values, if the condition is true the 1st value will ve stored else the 2nd value will take)
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  /*
  if(mode === MODE_ATTACK){
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  }else if(mode === MODE_STRONG_ATTACK){
    maxDamage = STRONG_ATTACK_VALUE
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  */
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
  let healValue;
  if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
    alert("you are fully healed");
    healValue = chosenMaxLife - currentPlayerHealth;
  }else{
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler(){
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);