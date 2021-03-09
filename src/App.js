import React, { Component } from "react";
import web3 from "./web3";
import lottery from "./lottery";

// function App() {
//   const web3 = new Web3(window.web3.currentProvider);
//   window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
//     console.log(res);
//   });

//   return (
//     <div className="App">
//       <h2>Lottery Contract</h2>
//       <p>This contract is managed by {this.state.manager}</p>
//     </div>
//   );
// }

// export default App;

export default class App extends Component {
  state = {
    manager: "",
    account: "",
    balance: "",
    players: [],
    message: "",
  };
  async componentDidMount() {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ account: account[0], manager, players, balance });
  }
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} .There are currently{" "}
          {this.state.players.length} players entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            this.setState({ message: "Waiting for transaction success" });
            await lottery.methods.enter().send({
              from: this.state.account,
              value: web3.utils.toWei(this.state.value, "ether"),
            });
            this.setState({ message: "You have been entered" });
          }}
        >
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              type="float"
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <h4>Ready to pick a winner?</h4>
        <button
          onClick={async () => {
            this.setState({ message: "Waiting for transaction success" });
            await lottery.methods
              .pickWinner()
              .send({ from: this.state.account });
            this.setState({ message: "A winner has been picked" });
          }}
        >
          Pick a winner!
        </button>
        <hr />
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}
