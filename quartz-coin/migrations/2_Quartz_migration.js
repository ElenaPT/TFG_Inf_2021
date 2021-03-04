const ERC20Quartz = artifacts.require("ERC20Quartz");

module.exports = function (deployer) {
  deployer.deploy(ERC20Quartz, 1000);
};
