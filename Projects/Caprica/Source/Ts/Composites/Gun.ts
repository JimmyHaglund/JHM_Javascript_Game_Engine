class Gun {
    private _onFire = new Action();
    private _onTakeAim = new Action();
    private _onStopAim = new Action();
    private _aim: AimController;
    private _shakerMaker: ShakerMaker;
    private _shootAudio: AudioComponent;
    private _takeAimAudio: AudioComponent;
    private _bullet: Bullet;

    public get onFire(): Action { return this._onFire; }
    public get onTakeAim(): Action { return this._onTakeAim; }
    public get onStopAim(): Action { return this._onStopAim; }

    constructor(aim: AimController, shakerMaker: ShakerMaker, bullet: Bullet) {
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

    public takeAim(): void {
        this._aim.startAim();
        this._onTakeAim.invoke();
        this._takeAimAudio.stopPlaying();
        this._takeAimAudio.play();
    }

    public endAim(): void {
        this._aim.endAim();
        this._onStopAim.invoke();
    }

    public discharge(): void {
        this.endAim();
        this._shakerMaker.MakeShake(1, 5, 15);
        this._shootAudio.stopPlaying();
        this._shootAudio.play();
        this.spawnBullet();
        this._onFire.invoke();
    }

    private spawnBullet(): void {
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