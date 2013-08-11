Characters = [];
// let's add some localStorage syncing to push and splice
// this means that the array may not be reinstantiated and these two methods should be the only ones used for 
// modifying the array, otherwise the localStorage will be out of sync.
Characters.push = function()
{	
	var result = Array.prototype.push.apply(this,arguments);
	CharacterStore.SyncLocalStore();
	return result;
};
Characters.splice = function()
{	
	var result = Array.prototype.splice.apply(this,arguments);
	CharacterStore.SyncLocalStore();
	return result;
};

CharacterStore = 
{
	lsKey: "inKeeperCharacters",	


	GetNewCharacterIdentifier: function()
	{
		return guid();
	},
	AddNewCharacter: function(character)
	{
		// let's sanity check this character first.
		// all of these fields are required. There are lots of voluntary ones though.
		if(!character || !character.name || !character.identifier ||!character.imageUrl)
			return;

		Characters.push(character);

		return character;
	},
	RemoveCharacter: function(identifier)
	{
		for(var i=0;i<Characters.length;i++)
		{
			if(Characters[i].identifier == identifier)
			{
				return Characters.splice(i,1);
			}
		}
		return false;
	},
	GetCharacter: function(identifier)
	{
		for(var i=0;i<Characters.length;i++)
		{
			if(Characters[i].identifier == identifier)
			{
				return Characters[i];
			}
		}
		return false;
	},
	ClearCharacters: function()
	{
		Characters.splice(0, Characters.length);
	},
	CloneCharacter: function(identifier)
	{
		var nc = {};
		var source = CharacterStore.GetCharacter(identifier);
		jQuery.extend(true,nc,source );	
		nc.identifier = guid();	
		CharacterStore.AddNewCharacter(nc);
		Gui.AddNewCharacter(nc);
	},
	AddValuesToCharacter: function(values)
	{
		if(!values || !values.identifier)
			return;

		for(var i=0;i<Characters.length;i++)
		{
			var c= Characters[i];
			if(c.identifier == values.identifier)
			{
				jQuery.extend(true, Characters[i], values);
				return;
			}
		}
	},

	SyncLocalStore: function()
	{
		if(!Modernizr.localstorage)
			return;

		localStorage[CharacterStore.lsKey] = JSON.stringify(Characters);
	},
	GetCharactersInLocalStore: function()
	{
		if(!Modernizr.localstorage)
			return;

		var cs =localStorage[CharacterStore.lsKey];
		if(!cs || !cs.length)
			return;

		var characters = JSON.parse(cs);
		return characters;
	}
}