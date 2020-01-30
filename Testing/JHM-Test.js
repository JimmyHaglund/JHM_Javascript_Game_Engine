function jhm_test(){
    test_loop();
    test_physicsSpace();
    test_window();
    test_windowManager();
    component_test();
    entity_test();
    one_test();
    setTimeout (() => {
    console.log('Tests executed: ', testsRun);
    console.log('Tests succeeded: ', testsPassed);
    console.log('Tests failed: ', testsFailed);
    resetTestData();
}, 1000);
}