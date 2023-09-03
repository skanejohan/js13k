var board = {
    // village = { pos, health, strength }
    // trebuchet = { pos, health, strength, radius, state }
    villages: new Set(),
    trebuchets: new Set(),
    activeTrebuchet: undefined, 
    hoveredTrebuchet: undefined, // while over the trebuchet itself
    hoveredVillage: undefined, // while over the village itself
    animations: [{ state : AnimationState.NONE }],
    mousePos: undefined,
    levelScore: 0,
    score: 0,
    level: 0,

    __rnd(n) { return Math.floor(Math.random() * n) },
    __animation() { return this.animations[this.animations.length - 1] },
    __rndPos() { return { x: 100 + this.__rnd(1000), y : 100 + this.__rnd(600) } },
    __sqDist(p1, p2) { return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) },
    __dist(p1, p2) { return Math.sqrt(this.__sqDist(p1, p2)) },
    __inRange(p, t) { return this.__sqDist(p, t.pos) <= t.radius * t.radius },
    __over(p, t) { return this.__sqDist(p, t.pos) <= BaseRadius * BaseRadius },
    __changeOfHit(from, to) { var d = this.__dist(from.pos, to.pos); return Math.min(100, Math.max(0, (700 - d) / 5.5)); },

    // Village actions
    __createVillage() { return { pos: this.__rndPos(), health: 100, strength: Math.round(30 + ((3 * this.level) * this.__rnd(100)) / 100) } },
    __attackTrebuchet(v, t) { t.health -= v.strength },
    __updateVillage(v) { },
    __removeKilledVillages() {
        var vs = Array.from(this.villages);
        for (var i = 0; i < vs.length; i++) {
            if (vs[i].health <= 0) {
                this.villages.delete(vs[i]);
            }
        }
    },

    // Trebuchet actions
    __createTrebuchet() { return { pos: this.__rndPos(), health: 100, strength: 50, radius: 4 * BaseRadius , state: TrebuchetState.LOAD_OR_MOVE } },
    __attackVillage(t, v) { v.health -= t.strength },
    __loadTrebuchet(t) { t.strength = Math.min(t.strength + 20, 100) },
    __moveTrebuchet(t, pos) { t.pos = pos },
    __removeKilledTrebuchets() {
        var ts = Array.from(this.trebuchets);
        for (var i = 0; i < ts.length; i++) {
            if (ts[i].health <= 0) {
                this.trebuchets.delete(ts[i]);
            }
        }
    },

    __canBePlacedAt(item, pos) {
        for (const v of this.villages) {
            var d = this.__dist(v, pos);
            if (v != item && this.__dist(v.pos, pos) < 2.3 * BaseRadius) {
                return false;
            }
        }
        for (const t of this.trebuchets) {
            if (t != item && this.__dist(t.pos, pos) < 2.3 * BaseRadius) {
                return false;
            }
        }
        return true;
    },

    __load() {
        this.__loadTrebuchet(this.activeTrebuchet);
        this.activeTrebuchet.state = TrebuchetState.FIRE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __move() {
        if (this.__canBePlacedAt(this.activeTrebuchet, this.mousePos)) {
            this.__moveTrebuchet(this.activeTrebuchet, this.mousePos);
            this.activeTrebuchet.state = TrebuchetState.FIRE;
            this.__attackWithVillagesWhenAllTrebuchetsDone();
        }
    },

    __fireAtVillage(t, v) {
        this.__attackVillage(t, v);
        t.state = TrebuchetState.DONE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtTrebuchet(v, t) {
        this.__attackTrebuchet(v, t);
    },

    __attackWithVillagesWhenAllTrebuchetsDone() {
        for (const t of this.trebuchets) {
            if (t.state != TrebuchetState.DONE) {
                return;
            }
        }

        for (const v of this.villages) {
            for (const t of this.trebuchets) {
                if (t.health > 0)
                {
                    if (v.health > 0) {
                        if (this.__rnd(100) < this.__changeOfHit(v, t)) {
                            this.__startAnimation(AnimationState.HIGHLIGHT_ATTACKER, { from: v, to: t, attackType: AttackType.VILLAGE_ATTACKS_TREBUCHET });
                        }
                        else {
                            this.__startAnimation(AnimationState.HIGHLIGHT_ATTACKER, { from: v, to: t, attackType: AttackType.VILLAGE_MISSES_TREBUCHET });
                        }
                    }
                }
            }
        }

        for (var t of this.trebuchets) {
            t.state = TrebuchetState.LOAD_OR_MOVE;
        }
    },

    __startAnimation(animationState, data, nextFn) {
        this.animations.push( { state : animationState, nextFn: nextFn, data: data });
    },

    __endAnimation() {
        var a = this.animations.pop();
        if (a.nextFn) {
            a.nextFn();
        }
    },
    
    reset(villageCount, trebuchetCount) {
        var noOfVillages = villageCount + this.__rnd(2);
        var noOfTrebuchets = trebuchetCount + this.__rnd(2);

        this.villages = new Set();
        this.trebuchets = new Set();
    
        while (this.villages.size < noOfVillages)
        {
            var v = this.__createVillage();
            if (this.__canBePlacedAt(v, v.pos)) {
                this.villages.add(v);
            }
        }
        while (this.trebuchets.size < noOfTrebuchets)
        {
            var t = this.__createTrebuchet();
            if (this.__canBePlacedAt(t, t.pos)) {
                this.trebuchets.add(t);
            }
        }

        this.levelScore = 100 + (noOfVillages - noOfTrebuchets) * 25;
        this.level++;
    },

    update(ms, mousePos) {
        this.__removeKilledVillages();
        this.__removeKilledTrebuchets();
        var animation = this.__animation();
        switch (animation.state) {
            case AnimationState.NONE:
                this.hoveredTrebuchet = undefined;
                for (const t of this.trebuchets) {
                    if (this.__over(mousePos, t)) {
                        this.activeTrebuchet = t;
                        this.hoveredTrebuchet = t;
                    }
                }

                this.hoveredVillage = undefined;
                for (const v of this.villages) {
                    if (this.__over(mousePos, v)) {
                        this.hoveredVillage = v;
                        break;
                    }
                }
                break;
                case AnimationState.HIGHLIGHT_ATTACKER:
                    var elapsedMs = animation.elapsedMs || 0;
                    if (elapsedMs < 200) {
                        animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        this.__endAnimation();
                        this.__startAnimation(AnimationState.HIGHLIGHT_ATTACK, animation.data)
                    }
                    break;
                case AnimationState.HIGHLIGHT_ATTACK:
                    var elapsedMs = animation.elapsedMs || 0;
                    var maxMS = animation.data.attackType == AttackType.TREBUCHET_MISSES_VILLAGE || animation.data.attackType == AttackType.VILLAGE_MISSES_TREBUCHET
                        ? 300 : 200;
                    if (elapsedMs < maxMS) {
                        animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        this.__endAnimation();
                        if (animation.data.attackType == AttackType.TREBUCHET_MISSES_VILLAGE) {
                            animation.data.from.state = TrebuchetState.DONE;
                            this.__attackWithVillagesWhenAllTrebuchetsDone();
                        }
                        else if (animation.data.attackType == AttackType.VILLAGE_MISSES_TREBUCHET) {
                            // nothing
                        }
                        else {
                            this.__startAnimation(AnimationState.HIGHLIGHT_ATTACKEE, animation.data,
                                () => {
                                    if (animation.data.attackType == AttackType.TREBUCHET_ATTACKS_VILLAGE) {
                                        this.__fireAtVillage(animation.data.from, animation.data.to);
                                    }
                                    else { // AttackType.VILLAGE_ATTACKS_TREBUCHET
                                        this.__fireAtTrebuchet(animation.data.from, animation.data.to);
                                    }
                                });
                            }
                    }
                    break;
                case AnimationState.HIGHLIGHT_ATTACKEE:
                    var elapsedMs = animation.elapsedMs || 0;
                    if (elapsedMs < 400) {
                        animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        this.__endAnimation();
                    }
                break;
        }

        this.mousePos = mousePos;
    },

    click() {
        if (this.__animation().state != AnimationState.NONE) {
            return;
        }

        if (this.activeTrebuchet) {
            if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                if (this.hoveredTrebuchet) { 
                    this.__load();
                }
                else if (this.__inRange(this.mousePos, this.activeTrebuchet)) { 
                    this.__move();
                }
            }
            else if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                if (this.hoveredVillage) {
                    if (this.__rnd(100) < this.__changeOfHit(this.activeTrebuchet, this.hoveredVillage)) {
                        this.__startAnimation(
                            AnimationState.HIGHLIGHT_ATTACKER, 
                            { 
                                from: this.activeTrebuchet, 
                                to: this.hoveredVillage,
                                attackType: AttackType.TREBUCHET_ATTACKS_VILLAGE
                            });
                    }
                    else {
                        this.__startAnimation(
                            AnimationState.HIGHLIGHT_ATTACKER, 
                            { 
                                from: this.activeTrebuchet, 
                                to: this.hoveredVillage,
                                attackType: AttackType.TREBUCHET_MISSES_VILLAGE
                            });
                    }
                }
                else {
                    this.activeTrebuchet.state = TrebuchetState.DONE;
                    this.__attackWithVillagesWhenAllTrebuchetsDone();
                }
            } 
        }
    },

    draw(drawSprite) {

        var drawRadiusScaledSprite = (sprite, pos, radius, alpha) => {
            drawSprite(sprite, pos, 2 * radius / 200, alpha);
        };

        if (this.activeTrebuchet && this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
            drawRadiusScaledSprite(sprites.createRange(), this.activeTrebuchet.pos, this.activeTrebuchet.radius, 0.5);
        }

        this.villages.forEach(v => {
            drawSprite(sprites.createVillage(v.health, false), v.pos, 0.5);
            if (v == this.hoveredVillage) {
                drawing.circle(v.pos.x, v.pos.y, 50, "gray", v.strength / 10);
            }
        });

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACK) {
            var from = this.__animation().data.from;
            var to = this.__animation().data.to;
            var percent = (this.__animation().elapsedMs || 0) / 200;
            var pos = {
                x: from.pos.x + (to.pos.x - from.pos.x) * percent,
                y: from.pos.y + (to.pos.y - from.pos.y) * percent
            }
            drawSprite(sprites.createAttack(), pos);
        }

        this.trebuchets.forEach(t => {
            drawSprite(sprites.createTrebuchet(t.health, t.state == TrebuchetState.DONE), t.pos, 0.5);
            if (t == this.activeTrebuchet) {
                drawing.circle(t.pos.x, t.pos.y, 50, "gray", t.strength / 10);
            }
        });

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACKER) {
            var from = this.__animation().data.from;
            var alpha = (this.__animation().elapsedMs || 0)  / 200;
            if (alpha > 0) {
                drawSprite(sprites.createHighlight(), from.pos, 0.5, alpha);
            }
        }

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACK) {
            var from = this.__animation().data.from;
            var percent = (this.__animation().elapsedMs || 0) / 200;
            var alpha = 1 - percent;
            if (alpha > 0) {
                drawSprite(sprites.createHighlight(), from.pos, 0.5, alpha);
            }
        }

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACKEE) {
            var to = this.__animation().data.to;
            var alpha = (this.__animation().elapsedMs || 0) / 200;
            if (this.__animation().elapsedMs > 200) {
                alpha = 1 - alpha;
            }
            if (alpha > 0) {
                drawSprite(sprites.createHighlight(), to.pos, 0.5, alpha);
            }
        }

        // Draw upper info bar
        drawing.fillRect(0, 0, 1200, 40, "#2d4f18");
        drawing.fillText(`Level score: ${this.levelScore}`, 20, 28);
        drawing.fillText(`Score: ${this.score}`, 600, 28, {textAlign: "center"});
        if (this.hoveredTrebuchet || this.hoveredVillage) {
            var s = this.hoveredTrebuchet ? this.hoveredTrebuchet.strength : this.hoveredVillage.strength;
            var h = this.hoveredTrebuchet ? this.hoveredTrebuchet.health : this.hoveredVillage.health;
            drawing.fillText(`Strength: ${s}`, 1040, 28, {textAlign: "right"});
            drawing.fillText(`Health: ${h}`, 1180, 28, {textAlign: "right"});
        }

        // Draw lower info bar
        drawing.fillRect(0, 760, 1200, 40, "#2d4f18");

        if (this.activeTrebuchet) {
            if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                if (this.hoveredTrebuchet) {
                    drawing.fillText("Click here to load or hover outside the trebuchet to move", 600, 788, {textAlign: "center"});
                }
                else if (this.__inRange(this.mousePos, this.activeTrebuchet)) {
                    drawing.fillText("Click to move here", 600, 788, {textAlign: "center"});
                }
            }
            if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                if (this.hoveredVillage) {
                    var c = Math.round(this.__changeOfHit(this.activeTrebuchet, this.hoveredVillage));
                    drawing.fillText(`Click to attack this village. Chance: ${c} %`, 600, 788, {textAlign: "center"});
                }
                else {
                    drawing.fillText("Hover over a village to attack it or click here to skip the attack phase", 600, 788, {textAlign: "center"});
                }
            }
        }
    },

    updateScore() {
        this.score += this.levelScore;
    },

    levelWon() {
        return this.villages.size == 0 && this.trebuchets.size > 0;
    },

    levelLost() {
        return this.trebuchets.size == 0;
    }
};
