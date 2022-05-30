class Cell {
  constructor(y, x, cellWidth, elem) {
    this.cellWidth = cellWidth;
    this.pos = new p5.Vector(x * cellWidth, y * cellWidth);
    this.x = x;
    this.y = y;
    // this.container = elem;
    this.animalsHere = [];

    // this.elem = document.createElement("cell");
    // this.elem.style.width = cellWidth + "px";
    // this.elem.style.height = cellWidth + "px";
    // this.elem.style.left = x * cellWidth + "px";
    // this.elem.style.top = y * cellWidth + "px";

    // this.elem.classList.add("cell");
    // this.elem.setAttribute("x", x);
    // this.elem.setAttribute("y", y);
    // this.container.appendChild(this.elem);
    // this.elem.onclick = (e) => {
    //   console.log("# CLICK ON CELL", this);
    //   // for (let a of animals) {
    //   //   a.target = this;
    //   // }
    // };

    this.typesOfSoil = ["grass", "dirt"];

    this.type = Math.floor(Math.random() * this.typesOfSoil.length);

    if (Math.random() > 1 - PERCENTAGE_OF_ROCK_FLOOR) this.type = 1;

    if (this.type == 1) this.maxFood = 0;
    else this.maxFood = Math.floor(Math.random() * MAX_FOOD_OF_CELLS);

    this.food = Number(this.maxFood);
    /////definition of stuff:
  }
  removeMe(who) {
    let where;
    for (let i = 0; i < this.animalsHere.length; i++) {
      let a = this.animalsHere[i];
      if (a == who) {
        this.animalsHere.splice(i, 1);
        break;
      }
    }
  }
  addMe(who) {
    // console.log("# add me", this, who);
    let areYouHere = false;
    for (let a of this.animalsHere) {
      if (a == who) {
        areYouHere = true;
        break;
      }
    }
    if (!areYouHere) {
      this.animalsHere.push(who);
    }
  }

  getNeighbours() {
    let arrRet = [];
    let x = this.pos.x / this.cellWidth;
    let y = this.pos.y / this.cellWidth;
    try {
      arrRet.push(grid[y - 1][x - 1]);
    } catch (e) {}
    try {
      arrRet.push(grid[y - 1][x]);
    } catch (e) {}
    try {
      arrRet.push(grid[y - 1][x + 1]);
    } catch (e) {}
    try {
      arrRet.push(grid[y][x - 1]);
    } catch (e) {}
    try {
      arrRet.push(grid[y][x + 1]);
    } catch (e) {}
    try {
      arrRet.push(grid[y + 1][x - 1]);
    } catch (e) {}
    try {
      arrRet.push(grid[y + 1][x]);
    } catch (e) {}
    try {
      arrRet.push(grid[y + 1][x + 1]);
    } catch (e) {}
    return arrRet.filter((k) => k);
  }

  getPos() {
    return this.pos.copy();
  }

  // color(col) {
  //   this.elem.style.backgroundColor = col;
  // }

  tick(FRAMENUM) {
    if (this.type == 1) return;
    //EVERY 10 FRAMES THEY GET 1 MORE FOOD, WHEN THEY GET TO THE LIMIT THEY GROW OUTWARDS
    if (this.food <= 0) this.type = 1;
    if (Math.floor(Math.random() * CELLCLOCK_TO_REPRODUCE) == 0) {
      this.food++;
      if (this.food >= this.maxFood * 0.9) {
        this.food = this.maxFood;
        let neighs = this.getNeighbours();
        //console.log(neighs);
        for (let n of neighs) {
          if (n.type == 1) {
            //IF THE CELL IS ROCK, CONVERT IT
            n.type = 0;
            if (!n.MaxFood) n.maxFood = Math.random() * MAX_FOOD_OF_CELLS;
          }
          if (n.type == 0) {
            n.food++;
          }
        }
      }
    }
    if (this.food < 0) this.food = 0;

    this.checkCorpsesHere();
  }

  checkCorpsesHere() {
    let dead = this.animalsHere.filter((k) => k.dead);
    for (let animal of dead) {
      this.food += animal.decomposition * 0.01;
      if (this.food > this.maxFood) this.maxFood = this.food;
    }
  }

  getColor() {
    if (this.type == 1) return "gray";
    this.coefOpacity = this.food / this.maxFood;
    if (this.type == 0) {
      return "rgb(0, " + (this.coefOpacity * 200 + 50).toFixed(0) + ", 0)";
    } else if (this.type == 2) {
      return "rgb(" + (this.coefOpacity * 200 + 50).toFixed(0) + ", 0, 0)";
    }
  }

  render(FRAMENUM) {
    ctx.beginPath();

    ctx.rect(
      this.pos.x - this.cellWidth / 2,
      this.pos.y - this.cellWidth / 2,
      this.cellWidth + 1,
      this.cellWidth + 1
    );
    ctx.fillStyle = this.getColor();
    ctx.fill();
    ctx.closePath();
    // if (this.type == 1) this.elem.style.backgroundColor = "gray";

    // if (this.type != 1) {
    //   this.coefOpacity = this.food / this.maxFood;
    //   this.elem.innerHTML =
    //     Math.floor(this.food) + "/" + Math.floor(this.maxFood);
    //   if (this.type == 0) {
    //     //grass
    //     let bgVal = "rgba(0,255,0," + this.coefOpacity.toFixed(5) + ")";

    //     this.elem.style.backgroundColor = bgVal;
    //   } else if (this.type == 2) {
    //     //berries
    //     if (this.type == 2) {
    //       //grass
    //       let bgVal = "rgba(255,0,0," + this.coefOpacity.toFixed(5) + ")";

    //       this.elem.style.backgroundColor = bgVal;
    //     }
    //   }
    // }

    // if (this.type == 0 && this.food == 0) {
    //   this.type = 1;
    //   this.elem.style.opacity = 1;
    // }
  }
}
