function test_actionHandler(){
    actionTester.added_action_should_execute();
    actionTester.removed_action_should_not_execute();
}
function TestCounter(){
    let a = 0;
    class testCounter{

        constructor(){
        }
        add(){
            a++;
        }
        get num() {
            return a;
        }
    }
    return new testCounter();
}
const actionTester = {
    added_action_should_execute: function() {
        let action = new Action();
        let counter = new TestCounter();
        action.add(counter.add);
        action.invoke();
        describe("action.invoke()", () => 
            it("should execute subscribed actions", () =>
                is.equal(counter.num, 1)));
    },
    removed_action_should_not_execute: function(){
        let action = new Action();
        let counter = new TestCounter();
        action.add(counter.add);
        action.invoke();
        action.remove(counter.add);
        action.invoke();
        describe("action.invoke()", () => 
            it("should not invoke actions that have been removed", () =>
                is.equal(counter.num, 1)));
    }
};