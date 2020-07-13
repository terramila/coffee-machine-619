"use strict"
let state = "waiting"; // "cooking", "ready"
let balance = document.querySelector(".balance");
let cup = document.querySelector(".cup img");
//onclick = "cookcoffee('Американо', 50, this)"

function cookCoffee(name, price, elem) {
  if (state != "waiting") {
    return;
  }
 if (balance.value >= price) {
   state = "cooking";
   balance.style.backgroundColor = "";
   balance.value -= price;// balance.value = balance.value - price
   changeDisplayText(`Ваш ${name} готовится`);
   
   console.log(elem);
   let coffeeImg = elem.querySelector("img");
   console.log(coffeeImg);
   let coffeeSrc = coffeeImg.getAttribute("src");
   console.log(coffeeSrc);
   console.log(coffeeImg.src);
   
   startCooking(name, coffeeSrc);
 } else {
   changeDisplayText("недостаточно средств");
   balance.style.backgroundColor = "rgb(255, 119, 0)";
 }
}
//поанирование
//setTimeout(func, ms); -отрабатывает только 1 раз
//setInterval(func, ms); - отрабатывает пока мы его не отключим
//let timeout = setTimeout(func, ms);
//let interval = setInterval(func, ms);
//clearTimeout(timeout)
//clearInterval(interval)
function startCooking(name, src) {
  //let progressBar = document.querySelector(".progress-bar");
  let cup = document.querySelector(".cup img");
  cup.setAttribute("src", src);
  cup.style.display = "inline";
  let t = 0;
 let cookingInterval = setInterval(() => {  // тоже самое ,что и function() {}
   t ++;
   cup.style.opacity = t + "%";
  // progressBar.style.width = t + "%";
  changeProgressPercent(t);
   console.log(t);
   if (t == 100) {
     state = "ready";
     clearInterval(cookingInterval);
     changeDisplayText(`Ваш ${name} готов!`);
     cup.style.cursor = "pointer";
     cup.onclick = function() {
       takeCoffee();
     }
   }
 }, 50); 
}

function takeCoffee() {
  if (state != "ready") {
    return;
  }
  state = "waiting";
 changeProgressPercent(0);
 cup.style.opacity = 0;
 cup.style.display =""; // или "none"
 cup.style.cursor ="";
 changeDisplayText("выберите кофе");
 cup.onclick = null;
}
function changeProgressPercent(percent) {
   let progressBar = document.querySelector(".progress-bar");
   progressBar.style.width = percent + "%";
}
function changeDisplayText(text) {
  if (text.length > 23) {
    text = text.slice(0,23) + "...";
  }
  let displayText = document.querySelector(".display span");
displayText.innerHTML = text;
  }
  
  //-----------drag'n drop---------
  
  let money = document.querySelectorAll(".money img");
  
  /*for (let i= 0; i < money.length; i++) {
    money[i].onmousedown = takeMoney;
  }*/  //1 вариант
  //div class="coffee-item" onclick='cookcoffee('Капучино' 92, this)"></div>
  /*coffeeItem.onclick = function() {
    cookCoffee('Капучино', 92, this);
  }*/
  // в функции,которая присвоена событию ,передается this ,который возвращает элемент,на котором это событие совершено.
  
  //2 вариант
  for (let bill of money) {
    bill.onmousedown = takeMoney;
  }
  //в функцию,которой присвоено событие,первым параметром передается объект события -event ,е 
  function takeMoney(event) {
    event.preventDefault();//событие прервано.Если использовать функцию обертку,то  1 параметром будет  использовано event 
   /* console.log(this);
    console.log(event);
    console.log([event.target, event.clientX, event.clientY]);*/
    let bill = this;
    
    console.log(bill.style.height);
    console.log(bill.style.width);
    console.log(bill.getBoundingClientRect() );
    
    let billCoords = bill.getBoundingClientRect();
    
    let billHeight = billCoords.height;
    let billWidth = billCoords.width;
    
    bill.style.position = "absolute";
    if (!bill.style.transform) { //bil.style.transform == "" ("" = false);
    bill.style.top = (event.clientY - billHeight/2) + "px";
    bill.style.left = (event.clientX - billWidth/2) + "px";
    bill.style.transform = "rotate(90deg)";
    } else { 
    bill.style.top = (event.clientY - billWidth/2) + "px";
    bill.style.left = (event.clientX - billHeight/2) + "px";
    }
    bill.style.transition = "transform .3s";
    
    window.onmousemove = function(event) { 
    let billCoords = bill.getBoundingClientRect();
    let billHeight = billCoords.height;
    let billWidth = billCoords.width;
    bill.style.top = (event.clientY - billWidth/2) + "px";
    bill.style.left = (event.clientX - billHeight/2) + "px";
    }
    
    bill.onmouseup = function() {
      window.onmousemove = null;
     if ( inAtm(bill) ) {
       let cashContainer = document.querySelector(".cash-container");
       bill.style.position = "";
       bill.style.transform = "rotate(90deg) translateX(25%)";
       cashContainer.append(bill);//присоединить в конец элемента
       bill.style.transition = "transform 1.5s";
       setTimeout(()  => {
       bill.style.transform = "rotate(90deg) translateX(-75%)";
       bill.ontransitionend = () => {
         balance.value = +balance.value + +bill.dataset.cost;
         bill.remove();//удаляем элемент
       }
       }, 10)
      console.log(bill.getAttribute("data-cost") );
      console.log(bill.dataset.cost);
      /*balance.value = +balance.value + +bill.dataset.cost;
      bill.remove(); //удаляем элемент*/
     }
    }
  }
  
  function inAtm(bill) {
    let atm = document.querySelector(".atm img");
    
    let atmCoords = atm.getBoundingClientRect();
    let atmLeftX = atmCoords.x;
    let atmRightX = atmCoords.x + atmCoords.width;
    let atmTopY = atmCoords.y;
    let atmBottomY = atmCoords.y + atmCoords.height/3;
    
    let billCoords = bill.getBoundingClientRect() ;
    let billLeftX = billCoords.x;
    let billRightX = billCoords.x + billCoords.width;
    let billY = billCoords.y;
    if (
      billLeftX > atmLeftX
      && billRightX < atmRightX
      && billY > atmTopY
      && billY < atmBottomY
    ) {
      return true;
    } else {
       return false; 
      }

    /*return { 
    atm: [atmLeftX, atmRightX, atmTopY, atmBottomY],
    bill: [billLeftX, billRightX, billY],
  };*/
  }
  // получение сдачи , создание элементов с использованием JS
  let changeButton = document.querySelector(".change-button");
  changeButton.onclick = takeChange;
  
  function takeChange() {
    if (+balance.value >= 10) {//это называется рекурсивная функция
      createCoin("10");
      balance.value -= 10;
     //либо  takeChange(); return;
      return setTimeout (takeChange, 300);
    } else if (+balance.value >= 5) {
      createCoin("5");
      balance.value -= 5;
      return setTimeout (takeChange, 300);
    } else if (+balance.value >= 2) {
      createCoin("2");
      balance.value -= 2;
     return setTimeout (takeChange, 300);
    } else if (+balance.value >= 1) {
      createCoin("1");
      balance.value -= 1;
      return setTimeout (takeChange, 300);
   }
  }
  function createCoin(cost) {
    let coinSrc = "";
    switch (cost) {
      case "10":
       coinSrc = "img/10rub.png";
        break;
        case "5":
       coinSrc = "img/5rub.png";
        break;
        case "2":
         coinSrc = "img/2rub.png";
          break;
          case "1":
         coinSrc = "img/1rub.png";
        break;
      default:
      console.error("такой монеты не существует");
    }
    //заменяем эту конструкцию выше написанной
    /*if (cost == "10") {
     } else if (cost == "5") {
        } else if (cost == "2") {
         } else if (cost == "1") {
          }  else {
          } */
   //let coinSrc = "img/10rub.png";
   let changeBox = document.querySelector(".change-box");
   let changeBoxWidth = changeBox.getBoundingClientRect().width;
   let changeBoxHeight = changeBox.getBoundingClientRect().height;
   let coin = document.createElement("img");
   coin.setAttribute("src", coinSrc);
   coin.style.width = "50px";
   coin.style.cursor ="pointer";
   coin.style.position = "absolute";
   coin.style.top = Math.floor(Math.random() * (changeBoxHeight - 50)) + "px";
   coin.style.left = Math.floor(Math.random() * (changeBoxWidth - 50)) + "px";
   changeBox.append(coin);//Добавляем элемент в конец родительскогородительского
   //changeBox.prepend(coin);//Добавляем элемент в начало родительского
   //changeBox.after(coin);//Добавляем элемент после родительского
   //changeBox.before(coin);//Добавляем элемент до родительского
   //changeBox.replaceWith(coin);//Заменяет родительский элемент  
   coin.style.transition = "transform .5s, opacity .5s";
   coin.style.transform = "translateY(-20%)";
   coin.style.opacity = 0;
    setTimeout(() => {
      coin.style.transform = "translateY(0%)";
      coin.style.opacity = 1;
    },10)
    coin.onclick = () => {
      coin.style.transform = "translateY(-20%)";// или coin.remove(???)
      coin.style.opacity = 0;
      coin.ontransitionend = () => {
        coin.remove();
      }
    }
  }
   
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  