/*
By Okazz
*/
let colors = ['#f5f1c9', '#19446b', '#de183c', '#f2b541', '#0496ff', '#ec4e20', '#f991cc', '#63be93', '#af42ae'];
let ctx;
let centerX, centerY;
let shapes = [];

function setup() {
	createCanvas(900, 900);
	rectMode(CENTER);
	colorMode(HSB, 360, 100, 100, 100);
	ctx = drawingContext;
	centerX = width / 2;
	centerY = height / 2;
	let area = width * 0.7;
	let cellCount = 15;
	let cellSize = area / cellCount;
	for (let j = 0; j < cellCount; j++) {
		for (let i = 0; i < cellCount; i++) {
			let x = i * cellSize + (cellSize / 2) + (width - area) / 2;
			let y = j * cellSize + (cellSize / 2) + (height - area) / 2;
			let t = -int((x-y/1.9)/12);
			let clr = '#dddddd';
			shapes.push(new Core(x, y, cellSize * 0.5, t, clr));
		}
	}
}

function draw() {
	background('#1a1b1c');

	for (let s of shapes) {
		s.run();
	}
}

function easeInOutQuad(x) {
	return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

class Core {
	constructor(x, y, d, t, clr) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.clr = clr;
		this.reset();
		this.t = t;
		this.toggle = false;
	}

	reset() {
		this.movers = [];
		for (let i = 0; i < 10; i++) {
			this.movers.push(new Mover(this.x, this.y, this.d, this.clr));
		}
		this.toggle = false;
		this.t = 0;
		this.t1 = 120;
		this.t2 = this.t1 + this.movers[0].t1;
	}

	show() {
		for (let m of this.movers) {
			m.show();
		}
	}

	move() {
		for (let m of this.movers) {
			m.move(this.toggle);
		}
		if (this.t1 == this.t) {
			this.toggle = true;
		}

		if (this.t > this.t2) {
			this.reset();
		}
		this.t++;
	}

	run() {
		this.show();
		this.move();
	}
}

class Mover {
	constructor(x, y, d, clr) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.clr = clr
		this.clr1 = color(this.clr);
		this.clr2 = color(random(colors));
		this.t = 0;
		this.t1 = 80;
		this.w = this.d;
		this.h = this.d;
		this.ang = 0;
		this.direction = random([-1, 1]);
		this.r = this.d * random(0.25, 2);
		this.rot = random(TAU);
		this.dd = this.d * random(0.1, 1);
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.rot);
		translate(-this.r, 0);
		rotate(this.ang);
		noStroke();
		fill(this.clr);
		ellipse(this.r, 0, this.w, this.h);
		pop();
	}

	move(toggle) {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.ang = lerp(0, TAU * this.direction, easeInOutQuad(n));
			this.w = lerp(this.d, this.dd * 0.5, easeInOutQuad(sin(n * PI)));
			this.h = lerp(this.d, this.dd * 1.0, easeInOutQuad(sin(n * PI)));
			this.clr = lerpColor(this.clr1, this.clr2, easeInOutQuad(sin(n * PI)));
		}
		if (toggle) this.t++;
	}

	run() {
		this.show();
		this.move();
	}
}