class Gun {
    constructor(aim, shakerMaker, bullet) {
        this._onFire = new Action();
        this._onTakeAim = new Action();
        this._onStopAim = new Action();
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
        this._shootAudio = new AudioComponent("gunShoot");
        this._shootAudio.shouldLoop = false;
        this._takeAimAudio = new AudioComponent("aimStart");
        this._takeAimAudio.shouldLoop = false;
        this._bullet = bullet;
    }
    get onFire() { return this._onFire; }
    get onTakeAim() { return this._onTakeAim; }
    get onStopAim() { return this._onStopAim; }
    takeAim() {
        this._aim.startAim();
        this._onTakeAim.invoke();
        this._takeAimAudio.stopPlaying();
        this._takeAimAudio.play();
    }
    endAim() {
        this._aim.endAim();
        this._onStopAim.invoke();
    }
    discharge() {
        this.endAim();
        this._shakerMaker.MakeShake(1, 5, 15);
        this._shootAudio.stopPlaying();
        this._shootAudio.play();
        this.spawnBullet();
        this._onFire.invoke();
    }
    spawnBullet() {
        let direction = this._aim.getDirection();
        let transform = this._aim.transform;
        let startX = transform.worldX;
        let startY = transform.worldY;
        let dirNormalized = algebra.normalize(direction.x, direction.y);
        let speed = 1500;
        let distance = 5;
        let bulletX = startX + dirNormalized.x * distance;
        let bulletY = startY + dirNormalized.y * distance;
        this._bullet.rigidbody.velocity = {
            x: dirNormalized.x * speed,
            y: dirNormalized.y * speed
        };
        this._bullet.entity.x = bulletX;
        this._bullet.entity.y = bulletY;
        this._bullet.enable();
    }
}
