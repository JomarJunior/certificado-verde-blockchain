import "@nomicfoundation/hardhat-toolbox";

export const solidity = "0.8.28";
export const networks = {
    hardhat: {
        chainId: 1337,
        allowUnlimitedContractSize: true
    },
    docker: {
        url: "http://blockchain:8545",
        chainId: 1337
    }
};

export default {
    solidity,
    networks
};
