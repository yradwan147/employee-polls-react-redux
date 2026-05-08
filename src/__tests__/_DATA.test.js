import { _saveQuestion, _saveQuestionAnswer, _getQuestions, _getUsers } from "../../_DATA";

jest.setTimeout(10_000);

describe("_DATA._saveQuestion", () => {
  test("returns the saved question with all expected fields when given valid input", async () => {
    const author = "sarahedo";
    const optionOneText = "have a fast car";
    const optionTwoText = "have a fast bike";

    const q = await _saveQuestion({ optionOneText, optionTwoText, author });

    expect(q).toMatchObject({
      author,
      optionOne: { text: optionOneText, votes: [] },
      optionTwo: { text: optionTwoText, votes: [] },
    });
    expect(typeof q.id).toBe("string");
    expect(q.id.length).toBeGreaterThan(0);
    expect(typeof q.timestamp).toBe("number");
    expect(q.timestamp).toBeLessThanOrEqual(Date.now());

    // It should also be retrievable from _getQuestions
    const all = await _getQuestions();
    expect(all[q.id]).toEqual(q);
  });

  test("rejects when any required field is missing", async () => {
    await expect(_saveQuestion({ optionOneText: "a", optionTwoText: "b" })).rejects.toMatch(/Please provide/);
    await expect(_saveQuestion({ optionOneText: "a", author: "sarahedo" })).rejects.toMatch(/Please provide/);
    await expect(_saveQuestion({ optionTwoText: "b", author: "sarahedo" })).rejects.toMatch(/Please provide/);
  });
});

describe("_DATA._saveQuestionAnswer", () => {
  test("resolves true when given valid (authedUser, qid, answer) triple", async () => {
    const allQ = await _getQuestions();
    const qid  = Object.keys(allQ)[0];
    const result = await _saveQuestionAnswer({ authedUser: "zoshikanlu", qid, answer: "optionOne" });
    expect(result).toBe(true);

    const users = await _getUsers();
    expect(users.zoshikanlu.answers[qid]).toBe("optionOne");
  });

  test("rejects when any of authedUser / qid / answer is missing", async () => {
    await expect(_saveQuestionAnswer({              qid: "x", answer: "optionOne" })).rejects.toMatch(/Please provide/);
    await expect(_saveQuestionAnswer({ authedUser: "z",       answer: "optionOne" })).rejects.toMatch(/Please provide/);
    await expect(_saveQuestionAnswer({ authedUser: "z", qid: "x"                  })).rejects.toMatch(/Please provide/);
  });
});
