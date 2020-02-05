function jhm_test() {
    test_entity();
    test_actionHandler();
    /*
    component_test();
    test_loop();
    test_boxColliderComponent();
    test_physicsSpace();
    test_simpleWalkjngPhysicsActor();
    test_renderSpace();
    test_spriteComponent();
    test_windowManager();
    */
    setTimeout(() => {
        console.log('Tests executed: ', testsRun);
        console.log('Tests succeeded: ', testsPassed);
        console.log('Tests failed: ', testsFailed);
        resetTestData();
    }, 1000);
}