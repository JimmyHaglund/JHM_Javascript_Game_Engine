class WindowEvents {
   public readonly onWindowResize = new Action();

   constructor() {
      window.onresize = () => this.onWindowResize.invoke(window);
   }
}
const windowEvents = new WindowEvents();