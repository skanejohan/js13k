var board = {
    // village = { pos, health, strength, radius }
    // trebuchet = { pos, health, strength, radius, state }
    villages: new Set(),
    trebuchets: new Set(),
    activeTrebuchet: undefined, // while in trebuchet range
    hoveredTrebuchet: undefined, // while over the trebuchet itself
    hoveredVillage: undefined, // while over the village itself
    animations: [{ state : AnimationState.NONE }],
    mousePos: undefined,

    __animation() { return this.animations[this.animations.length - 1] },
    __rndX() { return Math.floor(Math.random() * BoardWidth) },
    __rndY() { return Math.floor(Math.random() * BoardHeight) },
    __rndPos() { return { x: this.__rndX(), y : this.__rndY() } },
    __sqDist(p1, p2) { return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) },
    __dist(p1, p2) { return Math.sqrt(this.__sqDist(p1, p2)) },
    __inRange(p, t) { return this.__sqDist(p, t.pos) <= t.radius * t.radius },
    __over(p, t) { return this.__sqDist(p, t.pos) <= BaseRadius * BaseRadius },
    __villageInRange(t, v) { return this.__sqDist(t.pos, v.pos) <= t.radius * t.radius },
    __trebuchetInRange(v, t) { return this.__sqDist(t.pos, v.pos) <= v.radius * v.radius },

    // Village actions
    __createVillage() { return { pos: this.__rndPos(), health: 100, strength: 30, radius: 3 * BaseRadius } },
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
    __loadTrebuchet(t) { t.Strength = Math.min(t.strength + 20, 100) },
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

    __setFireOrDoneStateForActiveTrebuchet() {
        this.activeTrebuchet.state = TrebuchetState.DONE;
        for (const v of this.villages) {
            if (this.__villageInRange(this.activeTrebuchet, v)) {
                this.activeTrebuchet.state = TrebuchetState.FIRE;
                break;
            }
        }
    },

    __load() {
        this.__loadTrebuchet(this.activeTrebuchet);
        this.__setFireOrDoneStateForActiveTrebuchet();
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __move() {
        if (this.__canBePlacedAt(this.activeTrebuchet, this.mousePos)) {
            this.__moveTrebuchet(this.activeTrebuchet, this.mousePos);
            this.__setFireOrDoneStateForActiveTrebuchet();
            this.__attackWithVillagesWhenAllTrebuchetsDone();
        }
    },

    __fireAtVillage(t, v) {
        if (this.__villageInRange(t, v)) {
            this.__attackVillage(t, v);
        }
        t.state = TrebuchetState.DONE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtTrebuchet(v, t) {
        if (this.__trebuchetInRange(t, v)) {
            this.__attackTrebuchet(v, t);
        }
    },

    __attackWithVillagesWhenAllTrebuchetsDone() {
        for (const t of this.trebuchets) {
            if (t.state != TrebuchetState.DONE) {
                return;
            }
        }

        for (const v of this.villages) {
            for (const t of this.trebuchets) {
                if (v.health > 0 && this.__trebuchetInRange(v, t)) {
                    this.__startAnimation(AnimationState.HIGHLIGHT_ATTACKER, { from: v, to: t, trebuchetAttack: false });
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
        this.villages = new Set();
        this.trebuchets = new Set();
    
        while (this.villages.size < villageCount)
        {
            var v = this.__createVillage();
            if (this.__canBePlacedAt(v, v.pos)) {
                this.villages.add(v);
            }
        }
        while (this.trebuchets.size < trebuchetCount)
        {
            var t = this.__createTrebuchet();
            if (this.__canBePlacedAt(t, t.pos)) {
                this.trebuchets.add(t);
            }
        }
    },

    update(ms, mousePos) {
        this.__removeKilledVillages();
        this.__removeKilledTrebuchets();
        var animation = this.__animation();
        switch (animation.state) {
            case AnimationState.NONE:
                this.activeTrebuchet = undefined;
                this.hoveredTrebuchet = undefined;
                for (const t of this.trebuchets) {
                    if (this.__over(mousePos, t)) {
                        this.activeTrebuchet = t;
                        this.hoveredTrebuchet = t;
                    }
                }
                if (!this.activeTrebuchet) {
                    for (const t of this.trebuchets) {
                        if (this.__inRange(mousePos, t)) {
                            if (this.activeTrebuchet) { // in range of more than one trebuchet
                                this.activeTrebuchet = undefined;
                                break;
                            }
                            else {
                                this.activeTrebuchet = t;
                            }
                        } 
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
                    if (elapsedMs < 200) {
                        animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        this.__endAnimation();
                        this.__startAnimation(AnimationState.HIGHLIGHT_ATTACKEE, animation.data,
                            () => {
                                if (animation.data.trebuchetAttack) {
                                    this.__fireAtVillage(animation.data.from, animation.data.to);
                                }
                                else {
                                    this.__fireAtTrebuchet(animation.data.from, animation.data.to);
                                }
                            });
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
                else { 
                    this.__move();
                }
            }
            else if (this.activeTrebuchet.state == TrebuchetState.FIRE 
                     && this.hoveredVillage 
                     && this.__villageInRange(this.activeTrebuchet, this.hoveredVillage)) {
                        this.__startAnimation(
                            AnimationState.HIGHLIGHT_ATTACKER, 
                            { 
                                from: this.activeTrebuchet, 
                                to: this.hoveredVillage,
                                trebuchetAttack: true
                            });
                    }
        }
    },

    draw(drawSprite, drawText) {

        var drawRadiusScaledSprite = (sprite, pos, radius, alpha) => {
            drawSprite(sprite, pos, 2 * radius / 200, alpha);
        };

        this.villages.forEach(v => {
            drawRadiusScaledSprite(sprites.createRange(), v.pos, v.radius, 0.5);
        });

        this.trebuchets.forEach(t => {
            drawRadiusScaledSprite(sprites.createRange(), t.pos, t.radius, 0.5);
        });

        this.villages.forEach(v => {
            drawSprite(sprites.createVillage(v.health, v == this.hoveredVillage), v.pos, 0.5);
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
            drawSprite(sprites.createTrebuchet(t.health, t == this.hoveredTrebuchet), t.pos, 0.5);
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

        if (this.__animation().state == AnimationState.NONE) {
            if (this.activeTrebuchet) {
                if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                    if (this.hoveredTrebuchet) {
                        drawText("Click to load or hover over another cell to move", 600, 780);
                    }
                    else {
                        drawText("Click to move here", 600, 780);
                    }
                }
                if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                    if (this.hoveredVillage) {
                        drawText("Click to attack this village", 600, 780);
                    }
                    else {
                        drawText("Hover over a village to attack it", 600, 780);
                    }
                }
            }
        }
    },

    levelWon() {
        return this.villages.size == 0 && this.trebuchets.size > 0;
    },

    levelLost() {
        return this.trebuchets.size == 0;
    }
};
