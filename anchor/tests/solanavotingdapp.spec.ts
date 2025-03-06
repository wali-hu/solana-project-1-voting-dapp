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
  it("Initialize Poll", async () => {
    const context = await startAnchor(
      "",
      [{ name: "solanavotingdapp", programId: solanavotingdappAddress }],
      []
    );
    const provider = new BankrunProvider(context);

    const solanavotingdappProgram = new Program<Solanavotingdapp>(
      IDL,
      provider
    );

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
    expect(poll.disctription).toEqual(
      "What is your favorite type of peanut butter?"
    );
    expect(poll.startTime.toNumber()).toBeLessThan(poll.endTime.toNumber());
  });
});
