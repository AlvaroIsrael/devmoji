import { ConventionalCommits } from "../src/conventional-commits"
import { Config } from "../src/config"
import { Devmoji } from "../src/devmoji"

test("no scope commit msg", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))
  expect(cc.formatCommit("feat: testing")).toBe("feat: ✨ testing")
})

test("invalid type commit msg", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))
  expect(cc.formatCommit("foo: testing")).toBe("foo: testing")
})

test("type with scope commit msg", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))
  expect(cc.formatCommit("feat(cli): testing")).toBe("feat(cli): ✨ testing")
})

test("type with scope release commit msg", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))
  expect(cc.formatCommit("chore(release): testing")).toBe(
    "chore(release): 🚀 testing"
  )
})

test("type with scope release commit msg and devmoji", () => {
  const dm = new Devmoji(new Config())
  const cc = new ConventionalCommits(dm)
  expect(cc.formatCommit("feat(security): testing")).toBe(
    dm.emojify("feat(security): :sparkles: :security: testing")
  )
})

test("invalid commit msg ", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))
  expect(cc.formatCommit("invalid commit")).toBe("invalid commit")
})

test("type with existing devmoji", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))
  expect(cc.formatCommit("feat(cli): :test: testing")).toBe(
    "feat(cli): ✨ 🚨 testing"
  )
})

test("log", () => {
  const cc = new ConventionalCommits(new Devmoji(new Config()))

  expect(
    cc.formatLog(
      `bla feat(cli): testing
bla bla feat: :test: testing
feat(cli): :sparkles: foo
chore(release): deploy
eat(cli): :test: testing`
    )
  ).toBe(`bla feat(cli): ✨ testing
bla bla feat: ✨ 🚨 testing
feat(cli): ✨ foo
chore(release): 🚀 deploy
eat(cli): 🚨 testing`)
})

test("should ", () => {
  const text =
    "* 8f16492 - feat(cli): ✨ added cli for working with devmoji 🚀 (19 hours ago) <Folke Lemaitre>"
  const cc = new ConventionalCommits(new Devmoji(new Config()))

  expect(cc.formatLog(text)).toBe(
    "* 8f16492 - feat(cli): ✨ added cli for working with devmoji 🚀 (19 hours ago) <Folke Lemaitre>"
  )
})

test("multi log & commit ", () => {
  const tests: [string, string][] = [
    ["feat(foo): testing", "feat(foo): :sparkles: testing"],
    ["foo(security): testing", "foo(security): :security: testing"],
    [
      "feat(test): :art: testing",
      "feat(test): :sparkles: :test: :art: testing",
    ],
    ["feat(foo): :art: testing", "feat(foo): :sparkles: :art: testing"],
    ["fix(security): testing", "fix(security): :bug: :security: testing"],

    ["feat(test): testing", "feat(test): :sparkles: :test: testing"],
    ["chore(deps): testing", "chore(deps): :chore-deps: testing"],
  ]
  const cc = new ConventionalCommits(new Devmoji(new Config()))

  for (let [input, output] of tests) {
    input += ""
    output = cc.devmoji.emojify(output)
    expect(cc.formatLog(input)).toBe(output)
    expect(cc.formatCommit(input)).toBe(output)
    expect(cc.formatCommit("not a header " + input)).toBe(
      cc.devmoji.emojify("not a header " + input)
    )
  }
})
