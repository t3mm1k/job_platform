import { sortChatsByRecent, withStringMessageIds } from "./chatHelpers";

describe("sortChatsByRecent", () => {
  it("sorts by last_message.timestamp descending", () => {
    const chats = [
      { _id: "a", last_message: { timestamp: 100 } },
      { _id: "b", last_message: { timestamp: 300 } },
      { _id: "c", created_at: 200 }
    ];
    const sorted = sortChatsByRecent(chats);
    expect(sorted.map(c => c._id)).toEqual(["b", "c", "a"]);
  });

  it("handles null input", () => {
    expect(sortChatsByRecent(null)).toEqual([]);
  });
});

describe("withStringMessageIds", () => {
  it("maps _id to string id", () => {
    expect(
      withStringMessageIds([
        { _id: 1, text: "a" },
        { _id: "x", text: "b" }
      ])
    ).toEqual([
      { _id: 1, text: "a", id: "1" },
      { _id: "x", text: "b", id: "x" }
    ]);
  });

  it("handles null", () => {
    expect(withStringMessageIds(null)).toEqual([]);
  });
});
