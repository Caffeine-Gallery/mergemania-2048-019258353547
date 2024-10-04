import Int "mo:base/Int";
import Nat "mo:base/Nat";

actor TwoThousandFortyEight {
  stable var bestScore : Nat = 0;

  public func updateBestScore(score : Nat) : async Nat {
    if (score > bestScore) {
      bestScore := score;
    };
    bestScore
  };

  public query func getBestScore() : async Nat {
    bestScore
  };
}
