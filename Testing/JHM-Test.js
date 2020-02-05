function jhm_test(){
    test_action();
    test_entity();
    test_loop();
    test_boxColliderComponent();
    test_physicsSpace();
    test_simpleWalkjngPhysicsActor();
    test_spriteComponent();
    test_renderSpace();
    setTimeout (() => {
    console.log('Tests executed: ', testsRun);
    console.log('Tests succeeded: ', testsPassed);
    console.log('Tests failed: ', testsFailed);
    resetTestData();
}, 1000);
}