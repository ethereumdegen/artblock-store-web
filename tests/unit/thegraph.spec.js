import { expect } from 'chai';

import TheGraphHelper from "../../src/js/thegraph-helper.js"
//const TheGraphHelper = require("../src/js/thegraph-helper.js")



describe("The graph api", async function() {

    it("can query", async function() {
     let response = await TheGraphHelper.queryGraphData()

      expect(response).to.equal("ff0000");

    });


});
