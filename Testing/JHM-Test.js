function jhm_test(){
    test_actionHandler();
    test_loop();
    test_physicsSpace();
    test_window();
    test_windowManager();
    component_test();
    entity_test();
    setTimeout (() => {
    console.log('Tests executed: ', testsRun);
    console.log('Tests succeeded: ', testsPassed);
    console.log('Tests failed: ', testsFailed);
    resetTestData();
}, 1000);
}