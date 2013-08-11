DiceRoller = 
{
	RollD4: function(numDice, exploding)
	{
		return DiceRoller.GDR(4, numDice, exploding);
	},
	RollD6: function(numDice, exploding)
	{
		return DiceRoller.GDR(6, numDice, exploding);
	},
	RollD8: function(numDice, exploding)
	{
		return DiceRoller.GDR(8, numDice, exploding);
	},
	RollD10: function(numDice, exploding)
	{
		return DiceRoller.GDR(10, numDice, exploding);
	},
	RollD12: function(numDice, exploding)
	{
		return DiceRoller.GDR(12, numDice, exploding);
	},
	RollD20: function(numDice, exploding)
	{
		return DiceRoller.GDR(20, numDice, exploding);
	},
	RollD100: function(numDice, exploding)
	{
		return DiceRoller.GDR(100, numDice, exploding);
	},
	GDR: function(diceMax, numDice, exploding)
	{
		var rollDie = function(max, resultobject, exploding)
		{
			var rand = Math.ceil(Math.random()*max);
			resultobject.totalRolled += 1;
			resultobject.rolls.push(rand);
			if(rand === max && exploding)
			{ // explosion!
				resultobject.explosions += 1;
				return rand+rollDie(max, resultobject, exploding); 
				// Surely this recursive behavior will never betray me.
			}
			else
			{
				return rand;
			}
		}

		// this object tracks all the rolls and stuff.
		var resObj = {};
		resObj.totalRolled = 0;
		resObj.explosions = 0;
		resObj.result = 0;
		resObj.rolls = [];

		for(var i=0;i<numDice;i++)
		{
			resObj.result += rollDie(diceMax, resObj, exploding);
		}

		return resObj;
	},

	GenerateRandomInitiatives: function(ruleSystem, amount)
	{
		var result = [];
		if(ruleSystem == "eclipsePhase")
		{
			for(var i=0;i<amount; i++)
			{
				result.push(DiceRoller.RollD100(1, false));
			}
		}
		if(ruleSystem == "drakar")
		{
			for(var i=0;i<amount; i++)
			{
				result.push(DiceRoller.RollD10(1, false));
			}
		}
		return result;
	}
};