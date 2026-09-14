import {
  explorerStorage,
  getCompletedSessionIds,
  getProgramProgress,
  markSessionCompleted,
  resetProgramProgress,
} from "../progress";

beforeEach(() => {
  explorerStorage.clearAll();
});

describe("program progress", () => {
  it("tracks valid completed sessions independently per program", () => {
    markSessionCompleted("begin-again", "arrive");
    markSessionCompleted("steady-breath", "counting");

    expect(getCompletedSessionIds("begin-again")).toEqual(["arrive"]);
    expect(getCompletedSessionIds("steady-breath")).toEqual(["counting"]);
    expect(getProgramProgress("begin-again")).toEqual({
      completed: 1,
      total: 3,
      isComplete: false,
    });
  });

  it("ignores unknown program sessions", () => {
    markSessionCompleted("begin-again", "not-a-session");

    expect(getCompletedSessionIds("begin-again")).toEqual([]);
  });

  it("resets one program without touching another", () => {
    markSessionCompleted("begin-again", "arrive");
    markSessionCompleted("steady-breath", "counting");

    resetProgramProgress("begin-again");

    expect(getCompletedSessionIds("begin-again")).toEqual([]);
    expect(getCompletedSessionIds("steady-breath")).toEqual(["counting"]);
  });
});
