(function() {
	"use strict";
	
	var i18n = require('./i18n').i18n();
	var GameState = require('./game-state');
	
	var precondition = require('./contract').precondition;
	
	exports.newChoice = function() {
		return new PayDepositChoice();
	};
	
	function PayDepositChoice() {
		this.id = 'pay-deposit';
		this.name = i18n.CHOICE_PAY_DEPOSIT.replace('{money}', i18n.formatPrice(50));
	}
	
	PayDepositChoice.prototype.equals = function (other) {
		return (other instanceof PayDepositChoice);
	};
	
	PayDepositChoice.prototype.requiresDice = function () {
		return false;
	};
	
	PayDepositChoice.prototype.computeNextState = function (state) {
		precondition(GameState.isGameState(state),
			'PayDepositChoice requires a game state to compute the next one');
			
		var newPlayers = _.map(state.players(), function (player, index) {
			if (index === state.currentPlayerIndex()) {
				return player.unjail().pay(50);
			}
			
			return player;
		});
			
		return GameState.turnEndState({
			squares: state.squares(),
			players: newPlayers,
			currentPlayerIndex: state.currentPlayerIndex()
		});
	};
}());