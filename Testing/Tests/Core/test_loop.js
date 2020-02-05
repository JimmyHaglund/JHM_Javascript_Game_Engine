function test_loop(){
    loopTester.default_loop_has_60_ticks_per_second();
    loopTester.loop_initialized_with_100_ticks_per_second_should_have_100_ticks_per_second();
    loopTester.default_loop_should_run_at_least_30_updates_in_zero_point_six_seconds();
    loopTester.should_stop_updating_when_ticks_per_second_is_zero_or_below();
    loopTester.should_start_updating_when_ticks_per_second_is_increased_above_zero();
    loopTester.should_return_playing_false_when_not_playing();
    loopTester.should_return_playing_true_when_playing();
}

const loopTester = {
    default_loop_has_60_ticks_per_second: function() {
        let loop = new Loop();
        describe("Loop.ticksPerSecond()", () => 
            it("Should have 60 ticks per second", () =>
                is.equal(loop.ticksPerSecond, 60)));
    },
    loop_initialized_with_100_ticks_per_second_should_have_100_ticks_per_second: function(){
        let loop = new Loop(100);
        describe("Loop.ticksPerSecond()", () => 
            it("Should have 100 ticks per second", () =>
                is.equal(loop.ticksPerSecond, 100)));
    },
    default_loop_should_run_at_least_30_updates_in_zero_point_six_seconds(){
        let loop = new Loop();
        let updatesRun = 0;
        let increase = function() {
            updatesRun++;
        };
        let id= loop.onUpdate.add(increase, this);
        setTimeout(() => {
            loop.onUpdate.remove(id);
            describe("loop.update()", () => 
                it("update should run at least 30 times in 0.6 seconds", () =>
                    is.greaterThanOrEqual(updatesRun, 30)));
        }, 600);

    },
    should_stop_updating_when_ticks_per_second_is_zero_or_below(){
        let loop = new Loop();
        let updatesRun = false;
        let setTrue = function() {
            updatesRun = true;
        };
        let id = loop.onUpdate.add(setTrue, this);
        setTimeout(() => {
            loop.ticksPerSecond = 0;
            updatesRun = false;
            setTimeout(() => {
                loop.onUpdate.remove(id);
                describe("Loop updating", () => 
                    it("should stop if update time is 0", () =>
                        is.equal(updatesRun, false)));
            }, 100);
        }, 100);
    },
    should_start_updating_when_ticks_per_second_is_increased_above_zero() {
        let loop = new Loop(0);
        let updatesRun = false;
        let setTrue = function() {
            updatesRun = true;
        };
        loop.onUpdate.add(setTrue);
        setTimeout(() => {
            loop.ticksPerSecond = 60;
            setTimeout(() => {
                loop.onUpdate.remove(setTrue);
                describe("Loop updating", () => 
                    it("should start when increased over zero", () =>
                        is.equal(updatesRun, true)));
            }, 100);
        }, 100);
    },
    should_return_playing_false_when_not_playing(){
        let loop = new Loop(60, true);
        let updatesRun = false;
        let setTrue = function() {
            updatesRun = true;
        };
        let id = loop.onUpdate.add(setTrue, this);
        setTimeout(() => {
            loop.onUpdate.remove(id);
            describe("loop.playing", () => 
                it("should return false when paused", () =>
                    is.equal(loop.playing, updatesRun)));
        }, 100);
    },
    should_return_playing_true_when_playing(){
        let loop = new Loop(10, false);
        let updatesRun = false;
        let setTrue = function() {
            updatesRun = true;
        };
        let id = loop.onUpdate.add(setTrue, this);
        setTimeout(() => {
            loop.onUpdate.remove(id);
            describe("loop.playing", () => 
                it("should return true when updating", () =>
                    is.equal(loop.playing, updatesRun)));
        }, 100);
    }
};