var board = {
    // village = { pos, strength, radius }
    // trebuchet = { pos, strength, radius, state }
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
        this.activeTrebuchet.strength += 1;
        this.activeTrebuchet.radius += BaseRadius;
        this.__setFireOrDoneStateForActiveTrebuchet();
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __move() {
        this.activeTrebuchet.pos = this.mousePos;
        //this.__increaseStrengthForNearTrebuchets();
        this.__setFireOrDoneStateForActiveTrebuchet();
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtVillage(t, v) {
        var distance = this.__dist(t.pos, v.pos);
        var power = t.radius - distance;
        if (power > 0) {
            t.radius -= power;
            v.radius -= power;
            if (v.radius <= 0) {
                this.villages.delete(v);
            }
        }
        t.state = TrebuchetState.DONE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtTrebuchet(t, v) {
        var distance = this.__dist(t.pos, v.pos);
        var power = v.radius - distance;
        if (power > 0) {
            v.radius -= power;
            t.radius -= power;
            if (t.radius <= 0) {
                this.trebuchets.delete(t);
            }
            return true;
        }
        return false;
    },

    __attackWithVillagesWhenAllTrebuchetsDone() {
        for (const t of this.trebuchets) {
            if (t.state != TrebuchetState.DONE) {
                return;
            }
        }

        // if a trebuchet is in range of a village, the village will attack it. If not, the village's strength increases
        var villageList = Array.from(this.villages);
        var trebuchetList = Array.from(this.trebuchets);
        for (var i = 0; i < villageList.length; i++) {
            var v = villageList[i];
            var hasHit = false;
            for (var j = 0; j < trebuchetList.length; j++) {
                var t = trebuchetList[j];
                hasHit |= this.__fireAtTrebuchet(t, v);
            }
            if (!hasHit) {
                v.radius += BaseRadius;
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
        var occupied = new Set();
    
        while (this.villages.size < villageCount)
        {
            var v = { pos: this.__rndPos(), strength: 2, radius: 2 * BaseRadius };
            if (!occupied.has(v.pos)) // TODO should be a smallest distance
            {
                this.villages.add(v);
                occupied.add(v.pos);
            }
        }
        while (this.trebuchets.size < trebuchetCount)
        {
            var t = { pos: this.__rndPos(), strength: 3, radius: 3 * BaseRadius , state: TrebuchetState.LOAD_OR_MOVE };
            if (!occupied.has(t.pos)) // TODO should be a smallest distance
            {
                this.trebuchets.add(t);
                occupied.add(t.pos);
            }
        }
    },

    update(ms, mousePos) {
        var animation = this.__animation();
        switch (animation.state) {
            case AnimationState.NONE:
                this.activeTrebuchet = undefined;
                this.hoveredTrebuchet = undefined;
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
                if (this.activeTrebuchet && this.__over(mousePos, this.activeTrebuchet)) {
                    this.hoveredTrebuchet = this.activeTrebuchet;
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
                            () => this.__fireAtVillage(animation.data.t, animation.data.v));
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
                        this.__startAnimation(AnimationState.HIGHLIGHT_ATTACKER, { t: this.activeTrebuchet, v: this.hoveredVillage});
                    }
        }
    },

    draw(drawSprite, drawText) {

        this.villages.forEach(v => {
            drawSprite(sprites("bg_village_range"), v.pos.x, v.pos.y, 2 * v.radius, 2 * v.radius, 0.5);
        });

        this.trebuchets.forEach(t => {
            drawSprite(sprites("bg_trebuchet_range"), t.pos.x, t.pos.y, 2 * t.radius, 2 * t.radius, 0.5);
        });

        this.villages.forEach(v => {
            drawSprite(sprites("bg_village"), v.pos.x, v.pos.y, 2 * BaseRadius, 2 * BaseRadius);
            if (v == this.hoveredVillage) {
                drawSprite(sprites("fg_village"), v.pos.x, v.pos.y, 2 * BaseRadius, 2 * BaseRadius);
            }
        });

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACK) {
            var t = this.__animation().data.t;
            var v = this.__animation().data.v;
            var percent = (this.__animation().elapsedMs || 0) / 200;
            var x = t.pos.x + (v.pos.x - t.pos.x) * percent; 
            var y = t.pos.y + (v.pos.y - t.pos.y) * percent; 
            drawSprite(sprites("attack"), x, y, 20, 20);
        }

        this.trebuchets.forEach(t => {
            drawSprite(sprites("bg_trebuchet"), t.pos.x, t.pos.y, 2 * BaseRadius, 2 * BaseRadius);
            if (t == this.hoveredTrebuchet) {
                drawSprite(sprites("fg_trebuchet"), t.pos.x, t.pos.y, 2 * BaseRadius, 2 * BaseRadius);
            }
        });

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACKER) {
            var t = this.__animation().data.t;
            var alpha = (this.__animation().elapsedMs || 0)  / 200;
            if (alpha > 0) {
                drawSprite(sprites("bg_highlight"), t.pos.x, t.pos.y, 2 * BaseRadius, 2 * BaseRadius, alpha);
            }
        }

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACK) {
            var t = this.__animation().data.t;
            var v = this.__animation().data.v;
            var percent = (this.__animation().elapsedMs || 0) / 200;
            var alpha = 1 - percent;
            if (alpha > 0) {
                drawSprite(sprites("bg_highlight"), t.pos.x, t.pos.y, 2 * BaseRadius, 2 * BaseRadius, alpha);
            }
        }

        if (this.__animation().state == AnimationState.HIGHLIGHT_ATTACKEE) {
            var v = this.__animation().data.v;
            var alpha = (this.__animation().elapsedMs || 0) / 200;
            if (t > 200) {
                alpha = 1 - alpha;
            }
            if (alpha > 0) {
                drawSprite(sprites("bg_highlight"), v.pos.x, v.pos.y, 2 * BaseRadius, 2 * BaseRadius, alpha);
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
