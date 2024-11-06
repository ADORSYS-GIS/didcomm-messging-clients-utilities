import { describe, test } from "vitest";
import Mediation_Coordinaton from "../mediation-coordination";


describe("didcomm", () => {
  test("mediator coordination testing", async () => {
    const To: string[] = ["did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0"];
    
    let result = await Mediation_Coordinaton(To, To[0], "add")
    console.log(result)
  })
})