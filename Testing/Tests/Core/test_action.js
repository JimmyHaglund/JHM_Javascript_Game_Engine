function test_action(){
    actionTester.added_action_should_execute_when_invoke_is_called();
    actionTester.removed_action_should_not_execute();
}
const actionTester = {
    added_action_should_execute_when_invoke_is_called: function() {
        let action = new Action();
        let counter = {
            n: 0,
            add: function() {this.n++}
        };
        action.add(counter.add, counter);
        action.invoke();
        describe("Action.invoke()", () => 
            it("should execute subscribed actions", () =>
                is.equal(counter.n, 1)));
    },
    removed_action_should_not_execute: function(){
        let action = new Action();
        let counter = {
            n: 0,
            add: function() {this.n++}
        };
        let actionId = action.add(counter.add, counter);
        action.remove(actionId);
        action.invoke();
        describe("Action.invoke()", () => 
            it("should not invoke actions that have been removed", () =>
                is.equal(counter.n, 0)));
    }
};