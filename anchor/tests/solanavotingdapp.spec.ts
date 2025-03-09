import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Solanavotingdapp } from "../target/types/solanavotingdapp";
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require("../target/idl/solanavotingdapp.json");

const solanavotingdappAddress = new PublicKey(
  "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"
);

describe("solanavotingdapp", () => {
  let context;
  let provider;
  let solanavotingdappProgram: Program<Solanavotingdapp>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "solanavotingdapp", programId: solanavotingdappAddress }],
      []
    );
    provider = new BankrunProvider(context);

    solanavotingdappProgram = new Program<Solanavotingdapp>(IDL, provider);
  });

  it("Initialize Poll", async () => {
    await solanavotingdappProgram.methods
      .initializePoll(
        new anchor.BN(1),
        "What is your favorite type of peanut butter?",
        new anchor.BN(0),
        new anchor.BN(1840718618)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      solanavotingdappAddress
    );

    const poll = await solanavotingdappProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.discription).toEqual(
      "What is your favorite type of peanut butter?"
    );
    expect(poll.startTime.toNumber()).toBeLessThan(poll.endTime.toNumber());
  });

  it("initialize candidate", async () => {
    await solanavotingdappProgram.methods
      .initializeCandidate("Smooth", new anchor.BN(1))
      .rpc();

    await solanavotingdappProgram.methods
      .initializeCandidate("Crunchy", new anchor.BN(1))
      .rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")],
      solanavotingdappAddress
    );

    const crunchyCandidate =
      await solanavotingdappProgram.account.candidate.fetch(crunchyAddress);

    console.log(crunchyCandidate);

    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      solanavotingdappAddress
    );

    const smoothCandidate =
      await solanavotingdappProgram.account.candidate.fetch(smoothAddress);

    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);
  });

  it("vote", async () => {
    await solanavotingdappProgram.methods
      .vote("Smooth", new anchor.BN(1))
      .rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      solanavotingdappAddress
    );

    const smoothCandidate =
      await solanavotingdappProgram.account.candidate.fetch(smoothAddress);

    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1);
  });
});
