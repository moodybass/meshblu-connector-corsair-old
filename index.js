'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-corsair')
var keyboard = require('corsair-rgb');


var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
	"lightkeys": {
		"type": "boolean",
		"title": "Light Up Those Keys!",
		"default": true
	},   
   keycolour: {
      "type": "string",
	  "title": "Keyboard Colour",
	  "default": "255,255,255",
      required: true
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    firstExampleOption: {
      type: 'string',
      required: true
    }
  }
};

function Plugin(){
  var self = this;
  self.options = {};
  self.messageSchema = MESSAGE_SCHEMA;
  self.optionsSchema = OPTIONS_SCHEMA;
  return self;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var self = this;
  var payload = message.payload;
  if (payload.lightkeys){
	  keyboard.initialize();
	  keyboard.setKeyColor(keyboard.keymap.all, 255, 255, 0);
	  keyboard.flushLightBuffer();
  }
  self.emit('message', {devices: ['*'], topic: 'echo', payload: payload});
};

Plugin.prototype.onConfig = function(device){
  var self = this;
  self.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options){
  var self = this;
  self.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
