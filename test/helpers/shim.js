// Shim things onto the global object.
global.TodoTxt = require("../../jsTodoTxt.js").TodoTxt;
global.TodoTxtItem = require("../../jsTodoTxt.js").TodoTxtItem;
global.TodoTxtItemHelper = require("../../jsTodoTxt.js").TodoTxtItemHelper;

// And extensions...
global.TodoTxtExtension = require("../../jsTodoExtensions.js").TodoTxtExtension;
global.HiddenExtension = require("../../jsTodoExtensions.js").HiddenExtension;
global.DueExtension = require("../../jsTodoExtensions.js").DueExtension;
