import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { Screen, playersData, home, somePage, otherPage, teamsData } from "./screen"
import * as shared from "./shared.e2e-spec"

const time = 1;
const appSuspendResume = true;

const transitions = ["Default", "None", "Slide", "Flip"];

describe("layout-root:", () => {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async () => {
        driver = await createDriver();
        screen = new Screen(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    transitions.forEach(transition => {
        const playerOne = playersData[`playerOne${transition}`];
        const playerTwo = playersData[`playerTwo${transition}`];
        const teamOne = teamsData[`teamOne${transition}`];

        describe(`transition: ${transition} scenarios:`, () => {

            afterEach(async function () {
                if (this.currentTest.state === "failed") {
                    await driver.logTestArtifacts(this.currentTest.title);
                }
            });

            it("loaded home page", async () => {
                await screen.loadedHome();
            });
        
            it("loaded layout root with nested frames", async () => {
                await screen.navigateToLayoutWithFrame();
                await screen.loadedLayoutWithFrame();
            });
        
            it("loaded players list", async () => {
                await screen.loadedPlayersList();
            });
        
            it("loaded player details and go back twice", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerTwo.name) // wait for player
                }

                await shared.testPlayerNavigatedBack(screen, driver);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerOne.name); // wait for players list
                }

                await shared.testPlayerNavigated(playerTwo, screen);
                await shared.testPlayerNavigatedBack(screen, driver);
            });
        
            it("navigate parent frame and go back", async () => {
                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(somePage); // wait for some page
                }

                await driver.navBack(); // some page back navigation
                await screen.loadedPlayersList();
            });
        
            it("loaded player details and navigate parent frame and go back", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerTwo.name); // wait for player
                }
                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                await driver.navBack(); // some page back navigation
                await screen.loadedPlayerDetails(playerTwo);
        
                await screen.goBackToPlayersList();
                await screen.loadedPlayersList();
            });
        
            it("loaded home page again", async () => {
                await screen.resetToHome();
                await screen.loadedHome();

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(home); // wait for home page
                }
            });
        
            it("loaded layout root with multi nested frames", async () => {
                await screen.navigateToLayoutWithMultiFrame();
                await screen.loadedLayoutWithMultiFrame();
            });
        
            it("loaded players list", async () => {
                await screen.loadedPlayersList();
            });
        
            it("loaded teams list", async () => {
                await screen.loadedTeamsList();
            });
        
            it("loaded player details and go back twice", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerTwo.name) // wait for player
                }

                await shared.testPlayerNavigatedBack(screen, driver);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerOne.name) // wait for players list
                }
        
                await shared.testPlayerNavigated(playerTwo, screen);
                await shared.testPlayerNavigatedBack(screen, driver);
            });
        
            it("navigate players parent frame and go back", async () => {
                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(somePage); // wait for some page
                }
                
                await driver.navBack(); // some page back navigation
                await screen.loadedPlayersList();
            });
        
            it("loaded players details and navigate parent frame and go back", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerTwo.name); // wait for player
                }

                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                await driver.navBack(); // some page back navigation
                await screen.loadedPlayerDetails(playerTwo);
        
                await screen.goBackToPlayersList();
                await screen.loadedPlayersList();
            });
        
            it("loaded layout root with multi nested frames again", async () => {
                await screen.loadedLayoutWithMultiFrame();
            });
        
            it("loaded players list", async () => {
                await screen.loadedPlayersList();
            });
        
            it("loaded teams list", async () => {
                await screen.loadedTeamsList();
            });
        
            it ("mix player and team list actions and go back", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerTwo.name); // wait for player
                }
        
                await shared[`testOtherPageNavigated${transition}`](screen); // "teams" parent frame navigation
                
                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(otherPage); // wait for other page
                }

                await screen.loadedPlayerDetails(playerTwo);  // assert no changes in the sibling frame
        
                await driver.navBack(); // other page back navigation

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(teamOne.name); // wait for teams list
                }

                await screen.loadedTeamsList();
                await screen.loadedPlayerDetails(playerTwo);  // assert no changes in the sibling frame
        
                await shared[`testOtherPageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(otherPage); // wait for other page
                }

                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(somePage); // wait for some page
                }

                await screen.loadedOtherPage(); // assert no changes in the sibling frame
        
                await driver.navBack(); // some page back navigation
                await screen.loadedPlayerDetails(playerTwo);
        
                await screen.goBackToPlayersList();
                await screen.loadedPlayersList();

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(playerOne.name); // wait for players list
                }
        
                await screen.goBackFromOtherPage();

                if (appSuspendResume) {
                    await driver.backgroundApp(time);
                    await driver.waitForElement(teamOne.name); // wait for team
                }

                await screen.loadedTeamsList();
            });

            it("loaded home page again", async () => {
                await screen.resetToHome();
                await screen.loadedHome();
            });
        });
    });

    describe("players list slide transition with parent frame default transition:", () => {
        const playerOne = playersData["playerOneSlide"];
        const playerTwo = playersData["playerTwoSlide"];

        it("loaded layout root with nested frames", async () => {
            await screen.navigateToLayoutWithFrame();
            await screen.loadedLayoutWithFrame();
        });
    
        it("loaded players list", async () => {
            await screen.loadedPlayersList();
        });

        it("loaded player details with slide", async () => {
            await shared.testPlayerNavigated(playerTwo, screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }
        });
    
        it("navigate parent frame and go back", async () => {
            await shared.testSomePageNavigatedDefault(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(somePage); // wait for some page
            }
    
            await driver.navBack(); // some page back navigation

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }

            await screen.loadedPlayerDetails(playerTwo);
        });

        it("loaded player list", async () => {
            await screen.goBackToPlayersList();

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerOne.name); // wait for players list
            }
        });

        it("loaded home page again", async () => {
            await screen.resetToHome();
            await screen.loadedHome();
        });
    });

    describe("players list slide transition with parent frame no transition:", () => {
        const playerOne = playersData["playerOneSlide"];
        const playerTwo = playersData["playerTwoSlide"];

        it("loaded layout root with nested frames", async () => {
            await screen.navigateToLayoutWithFrame();
            await screen.loadedLayoutWithFrame();
        });
    
        it("loaded players list", async () => {
            await screen.loadedPlayersList();
        });

        it("loaded player details with slide", async () => {
            await shared.testPlayerNavigated(playerTwo, screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }
        });
    
        it("navigate parent frame and go back", async () => {
            await shared.testSomePageNavigatedNone(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(somePage); // wait for some page
            }
    
            await driver.navBack(); // some page back navigation

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }

            await screen.loadedPlayerDetails(playerTwo);
        });

        it("loaded player list", async () => {
            await screen.goBackToPlayersList();

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerOne.name); // wait for players list
            }
        });

        it("loaded home page again", async () => {
            await screen.resetToHome();
            await screen.loadedHome();
        });
    });

    describe("players list flip transition with parent frame default transition:", () => {
        const playerOne = playersData["playerOneFlip"];
        const playerTwo = playersData["playerTwoFlip"];

        it("loaded layout root with nested frames", async () => {
            await screen.navigateToLayoutWithFrame();
            await screen.loadedLayoutWithFrame();
        });
    
        it("loaded players list", async () => {
            await screen.loadedPlayersList();
        });

        it("loaded player details with slide", async () => {
            await shared.testPlayerNavigated(playerTwo, screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }
        });
    
        it("navigate parent frame and go back", async () => {
            await shared.testSomePageNavigatedDefault(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(somePage); // wait for some page
            }
    
            await driver.navBack(); // some page back navigation

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }

            await screen.loadedPlayerDetails(playerTwo);
        });

        it("loaded player list", async () => {
            await screen.goBackToPlayersList();

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerOne.name); // wait for players list
            }
        });

        it("loaded home page again", async () => {
            await screen.resetToHome();
            await screen.loadedHome();
        });
    });

    describe("players list flip transition with parent frame no transition:", () => {
        const playerOne = playersData["playerOneFlip"];
        const playerTwo = playersData["playerTwoFlip"];

        it("loaded layout root with nested frames", async () => {
            await screen.navigateToLayoutWithFrame();
            await screen.loadedLayoutWithFrame();
        });
    
        it("loaded players list", async () => {
            await screen.loadedPlayersList();
        });

        it("loaded player details with slide", async () => {
            await shared.testPlayerNavigated(playerTwo, screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }
        });
    
        it("navigate parent frame and go back", async () => {
            await shared.testSomePageNavigatedNone(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(somePage); // wait for some page
            }
    
            await driver.navBack(); // some page back navigation

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerTwo.name); // wait for player
            }

            await screen.loadedPlayerDetails(playerTwo);
        });

        it("loaded player list", async () => {
            await screen.goBackToPlayersList();

            if (appSuspendResume) {
                await driver.backgroundApp(time);
                await driver.waitForElement(playerOne.name); // wait for players list
            }
        });

        it("loaded home page again", async () => {
            await screen.resetToHome();
            await screen.loadedHome();
        });
    });
});
