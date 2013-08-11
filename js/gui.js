
Gui =
{
	AddNewCharacter: function(character)
	{	
		var imageUrl= character.imageUrl;
		var name = character.name;
		var identifier = character.identifier;
		var template = jQuery("#templateContainer .characterContainer").clone();

		imageUrl = imageUrl.split("/");
		imageUrl = imageUrl[imageUrl.length-1];
		imageUrl = "images/"+imageUrl;

		var thumbnail = template.find("img");
		template.css("padding", "5px");
		thumbnail.attr("src", imageUrl);

		template.find(".nameContainer").text(name);
		template.data("identifier", identifier);

		jQuery("#characters").append(template);
		//jQuery(".neatgridster .firstRound").append(template);
	},
	BeginRemoveCharacter: function(identifier)
	{
		var target =jQuery("#"+identifier);
		target.find(".cloneRemoveButtons").fadeOut(function()
		{
			target.find(".confirmButtons a").unbind();

			target.find(".cancelButton").click(function()
			{
				target.find(".confirmButtons").fadeOut(function()
				{
					target.find(".cloneRemoveButtons").fadeIn();
				});
			});

			target.find(".confirmButtons .confirmButton").click(function()
			{
				Gui.EndRemoveCharacter(identifier);
			});

			target.find(".confirmButtons").fadeIn();
		})
		
	},
	EndRemoveCharacter: function(identifier)
	{
		var target =jQuery("#"+identifier);		

		CharacterStore.RemoveCharacter(identifier);
	},
	RemoveAllCharacters: function()
	{
		jQuery("#characters").empty();
	},
	UpdateFromStorage: function()
	{
		Gui.RemoveAllCharacters();
		for(var i=0; i<Characters.length; i++)
		{
			var character = Characters[i];
			var added = Gui.AddNewCharacter(character);
		}
	}
}

Modals = 
{
	UpdateRemoveCharactersModal: function()
	{
		var target = jQuery("#removeCharacterModal .chooseCharacters").empty();

		var c = Characters;
		for(var i=0; i<c.length; i++)
		{
			var clone = jQuery("#templateContainer .characterCheckBox").clone();
			clone.find(".characterName").text(c[i].name);
			clone.find("input").prop("value", c[i].identifier);
			target.append(clone);
		}
	},
	GetChosenCharacterIdentifiers: function()
	{
		var target = jQuery("#removeCharacterModal .chooseCharacters");

		var boxes = target.find("input:checked");
		var selected = [];
		for(var i=0;i<boxes.length;i++)
		{
			var id = jQuery(boxes[i]).prop("value");
			selected.push(id);
		}
		return selected;
	},
	PopulateInitiativeInput: function()
	{
		var target = jQuery("#initativesModal .characterList").empty();

		var c = Characters;
		for(var i=0; i<c.length; i++)
		{
			var clone = jQuery("#templateContainer .initiativeInput").clone();
			clone.find(".characterName").text(c[i].name);
			clone.find(".characterName").data("identifier", c[i].identifier);

			if(c[i].actions)
				clone.find(".actions").prop("value", c[i].actions);

			if(c[i].modifier)
				clone.find(".modifier").prop("value", c[i].modifier);

			target.append(clone);
		}
	},
	ValidateInitiativeInfo: function()
	{
		var target = jQuery("#initativesModal .characterList")
		var inputs = target.find(".initiativeInput");
		if(!inputs.length)
			return false;

		for(var i=0;i<inputs.length;i++)
		{
			target = jQuery(inputs[i]);
			var identifier = target.find(".characterName").data("identifier");
			var initiative = target.find(".initiative").val();
			var modifier = target.find(".modifier").val();
			var actions = target.find(".actions").val();

			if(!jidentifier)
				return false;
			if(!initiative)
				return false;

			// todo: add some number checking here. None of the inputs may be anything else than an integer.
		}
		return true;
	},
	WriteInitiativeInfoToCharacters: function()
	{
		var target = jQuery("#initativesModal .characterList")
		var inputs = target.find(".initiativeInput");
		for(var i=0;i<inputs.length;i++)
		{
			target = jQuery(inputs[i]);
			var identifier = target.find(".characterName").data("identifier");
			var initiative = target.find(".initiative").val();
			var modifier = target.find(".modifier").val();
			var actions = target.find(".actions").val();

			if(!modifier)
				modifier = 0;
			if(!actions)
				actions = 1;

			var initiativeItem = {identifier:identifier, initiative:initiative, 
				modifier:modifier, actions:actions};

			CharacterStore.AddValuesToCharacter(initiativeItem);
			CharacterStore.SyncLocalStore();
		}
	}
}