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
      </div>
    );
  }
}
