class AimData {
    public aimStartAngle = Math.PI;
    public aimEndAngle = Math.PI * 0.33;
    public aimSeconds = 1.0;

    constructor(startAngle:number, endAngle:number, durationInSeconds:number){ 
        this.aimStartAngle = startAngle;
        this.aimEndAngle = endAngle;
        this.aimSeconds = durationInSeconds;
    }
}